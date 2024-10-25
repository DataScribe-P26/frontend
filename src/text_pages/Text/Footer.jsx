import React from "react";

const Footer = () => {
  return (
    <footer className="text-purple py-4 mt-8">
      <div className="flex flex-col items-center justify-center px-6">
        <div className="text-sm text-center">
          &copy; {new Date().getFullYear()} Datascribe.ai. All rights reserved.
        </div>
      </div>
    </footer>
  );
};

export default Footer;
