import React from 'react';
import { Link } from 'react-router-dom';
import { Code2, Github, Twitter, Linkedin } from 'lucide-react';

const Footer: React.FC = () => {
  const footerSections = [
    {
      title: 'Platforms',
      links: [
        { name: 'WordPress Themes', href: '/products?platform=wordpress&type=themes' },
        { name: 'React Components', href: '/products?platform=react&type=components' },
        { name: 'Vue.js Templates', href: '/products?platform=vue&type=templates' },
        { name: 'Laravel Packages', href: '/products?platform=laravel&type=packages' },
      ],
    },
    {
      title: 'Product Types',
      links: [
        { name: 'Themes & Templates', href: '/products?type=themes' },
        { name: 'Plugins & Extensions', href: '/products?type=plugins' },
        { name: 'Code Snippets', href: '/products?type=snippets' },
        { name: 'UI Components', href: '/products?type=components' },
      ],
    },
    {
      title: 'Support',
      links: [
        { name: 'Help Center', href: '/help' },
        { name: 'Documentation', href: '/docs' },
        { name: 'Contact Us', href: '/contact' },
        { name: 'Seller Guide', href: '/sell' },
      ],
    },
    {
      title: 'Company',
      links: [
        { name: 'About Us', href: '/about' },
        { name: 'Privacy Policy', href: '/privacy' },
        { name: 'Terms of Service', href: '/terms' },
        { name: 'Refund Policy', href: '/refunds' },
      ],
    },
  ];

  return (
    <footer className="bg-gray-900 text-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-8">
          {/* Brand Section */}
          <div className="lg:col-span-1">
            <Link to="/" className="flex items-center space-x-2 mb-4">
              <div className="p-2 bg-gradient-to-br from-blue-600 to-purple-600 rounded-lg">
                <Code2 className="w-6 h-6 text-white" />
              </div>
              <span className="text-xl font-bold">DevMarket</span>
            </Link>
            <p className="text-gray-400 text-sm mb-4">
              Premium digital marketplace for developers and designers. 
              Quality themes, plugins, and code snippets for modern web development.
            </p>
            <div className="flex space-x-4">
              <a href="#" className="text-gray-400 hover:text-white transition-colors duration-200">
                <Github className="w-5 h-5" />
              </a>
              <a href="#" className="text-gray-400 hover:text-white transition-colors duration-200">
                <Twitter className="w-5 h-5" />
              </a>
              <a href="#" className="text-gray-400 hover:text-white transition-colors duration-200">
                <Linkedin className="w-5 h-5" />
              </a>
            </div>
          </div>

          {/* Footer Links */}
          {footerSections.map((section) => (
            <div key={section.title}>
              <h3 className="text-sm font-semibold text-white uppercase tracking-wider mb-4">
                {section.title}
              </h3>
              <ul className="space-y-2">
                {section.links.map((link) => (
                  <li key={link.name}>
                    <Link
                      to={link.href}
                      className="text-gray-400 hover:text-white transition-colors duration-200 text-sm"
                    >
                      {link.name}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>

        {/* Bottom Section */}
        <div className="border-t border-gray-800 mt-8 pt-8 flex flex-col sm:flex-row justify-between items-center">
          <p className="text-gray-400 text-sm">
            © 2025 DevMarket. All rights reserved.
          </p>
          <div className="flex items-center space-x-6 mt-4 sm:mt-0">
            <span className="text-gray-400 text-sm">Secure payments powered by</span>
            <div className="flex items-center space-x-3">
              <span className="text-blue-400 font-semibold text-sm">Stripe</span>
              <span className="text-gray-600">•</span>
              <span className="text-green-400 font-semibold text-sm">Google Pay</span>
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;