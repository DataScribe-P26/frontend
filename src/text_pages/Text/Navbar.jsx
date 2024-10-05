import React from "react";
import { HiAnnotation } from "react-icons/hi";
import { Link } from "react-router-dom";

const Navbar = () => {
  return (
    <nav className="bg-gradient-to-r from-indigo-600 to-indigo-800 text-white px-6 py-5 shadow-lg">
      <div className="container mx-auto flex items-center justify-between">
        <Link className="flex items-center">
          <HiAnnotation className="mr-3 text-4xl transform transition-transform duration-300 hover:scale-110" />
          <h1 className="text-3xl font-extrabold tracking-wide">
            Datascribe.{" "}
          </h1>
        </Link>
      </div>
    </nav>
  );
};

export default Navbar;
