# WPtique - Digital Marketplace

A comprehensive digital marketplace built with React, TypeScript, Tailwind CSS, and Supabase for selling themes, plugins, templates, and code snippets.

## Features

- **Digital Product Marketplace**: Browse and purchase themes, plugins, templates, and code snippets
- **Multi-Platform Support**: WordPress, React, Vue.js, Laravel, and more
- **Secure Authentication**: Email/password authentication with Supabase Auth
- **Admin Dashboard**: Complete product and order management system
- **Payment Processing**: Stripe integration with support for cards and Google Pay
- **Subscription Plans**: Flexible subscription tiers with different access levels
- **File Management**: Secure file storage and delivery with Supabase Storage
- **Review System**: Customer reviews and ratings for products
- **License Management**: Digital licensing with standard and extended options
- **Responsive Design**: Beautiful, mobile-first design with Tailwind CSS

## Tech Stack

- **Frontend**: React 18, TypeScript, Tailwind CSS
- **Backend**: Supabase (PostgreSQL, Auth, Storage)
- **State Management**: TanStack Query (React Query), Context API
- **Payments**: Stripe Payment Intents, Subscriptions
- **Routing**: React Router
- **Icons**: Lucide React
- **Build Tool**: Vite

## Getting Started

### Prerequisites

- Node.js 18+ and npm
- Supabase account
- Stripe account (for payments)

### Installation

1. **Clone the repository**
   ```bash
   git clone [repository-url]
   cd digital-marketplace
   ```

2. **Install dependencies**
   ```bash
   npm install
   ```

