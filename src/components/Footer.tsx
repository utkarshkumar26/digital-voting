
import React from 'react';

const Footer = () => {
  return (
    <footer className="bg-gray-100 py-4 mt-auto border-t">
      <div className="container mx-auto px-4">
        <div className="flex flex-col md:flex-row justify-between items-center">
          <div className="mb-4 md:mb-0">
            <p className="text-sm text-gray-600">
              &copy; {new Date().getFullYear()} Election Commission of India
            </p>
          </div>
          <div className="flex space-x-6">
            <a href="#" className="text-sm text-gray-600 hover:text-india-blue">
              Terms of Service
            </a>
            <a href="#" className="text-sm text-gray-600 hover:text-india-blue">
              Privacy Policy
            </a>
            <a href="#" className="text-sm text-gray-600 hover:text-india-blue">
              Contact
            </a>
          </div>
        </div>
        <div className="mt-4 text-center">
          <p className="text-xs text-gray-500">
            This is a demo application. Not affiliated with the actual Election Commission of India.
          </p>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
