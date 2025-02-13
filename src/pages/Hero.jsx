// Hero.jsx
import React, { useState, useEffect } from 'react';

const Hero = ({ isCollapsed }) => {
  const [isLoaded, setIsLoaded] = useState(false);
  const [scrollY, setScrollY] = useState(0);

  useEffect(() => {
    document.body.classList.add("overflow-hidden");
    return () => {
      document.body.classList.remove("overflow-hidden");
    };
  }, []);

  useEffect(() => {
    setTimeout(() => {
      setIsLoaded(true);
    }, 100);

    const handleScroll = () => {
      setScrollY(window.scrollY);
    };

    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  return (
    <div
      className="min-h-screen bg-white dark:bg-gray-900 overflow-hidden transition-all duration-300"
      style={{
        marginLeft: isCollapsed ? '0rem' : '0rem',
      }}
    >
      {/* Animated Geometric Shapes */}
      <div className="fixed inset-0 pointer-events-none">
        {[...Array(5)].map((_, i) => (
          <div
            key={i}
            className={`absolute transition-all duration-1000 rounded-full mix-blend-multiply dark:mix-blend-screen
              ${isLoaded ? 'opacity-20 scale-100' : 'opacity-0 scale-0'}`}
            style={{
              left: `${Math.random() * 100}%`,
              top: `${Math.random() * 100}%`,
              width: `${(Math.random() * 200) + 100}px`,
              height: `${(Math.random() * 200) + 100}px`,
              background: `rgb(${Math.random() * 255}, ${Math.random() * 100}, ${Math.random() * 255})`,
              transitionDelay: `${800 + (i * 100)}ms`,
              transform: `translateY(${scrollY * (0.1 * (i + 1))}px)`,
            }}
          />
        ))}
      </div>

      {/* Main Content with Enhanced Animations */}
      <div className="relative">
        <div className="container px-0 pt-0 pb-40 relative z-10 mr-0">
          <div className="max-w-2xl ml-6">
            <div className="overflow-hidden mb-4">
              <h1
                className={`text-7xl mt-6 font-bold text-purple-900 dark:text-purple-400 transition-all duration-1000
                  ${isLoaded ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-full'}`}
                style={{ transitionDelay: '400ms' }}
              >
                DataScribe.ai
              </h1>
            </div>
            <div className="overflow-hidden mb-4">
              <h1
                className={`text-7xl font-bold text-purple-900 dark:text-purple-400 transition-all duration-1000
                  ${isLoaded ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-full'}`}
                style={{ transitionDelay: '600ms' }}
              >
                Data Annotation
              </h1>
            </div>
            <p
              className={`text-purple-700 dark:text-purple-300 text-xl mb-8 transition-all duration-1000
                ${isLoaded ? 'opacity-100 translate-x-0' : 'opacity-0 -translate-x-20'}`}
              style={{ transitionDelay: '800ms' }}
            >
              Revolutionizing Data Annotation with AI
            </p>
            <p
              className={`text-gray-600 dark:text-gray-300 mb-8 max-w-md transition-all duration-1000
                ${isLoaded ? 'opacity-100 translate-x-0' : 'opacity-0 -translate-x-20'}`}
              style={{ transitionDelay: '1000ms' }}
            >
              At DataScribe.ai, we simplify and accelerate the data annotation process using cutting-edge AI technology.
              Our auto-annotation platform enables users to upload hundreds of images, annotate a few, and let AI handle
              the rest—boosting efficiency while maintaining high accuracy.
            </p>
            <button
              className={`px-6 py-3 bg-purple-700 dark:bg-purple-600 text-white rounded-md
                hover:bg-purple-800 dark:hover:bg-purple-700 hover:scale-105 transform transition-all duration-300
                ${isLoaded ? 'opacity-100 translate-y-0 rotate-0' : 'opacity-0 translate-y-10 -rotate-12'}`}
              style={{ transitionDelay: '1200ms' }}
            >
              LEARN MORE
            </button>

            <div
              className={`flex space-x-6 mt-12 transition-all duration-1000
                ${isLoaded ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-10'}`}
              style={{ transitionDelay: '1400ms' }}
            >
              {['facebook', 'twitter', 'instagram'].map((platform, index) => (
                <a
                  key={platform}
                  href="#"
                  className={`text-purple-700 dark:text-purple-400 hover:text-purple-900 dark:hover:text-purple-300
                    transform hover:scale-110 transition-all duration-300
                    ${isLoaded ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-10'}`}
                  style={{ transitionDelay: `${1600 + (index * 100)}ms` }}
                >
                  {/* Social media icons remain the same */}
                  {/* ... SVG content ... */}
                </a>
              ))}
            </div>
          </div>
        </div>

        {/* Enhanced Background Elements */}
        <div className="absolute top-0 right-0 w-1/2 h-full overflow-hidden">
          <div
            className={`absolute top-0 right-0 w-full h-full bg-purple-600/90 dark:bg-purple-800/90
              rounded-l-full transform transition-all duration-1500 ease-out
              ${isLoaded ? 'translate-x-1/3 scale-100 opacity-100' : 'translate-x-full scale-150 opacity-0'}`}
          ></div>
          {[...Array(3)].map((_, i) => (
            <div
              key={i}
              className={`absolute w-32 h-32 rounded-full opacity-60
                transform transition-all duration-1000 hover:scale-110
                ${isLoaded ? 'translate-y-0 opacity-60' : 'translate-y-full opacity-0'}`}
              style={{
                top: `${25 + (i * 25)}%`,
                right: `${20 + (i * 10)}%`,
                backgroundColor: i === 0 ? '#E9D5FF' : i === 1 ? '#F0ABFC' : '#DDD6FE',
                transform: `translateY(${scrollY * (0.1 * (i + 1))}px)`,
                transitionDelay: `${1800 + (i * 200)}ms`
              }}
            ></div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default Hero;