3. **Set up Supabase**
   
   a. Create a new project at [supabase.com](https://supabase.com)
   
   b. Copy your project URL and anon key from Settings > API
   
   c. Create a `.env` file from `.env.example`:
   ```bash
   cp .env.example .env
   ```
   
   d. Update `.env` with your Supabase credentials:
   ```env
   VITE_SUPABASE_URL=your_supabase_project_url
   VITE_SUPABASE_ANON_KEY=your_supabase_anon_key
   ```

4. **Set up the database schema**
   
   a. Go to your Supabase project dashboard
   
   b. Navigate to the SQL Editor
   
   c. Run the migration files in order:
   - Copy and run `supabase/migrations/create_initial_schema.sql`
   - Copy and run `supabase/migrations/seed_initial_data.sql`

5. **Set up Stripe (Optional for development)**
   
   a. Create a Stripe account at [stripe.com](https://stripe.com)
   
   b. Get your publishable and secret keys from the Stripe dashboard
   
   c. Add to your `.env` file:
   ```env
   VITE_STRIPE_PUBLISHABLE_KEY=pk_test_...
   STRIPE_SECRET_KEY=sk_test_...
   ```

6. **Set up Supabase Storage**
   
   a. Go to Storage in your Supabase dashboard
   
   b. Create the following buckets:
   - `product-images` (public)
   - `product-files` (private)
   - `avatars` (public)

7. **Deploy Supabase Edge Functions (Optional)**
   
   If you want to use Stripe payments, deploy the edge functions:
   ```bash
   # Install Supabase CLI first
   npx supabase functions deploy create-payment-intent
   npx supabase functions deploy webhook-stripe
   ```

8. **Start the development server**
   ```bash
   npm run dev
   ```

## Database Schema

The application uses a comprehensive database schema with the following main tables:

- **profiles**: Extended user profiles with roles (admin/customer)
- **categories**: Product categories with hierarchical structure
- **products**: Digital products with pricing, metadata, and files
- **orders**: Purchase orders with Stripe integration
- **subscriptions**: Subscription plans and user subscriptions
- **reviews**: Product reviews and ratings
- **downloads**: Secure download tokens with expiration
- **licenses**: Digital licenses for purchased products

## API Integration

### Supabase Services

The application includes service layers for:
- **Products**: CRUD operations, filtering, search
- **Orders**: Order creation, payment processing
- **Subscriptions**: Plan management, user subscriptions
- **Reviews**: Customer feedback system
- **Downloads**: Secure file delivery

### Stripe Integration

- **Payment Intents**: One-time purchases
- **Subscriptions**: Recurring billing
- **Webhooks**: Order fulfillment automation
- **Google Pay**: Alternative payment method

## Security Features

- **Row Level Security (RLS)**: Database-level access control
- **Secure File Storage**: Private file buckets with signed URLs
- **Download Tokens**: Time-limited, single-use download links
- **License Verification**: Digital rights management
- **Payment Security**: PCI-compliant Stripe integration

## User Roles & Permissions

### Customer Role
- Browse and purchase products
- Manage subscriptions
- Download purchased files
- Leave reviews and ratings
- Access purchase history

### Admin Role
- Full product management (CRUD)
- Order and customer management
- Analytics and reporting
- Content management
- System administration

## Development Workflow

### Adding New Products

1. Admin creates product with metadata
2. Upload product files to Supabase Storage
3. Set pricing and licensing options
4. Configure categories and tags
5. Enable for public viewing

### Order Processing

1. Customer adds items to cart
2. Checkout creates Stripe Payment Intent
3. Payment confirmation triggers webhook
4. Order status updated to "completed"
5. Download tokens and licenses generated
6. Customer receives access to files

## Deployment

### Frontend Deployment

The React application can be deployed to any static hosting service:

```bash
npm run build
```

### Backend Services

- **Database**: Hosted on Supabase
- **Authentication**: Supabase Auth
- **File Storage**: Supabase Storage
- **Edge Functions**: Supabase Functions
- **Payments**: Stripe

### Environment Variables for Production

```env
# Supabase
VITE_SUPABASE_URL=https://your-project.supabase.co
VITE_SUPABASE_ANON_KEY=your_anon_key

# Stripe
VITE_STRIPE_PUBLISHABLE_KEY=pk_live_...
STRIPE_SECRET_KEY=sk_live_...
STRIPE_WEBHOOK_SECRET=whsec_...

# App
VITE_APP_URL=https://your-domain.com
```

## Testing

### Test Data

The seed file includes sample categories and subscription plans. You can create test products through the admin interface.

### Stripe Testing

Use Stripe's test card numbers:
- Success: `4242 4242 4242 4242`
- Decline: `4000 0000 0000 0002`

## Monitoring & Analytics

- **Supabase Dashboard**: Database metrics and logs
- **Stripe Dashboard**: Payment analytics
- **Application Metrics**: Built-in download and view tracking

## Support & Documentation

### Key Documentation
- [Supabase Docs](https://supabase.com/docs)
- [Stripe API Reference](https://stripe.com/docs/api)
- [React Query Docs](https://tanstack.com/query/latest)
- [Tailwind CSS Docs](https://tailwindcss.com/docs)

### Common Issues

1. **CORS Errors**: Ensure your domain is added to Supabase allowed origins
2. **File Upload Issues**: Check storage bucket permissions
3. **Payment Failures**: Verify Stripe webhook endpoints
4. **Authentication Issues**: Check RLS policies and user roles

## Available Scripts

- `npm run dev` - Start development server
- `npm run build` - Build for production
- `npm run preview` - Preview production build
- `npm run lint` - Run ESLint

## Project Structure

```
src/
├── components/          # Reusable UI components
│   ├── common/         # Shared components
│   ├── layout/         # Layout components (Header, Footer)
│   └── products/       # Product-specific components
├── contexts/           # React contexts (Auth, Cart)
├── hooks/              # Custom React hooks and queries
├── lib/                # Third-party configurations (Supabase)
├── pages/              # Page components and routes
├── services/           # API services and business logic
├── types/              # TypeScript type definitions
└── data/               # Static data and constants

supabase/
├── functions/          # Edge functions for payments
└── migrations/         # Database schema and seed data
```

## Performance Optimizations

- **React Query**: Intelligent caching and background updates
- **Image Optimization**: Responsive images with proper sizing
- **Code Splitting**: Route-based code splitting with React Router
- **Database Indexing**: Optimized queries with proper indexes
- **CDN Delivery**: Static assets served via CDN

## Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Submit a pull request

## Roadmap

- [ ] Advanced analytics dashboard
- [ ] Multi-vendor marketplace support
- [ ] Advanced search with Elasticsearch
- [ ] Mobile app with React Native
- [ ] AI-powered product recommendations
- [ ] Affiliate program management
- [ ] Multi-language support
- [ ] Advanced reporting and exports

## License

This project is licensed under the MIT License.