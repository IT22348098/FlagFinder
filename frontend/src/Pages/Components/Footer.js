import React from "react";
import { Globe } from "lucide-react";

export default function Footer() {
  return (
    <footer className="bg-white py-12 mt-auto">
      <div className="max-w-6xl mx-auto px-6">
        {/* Logo and Newsletter */}
        <div className="flex flex-col items-center mb-10">
          <div className="flex items-center mb-6">
            <div className="w-8 h-8 bg-indigo-500 rounded-full flex items-center justify-center mr-2">
              <Globe className="w-5 h-5 text-white" />
            </div>
            <span className="font-bold text-xl">Flag Finder</span>
          </div>

          <div className="w-full max-w-md">
            <p className="text-center text-gray-600 mb-3">
              Subscribe to our newsletter
            </p>
            <div className="flex">
              <input
                type="email"
                placeholder="Enter your email"
                className="flex-grow border border-gray-300 rounded-l px-4 py-2 focus:outline-none focus:ring-2 focus:ring-indigo-500"
              />
              <button className="bg-indigo-500 text-white px-4 py-2 rounded-r">
                Subscribe
              </button>
            </div>
          </div>
        </div>

        {/* Footer Links */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-8 mb-10">
          <div>
            <h4 className="font-bold mb-4">Product</h4>
            <ul className="space-y-2">
              <li>
                <a href="#" className="text-gray-600 hover:text-gray-900">
                  Features
                </a>
              </li>
              <li>
                <a href="#" className="text-gray-600 hover:text-gray-900">
                  Pricing
                </a>
              </li>
            </ul>
          </div>

          <div>
            <h4 className="font-bold mb-4">Resources</h4>
            <ul className="space-y-2">
              <li>
                <a href="#" className="text-gray-600 hover:text-gray-900">
                  Blog
                </a>
              </li>
              <li>
                <a href="#" className="text-gray-600 hover:text-gray-900">
                  User guides
                </a>
              </li>
              <li>
                <a href="#" className="text-gray-600 hover:text-gray-900">
                  Webinars
                </a>
              </li>
            </ul>
          </div>

          <div>
            <h4 className="font-bold mb-4">Company</h4>
            <ul className="space-y-2">
              <li>
                <a href="#" className="text-gray-600 hover:text-gray-900">
                  About us
                </a>
              </li>
              <li>
                <a href="#" className="text-gray-600 hover:text-gray-900">
                  Contact us
                </a>
              </li>
            </ul>
          </div>

          <div>
            <h4 className="font-bold mb-4">Data Sources</h4>
            <ul className="space-y-2">
              <li>
                <a
                  href="https://restcountries.com"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-gray-600 hover:text-gray-900"
                >
                  REST Countries API
                </a>
              </li>
            </ul>
          </div>
        </div>

        {/* Bottom Bar */}
        <div className="flex flex-col md:flex-row justify-between items-center pt-8 border-t border-gray-200">
          <div className="flex items-center mb-4 md:mb-0">
            <select className="bg-gray-100 border border-gray-300 text-gray-700 py-1 px-3 rounded text-sm">
              <option>English</option>
            </select>
            <div className="text-gray-500 text-sm ml-4">
              © 2025 Flag Finder •{" "}
              <a href="#" className="hover:text-gray-700">
                Privacy
              </a>{" "}
              •{" "}
              <a href="#" className="hover:text-gray-700">
                Terms
              </a>
            </div>
          </div>

          <div className="flex space-x-4">
            <a href="#" className="text-gray-500 hover:text-blue-400">
              <svg
                className="w-5 h-5"
                fill="currentColor"
                viewBox="0 0 24 24"
              >
                <path d="M24 4.557c-.883.392-1.832.656-2.828.775 1.017-.609 1.798-1.574 2.165-2.724-.951.564-2.005.974-3.127 1.195-.897-.957-2.178-1.555-3.594-1.555-3.179 0-5.515 2.966-4.797 6.045-4.091-.205-7.719-2.165-10.148-5.144-1.29 2.213-.669 5.108 1.523 6.574-.806-.026-1.566-.247-2.229-.616-.054 2.281 1.581 4.415 3.949 4.89-.693.188-1.452.232-2.224.084.626 1.956 2.444 3.379 4.6 3.419-2.07 1.623-4.678 2.348-7.29 2.04 2.179 1.397 4.768 2.212 7.548 2.212 9.142 0 14.307-7.721 13.995-14.646.962-.695 1.797-1.562 2.457-2.549z"></path>
              </svg>
            </a>
            <a href="#" className="text-gray-500 hover:text-blue-600">
              <svg
                className="w-5 h-5"
                fill="currentColor"
                viewBox="0 0 24 24"
              >
                <path d="M9 8h-3v4h3v12h5v-12h3.642l.358-4h-4v-1.667c0-.955.192-1.333 1.115-1.333h2.885v-5h-3.808c-3.596 0-5.192 1.583-5.192 4.615v3.385z"></path>
              </svg>
            </a>
            <a href="#" className="text-gray-500 hover:text-red-600">
              <svg
                className="w-5 h-5"
                fill="currentColor"
                viewBox="0 0 24 24"
              >
                <path d="M19.615 3.184c-3.604-.246-11.631-.245-15.23 0-3.897.266-4.356 2.62-4.385 8.816.029 6.185.484 8.549 4.385 8.816 3.6.245 11.626.246 15.23 0 3.897-.266 4.356-2.62 4.385-8.816-.029-6.185-.484-8.549-4.385-8.816zm-10.615 12.816v-8l8 3.993-8 4.007z"></path>
              </svg>
            </a>
          </div>
        </div>
      </div>
    </footer>
  );
}