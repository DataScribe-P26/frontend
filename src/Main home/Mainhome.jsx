import React from "react";
import { HiAnnotation, HiPhotograph, HiDocumentText } from "react-icons/hi";
import { Link } from "react-router-dom";

const Mainhome = () => {
  return (
    <div className="min-h-screen bg-gray-50 text-gray-800 font-sans">
      <nav className="bg-gradient-to-r from-indigo-600 to-indigo-800 text-white shadow-lg">
        <div className="container mx-auto px-4 py-6 flex justify-between items-center">
          <h1 className="text-3xl font-extrabold tracking-wide flex items-center">
            Datascribe.
          </h1>
        </div>
      </nav>

      <main className="container mx-auto px-4 py-12">
        <h2 className="text-3xl font-bold text-center mb-8">
          A Professional Platform for Data Annotations
        </h2>
        <p className="text-xl text-center text-gray-600 mb-12 max-w-3xl mx-auto">
          Streamline your annotation process with our intuitive tools for both
          image and text data.
        </p>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 max-w-4xl mx-auto">
          <Link
            to="/image"
            className="transform hover:scale-105 transition-transform duration-300"
          >
            <div className="bg-white p-6 rounded-xl shadow-md hover:shadow-xl transition-shadow">
              <div className="flex items-center mb-4">
                <HiPhotograph className="text-4xl text-indigo-600 mr-4" />
                <h3 className="text-2xl font-semibold">Image Annotations</h3>
              </div>
              <p className="text-gray-600">
                Effortlessly annotate your images with our intuitive tool.
              </p>
            </div>
          </Link>
          <Link
            to="/text"
            className="transform hover:scale-105 transition-transform duration-300 cursor-pointer"
          >
            <div className="bg-white p-6 rounded-xl shadow-md hover:shadow-xl transition-shadow">
              <div className="flex items-center mb-4">
                <HiDocumentText className="text-4xl text-indigo-600 mr-4" />
                <h3 className="text-2xl font-semibold">Text Annotations</h3>
              </div>
              <p className="text-gray-600">
                Streamline your text annotation process with our intuitive
                tools.
              </p>
            </div>
          </Link>
        </div>
      </main>
    </div>
  );
};

export default Mainhome;
