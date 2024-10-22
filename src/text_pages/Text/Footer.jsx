import React from "react";

const Footer = () => {
  return (
    <footer className="bg-gradient-to-r from-gray-200 to-gray-300 text-purple py-4 mt-8">
      <div className="container mx-auto flex flex-col md:flex-row items-center justify-between px-6">
        <div className="text-sm text-center md:text-left">
          &copy; {new Date().getFullYear()} Datascribe.ai  All rights reserved.
        </div>
      
        
      </div>
    </footer>
  );
};

export default Footer;
