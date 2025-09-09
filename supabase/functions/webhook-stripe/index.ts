import { serve } from 'https://deno.land/std@0.168.0/http/server.ts'
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2'
import Stripe from 'https://esm.sh/stripe@12.0.0?target=deno'

const stripe = new Stripe(Deno.env.get('STRIPE_SECRET_KEY') || '', {
  apiVersion: '2022-11-15',
})

const supabaseUrl = Deno.env.get('SUPABASE_URL')!
const supabaseServiceKey = Deno.env.get('SUPABASE_SERVICE_ROLE_KEY')!
const supabase = createClient(supabaseUrl, supabaseServiceKey)

const webhookSecret = Deno.env.get('STRIPE_WEBHOOK_SECRET')!

serve(async (req) => {
  const signature = req.headers.get('stripe-signature')

  try {
    const body = await req.text()
    const event = stripe.webhooks.constructEvent(body, signature!, webhookSecret)

    switch (event.type) {
      case 'payment_intent.succeeded':
        await handlePaymentSuccess(event.data.object as Stripe.PaymentIntent)
        break
      case 'payment_intent.payment_failed':
        await handlePaymentFailed(event.data.object as Stripe.PaymentIntent)
        break
      case 'invoice.payment_succeeded':
        await handleSubscriptionPayment(event.data.object as Stripe.Invoice)
        break
      case 'customer.subscription.deleted':
        await handleSubscriptionCancelled(event.data.object as Stripe.Subscription)
        break
    }

    return new Response(JSON.stringify({ received: true }), {
      headers: { 'Content-Type': 'application/json' },
      status: 200,
    })
  } catch (error) {
    console.error('Webhook error:', error)
    return new Response(
      JSON.stringify({ error: error.message }),
      {
        headers: { 'Content-Type': 'application/json' },
        status: 400,
      }
    )
  }
})

async function handlePaymentSuccess(paymentIntent: Stripe.PaymentIntent) {
  // Update order status
  const { error } = await supabase
    .from('orders')
    .update({ status: 'completed' })
    .eq('stripe_payment_intent_id', paymentIntent.id)

  if (error) {
    console.error('Error updating order:', error)
    return
  }

  // Get order details
  const { data: order } = await supabase
    .from('orders')
    .select(`
      *,
      items:order_items(
        *,
        product:products(
          *,
          files:product_files(*)
        )
      )
    `)
    .eq('stripe_payment_intent_id', paymentIntent.id)
    .single()

  if (!order) return

  // Create download tokens and licenses
  const downloadTokens = []
  const licenses = []

  for (const item of order.items) {
    // Create license
    licenses.push({
      user_id: order.user_id,
      product_id: item.product_id,
      order_id: order.id,
      license_key: `LIC-${Date.now()}-${Math.random().toString(36).substr(2, 9).toUpperCase()}`,
      license_type: item.license_type,
    })

    // Create download tokens for each file
    if (item.product?.files) {
      for (const file of item.product.files) {
        const token = crypto.randomUUID()
        const expiresAt = new Date()
        expiresAt.setDate(expiresAt.getDate() + 30) // 30 days expiry

        downloadTokens.push({
          user_id: order.user_id,
          product_id: item.product_id,
          order_id: order.id,
          file_id: file.id,
          download_token: token,
          expires_at: expiresAt.toISOString(),
        })
      }
    }
  }

  // Insert licenses and download tokens
  if (licenses.length > 0) {
    await supabase.from('licenses').insert(licenses)
  }

  if (downloadTokens.length > 0) {
    await supabase.from('downloads').insert(downloadTokens)
  }
}

async function handlePaymentFailed(paymentIntent: Stripe.PaymentIntent) {
  const { error } = await supabase
    .from('orders')
    .update({ status: 'failed' })
    .eq('stripe_payment_intent_id', paymentIntent.id)

  if (error) {
    console.error('Error updating failed order:', error)
  }
}

async function handleSubscriptionPayment(invoice: Stripe.Invoice) {
  if (invoice.subscription && invoice.paid) {
    // Update subscription status
    const { error } = await supabase
      .from('user_subscriptions')
      .update({ status: 'active' })
      .eq('stripe_subscription_id', invoice.subscription)

    if (error) {
      console.error('Error updating subscription:', error)
    }
  }
}

async function handleSubscriptionCancelled(subscription: Stripe.Subscription) {
  const { error } = await supabase
    .from('user_subscriptions')
    .update({ status: 'cancelled' })
    .eq('stripe_subscription_id', subscription.id)

  if (error) {
    console.error('Error cancelling subscription:', error)
  }
}