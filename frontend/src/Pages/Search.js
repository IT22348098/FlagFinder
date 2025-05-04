import { useState } from 'react';
import { Search, Flag, ChevronDown, Globe, Mail, Twitter, Facebook, Linkedin, Youtube, User, HelpCircle } from 'lucide-react';

export default function FlagFinder() {
  const [countries] = useState([
    { name: 'United States', selected: true },
    { name: 'United Kingdom', selected: true },
    { name: 'Canada', selected: true },
    { name: 'Australia', selected: true },
    { name: 'Germany', selected: true }
  ]);

  return (
    <div className="min-h-screen flex flex-col bg-gray-50">
      {/* Header Navigation */}
      <header className="bg-white shadow-sm">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 py-4 flex items-center justify-between">
          <div className="flex items-center">
            <div className="flex items-center mr-6">
              <Globe className="w-6 h-6 text-indigo-500" />
              <span className="ml-2 text-xl font-bold">Flag Finder</span>
            </div>
            <nav className="hidden sm:flex space-x-8">
              <a href="#" className="text-gray-500 hover:text-gray-900">Home</a>
              <a href="#" className="text-indigo-600 border-b-2 border-indigo-600 pb-1">Search</a>
              <a href="#" className="text-gray-500 hover:text-gray-900">Regions</a>
            </nav>
          </div>
          <div className="flex items-center space-x-4">
            <button className="flex items-center px-4 py-2 text-gray-600 rounded-lg border border-gray-300">
              <User className="w-5 h-5 mr-2" />
              <span>Profile</span>
            </button>
            <button className="flex items-center px-4 py-2 text-white bg-indigo-500 rounded-lg">
              <HelpCircle className="w-5 h-5 mr-2" />
              <span>Help</span>
            </button>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="flex-grow">
        <div className="max-w-3xl mx-auto px-4 sm:px-6 py-8">
          {/* Search Bar */}
          <div className="mb-4 relative">
            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
              <Search className="h-5 w-5 text-gray-400" />
            </div>
            <input
              type="text"
              placeholder="Search for a country..."
              className="block w-full pl-10 pr-3 py-2 border border-gray-300 rounded-lg bg-white shadow-sm focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
            />
          </div>

          {/* Country List */}
          <div className="bg-white rounded-lg shadow">
            {countries.map((country, index) => (
              <div key={index} className="flex items-center px-4 py-3 border-b border-gray-100 last:border-b-0">
                <Flag className="h-5 w-5 text-gray-400 mr-3" />
                <span className="flex-grow">{country.name}</span>
                <ChevronDown className="h-5 w-5 text-gray-400" />
              </div>
            ))}
          </div>
        </div>
      </main>

      {/* Footer */}
      <footer className="bg-white mt-12">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 py-12">
          {/* Logo and Newsletter */}
          <div className="flex flex-col items-center mb-12">
            <div className="flex items-center mb-6">
              <div className="bg-indigo-500 rounded-full p-2">
                <Globe className="h-6 w-6 text-white" />
              </div>
              <span className="ml-3 text-2xl font-bold">Flag Finder</span>
            </div>
            
            <div className="text-center mb-6">
              <h3 className="text-lg font-medium mb-4">Subscribe to our newsletter</h3>
              <div className="flex">
                <div className="relative rounded-md shadow-sm">
                  <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                    <Mail className="h-5 w-5 text-gray-400" />
                  </div>
                  <input
                    type="email"
                    placeholder="Input your email"
                    className="block w-64 pl-10 pr-3 py-2 border border-gray-300 rounded-l-md bg-gray-50 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500"
                  />
                </div>
                <button className="bg-indigo-500 text-white px-4 py-2 rounded-r-md hover:bg-indigo-600 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2">
                  Subscribe
                </button>
              </div>
            </div>
          </div>

          {/* Footer Links */}
          <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
            <div>
              <h3 className="text-lg font-semibold mb-4">Product</h3>
              <ul className="space-y-2">
                <li><a href="#" className="text-gray-600 hover:text-gray-900">Features</a></li>
                <li><a href="#" className="text-gray-600 hover:text-gray-900">Pricing</a></li>
              </ul>
            </div>
            <div>
              <h3 className="text-lg font-semibold mb-4">Resources</h3>
              <ul className="space-y-2">
                <li><a href="#" className="text-gray-600 hover:text-gray-900">Blog</a></li>
                <li><a href="#" className="text-gray-600 hover:text-gray-900">User guides</a></li>
                <li><a href="#" className="text-gray-600 hover:text-gray-900">Webinars</a></li>
              </ul>
            </div>
            <div>
              <h3 className="text-lg font-semibold mb-4">Company</h3>
              <ul className="space-y-2">
                <li><a href="#" className="text-gray-600 hover:text-gray-900">About us</a></li>
                <li><a href="#" className="text-gray-600 hover:text-gray-900">Contact us</a></li>
              </ul>
            </div>
            <div>
              <h3 className="text-lg font-semibold mb-4">Plans & Pricing</h3>
              <ul className="space-y-2">
                <li><a href="#" className="text-gray-600 hover:text-gray-900">Personal</a></li>
                <li><a href="#" className="text-gray-600 hover:text-gray-900">Start up</a></li>
                <li><a href="#" className="text-gray-600 hover:text-gray-900">Organization</a></li>
              </ul>
            </div>
          </div>
          
          {/* Bottom Footer */}
          <div className="mt-12 pt-8 border-t border-gray-200 flex flex-col md:flex-row justify-between items-center">
            <div className="flex items-center mb-4 md:mb-0">
              <button className="flex items-center px-4 py-2 bg-gray-100 rounded-md">
                <span>English</span>
                <ChevronDown className="ml-2 h-4 w-4" />
              </button>
              <div className="ml-4 text-sm text-gray-500">
                © 2024 Brand, Inc. • <a href="#" className="hover:underline">Privacy</a> • <a href="#" className="hover:underline">Terms</a> • <a href="#" className="hover:underline">Sitemap</a>
              </div>
            </div>
            <div className="flex space-x-4">
              <a href="#" className="text-gray-400 hover:text-blue-400"><Twitter className="h-5 w-5" /></a>
              <a href="#" className="text-gray-400 hover:text-blue-600"><Facebook className="h-5 w-5" /></a>
              <a href="#" className="text-gray-400 hover:text-blue-700"><Linkedin className="h-5 w-5" /></a>
              <a href="#" className="text-gray-400 hover:text-red-600"><Youtube className="h-5 w-5" /></a>
            </div>
          </div>
          
          <div className="mt-6 text-center text-sm text-gray-500">
            Made with <span className="text-indigo-500">Visily</span>
          </div>
        </div>
      </footer>
    </div>
  );
}