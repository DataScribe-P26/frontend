import React from "react";
import { HiAnnotation, HiPhotograph, HiDocumentText } from "react-icons/hi";
import { Link } from "react-router-dom";



const Mainhome = () => {
  return (
    <div className="min-h-screen bg-gray-50 text-gray-800 font-sans">
      <nav className="bg-gradient-to-r from-purple-700 to-purple-900 text-white px-6 py-5 shadow-lg">
      <div className=" flex items-center justify-between">
        <Link className="flex items-center">
          <HiAnnotation className="mr-3 text-4xl transform transition-transform duration-300 hover:scale-110" />
          <h1 className="text-3xl font-extrabold tracking-wide">
            Datascribe.ai{" "}
          </h1>
        </Link>
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
          <div className="bg-white p-6 rounded-xl shadow hover:shadow-sm transition-shadow duration-200 ease-in-out">              
            <div className="flex items-center mb-4">
                <HiPhotograph className="text-4xl text-purple-700 mr-4" />
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
          <div className="bg-white p-6 rounded-xl shadow hover:shadow-sm transition-shadow duration-200 ease-in-out">              
            <div className="flex items-center mb-4">
                <HiDocumentText className="text-4xl text-purple-700 mr-4" />
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
