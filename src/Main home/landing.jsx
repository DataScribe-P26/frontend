import React, { useState, useEffect } from 'react';
import { HiAnnotation } from 'react-icons/hi';
import { Link, useNavigate } from 'react-router-dom';
import { 
  Image, FileText, Brain, Zap, Lock, Database, 
  ChevronRight, BarChart, Cloud, Settings,
  Box, Layers, ArrowRight, Mouse, Code,
  PieChart, GitBranch, Upload, Download
} from 'lucide-react';
import PricingModal from '../partials/PricingModal';

const LandingPage = () => {
  const [isVisible, setIsVisible] = useState(false);
  const [activeTab, setActiveTab] = useState('image');
  const [hoveredCard, setHoveredCard] = useState(null);
  const [scrollProgress, setScrollProgress] = useState(0);
  const [mousePosition, setMousePosition] = useState({ x: 0, y: 0 });
  const navigate = useNavigate();
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isVideoPlaying, setIsVideoPlaying] = useState({ image: false, text: false });

  useEffect(() => {
    setIsVisible(true);
    
    const handleScroll = () => {
      const totalScroll = document.documentElement.scrollHeight - window.innerHeight;
      const currentProgress = (window.scrollY / totalScroll) * 100;
      setScrollProgress(currentProgress);
    };

    const handleMouseMove = (e) => {
      setMousePosition({
        x: (e.clientX / window.innerWidth) * 100,
        y: (e.clientY / window.innerHeight) * 100,
      });
    };

    window.addEventListener('scroll', handleScroll);
    window.addEventListener('mousemove', handleMouseMove);
    return () => {
      window.removeEventListener('scroll', handleScroll);
      window.removeEventListener('mousemove', handleMouseMove);
    };
  }, []);

  // Animated background gradient based on mouse position
  const gradientStyle = {
    background: `radial-gradient(circle at ${mousePosition.x}% ${mousePosition.y}%, 
      rgba(147, 51, 234, 0.1) 0%, 
      rgba(139, 92, 246, 0.05) 35%, 
      rgba(255, 255, 255, 0) 70%)`
  };

  // Floating particles animation
  const Particles = () => (
    <div className="absolute inset-0 overflow-hidden pointer-events-none">
      {[...Array(20)].map((_, i) => (
        <div
          key={i}
          className="absolute w-2 h-2 bg-purple-200 rounded-full opacity-20"
          style={{
            top: `${Math.random() * 100}%`,
            left: `${Math.random() * 100}%`,
            animation: `float ${5 + Math.random() * 10}s linear infinite`,
            animationDelay: `${-Math.random() * 5}s`
          }}
        />
      ))}
    </div>
  );

  // New statistics section data
  const statistics = [
    { label: 'Active Users', value: '10,000+' },
    { label: 'Annotations/Day', value: '1M+' },
    { label: 'Accuracy Rate', value: '99.9%' },
    { label: 'Time Saved', value: '75%' }
  ];

  const handleVideoClick = (type) => {
    setIsVideoPlaying(prev => ({
      ...prev,
      [type]: !prev[type]
    }));
  };

  return (
    <div className="min-h-screen bg-white">
      <style>
        {`
          @keyframes float {
            0% { transform: translate(0, 0) rotate(0deg); }
            50% { transform: translate(100px, 100px) rotate(180deg); }
            100% { transform: translate(0, 0) rotate(360deg); }
          }
          
          @keyframes pulse {
            0% { transform: scale(1); }
            50% { transform: scale(1.05); }
            100% { transform: scale(1); }
          }
          
          .feature-card:hover {
            animation: pulse 2s infinite;
          }
        `}
      </style>

      {/* Progress Bar */}
      <div 
        className="fixed top-0 left-0 h-1 bg-purple-600 z-50 transition-all duration-300"
        style={{ width: `${scrollProgress}%` }}
      />

      {/* Animated Background */}
      <div 
        className="fixed inset-0 z-0 transition-all duration-500 pointer-events-none"
        style={gradientStyle}
      >
        <Particles />
      </div>

      {/* Rest of the navigation remains the same */}
      {/* Navigation */}
      <nav className="bg-white/80 backdrop-blur-md shadow-sm fixed w-full z-40">
        <div className="container mx-auto px-2 py-2 flex justify-between items-center">
        <div className="flex items-center justify-between">
            <HiAnnotation className=" ml-2 text-3xl  text-purple-600" />
            <h1 className="text-2xl font-bold px-4 py-2 text-purple-900 ml-2">Datascribe.ai</h1>
            </div>
          <div className="hidden md:flex space-x-6">
            <a href="#features" className= "px-4 py-2 text-purple-600 hover:text-purple-900 transition-colors"
            >Features</a>
            <a href="#models" className=" px-4 py-2 text-purple-600 hover:text-purple-900 transition-colors">Models</a>
            <a href="#models" className=" px-4 py-2 text-purple-600 hover:text-purple-900 transition-colors"
            onClick={() => setIsModalOpen(true)}>Pricing  </a>
            
            <a href="#contact" className="px-4 py-2 text-purple-600 hover:text-purple-900 transition-colors">Contact</a>
            <Link to="/register" className="flex items-center">
            <button className="bg-purple-600 text-white px-4 py-2 rounded-lg hover:bg-purple-700 transition-all hover:scale-105">
              Get Started
            </button>
            </Link>
            
          </div>
        
        </div>
        
      </nav>

      {/* Enhanced Hero Section */}
      <section className="relative pt-24 pb-16">
        <div className="container mx-auto px-4">
          <div className={`max-w-4xl mx-auto text-center transform transition-all duration-1000 ${
            isVisible ? 'translate-y-0 opacity-100' : 'translate-y-10 opacity-0'
          }`}>
            <div className="relative">
              <h1 className="text-5xl md:text-6xl font-bold text-purple-900 mb-6 relative z-10">
                Intelligent Auto-Annotation
                <span className="text-purple-600"> Platform</span>
                <div className="absolute -top-4 -right-4 w-20 h-20 bg-purple-200 rounded-full opacity-50 blur-xl animate-pulse" />
                <div className="absolute -bottom-4 -left-4 w-16 h-16 bg-purple-300 rounded-full opacity-50 blur-xl animate-pulse" />
              </h1>
            </div>
            <p className="text-xl text-purple-700 mb-8">
              Accelerate your ML pipeline with advanced image and text annotation
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <button className="group bg-purple-600 text-white px-8 py-3 rounded-lg hover:bg-purple-700 transition-all hover:scale-105 flex items-center justify-center gap-2">
                Start Free Trial 
                <ChevronRight className="w-5 h-5 transform group-hover:translate-x-1 transition-transform" />
              </button>
              <button className="border-2 border-purple-300 text-purple-700 px-8 py-3 rounded-lg hover:bg-purple-50 transition-all hover:scale-105">
                Request Demo
              </button>
            </div>
          </div>
        </div>
      </section>

      {/* New Statistics Section */}
      <section className="py-16 bg-gradient-to-b from-white to-purple-50">
        <div className="container mx-auto px-4">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
            {statistics.map((stat, index) => (
              <div 
                key={index}
                className="text-center transform hover:scale-105 transition-all duration-300"
              >
                <div className="text-3xl font-bold text-purple-600 mb-2">{stat.value}</div>
                <div className="text-purple-700">{stat.label}</div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* New Integration Section */}
      <section className="py-16 bg-white">
        <div className="container mx-auto px-4">
          <h2 className="text-3xl font-bold text-center mb-12 text-purple-900">
            Seamless Integrations
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 max-w-5xl mx-auto">
            <div className="feature-card bg-white p-6 rounded-xl shadow-lg hover:shadow-2xl transition-all duration-300">
              <div className="flex items-center gap-3 mb-4">
                <GitBranch className="w-8 h-8 text-purple-500" />
                <h3 className="text-xl font-semibold text-purple-900">Version Control</h3>
              </div>
              <p className="text-purple-700">
                Built-in version control for your annotation projects with full history tracking.
              </p>
            </div>
            <div className="feature-card bg-white p-6 rounded-xl shadow-lg hover:shadow-2xl transition-all duration-300">
              <div className="flex items-center gap-3 mb-4">
                <Upload className="w-8 h-8 text-purple-500" />
                <h3 className="text-xl font-semibold text-purple-900">Batch Processing</h3>
              </div>
              <p className="text-purple-700">
                Process thousands of files simultaneously with our distributed architecture.
              </p>
            </div>
            <div className="feature-card bg-white p-6 rounded-xl shadow-lg hover:shadow-2xl transition-all duration-300">
              <div className="flex items-center gap-3 mb-4">
                <PieChart className="w-8 h-8 text-purple-500" />
                <h3 className="text-xl font-semibold text-purple-900">Analytics Dashboard</h3>
              </div>
              <p className="text-purple-700">
                Real-time insights into your annotation projects with advanced analytics.
              </p>
            </div>
          </div>
        </div>
      </section>

      <section id="features" className="py-16 bg-gradient-to-b from-purple-50/50 to-white">
  <div className="container mx-auto px-2">
    {/* Heading */}
    <h2 className="text-3xl font-bold text-center mb-6 text-purple-900">
      Advanced Annotation Features
    </h2>

    {/* Tabs */}
    <div className="flex justify-center mb-8">
      <div className="flex space-x-4 bg-purple-50 p-1 rounded-lg">
        <button
          className={`px-6 py-2 rounded-lg transition-all ${
            activeTab === 'image' ? 'bg-white shadow-lg text-purple-600' : 'text-purple-600'
          }`}
          onClick={() => setActiveTab('image')}
        >
          Image Annotation
        </button>
        <button
          className={`px-6 py-2 rounded-lg transition-all ${
            activeTab === 'text' ? 'bg-white shadow-lg text-purple-600' : 'text-purple-600'
          }`}
          onClick={() => setActiveTab('text')}
        >
          Text Annotation
        </button>
      </div>
    </div>

    {/* Video Section */}
    <div className="max-w-3xl mx-auto mb-8">
      <div className="relative aspect-video bg-purple-100 rounded-xl overflow-hidden">
        {activeTab === 'image' ? (
          <video
            src={`/videos/1154-143492926_small.mp4`}
            className="absolute inset-0 w-full h-full object-cover"
            controls
          />
        ) : (
          <video
            src={`/videos/5074-182666828_small.mp4`}
            className="absolute inset-0 w-full h-full object-cover"
            controls
          />
        )}
      </div>
    </div>

    {/* Feature Cards */}
    <div className="grid grid-cols-1 md:grid-cols-2 gap-8 max-w-5xl mx-auto">
      {activeTab === 'image' ? (
        <>
          <div className="bg-white p-6 rounded-xl shadow-lg hover:shadow-2xl transition-all duration-300 transform hover:-translate-y-1">
            <div className="flex items-center gap-3 mb-4">
              <Box className="w-8 h-8 text-purple-500" />
              <h3 className="text-xl font-semibold text-purple-900">Object Detection</h3>
            </div>
            <p className="text-purple-700">
              Precise identification and localization of objects using advanced models.
            </p>
          </div>

          <div className="bg-white p-6 rounded-xl shadow-lg hover:shadow-2xl transition-all duration-300 transform hover:-translate-y-1">
            <div className="flex items-center gap-3 mb-4">
              <Layers className="w-8 h-8 text-purple-500" />
              <h3 className="text-xl font-semibold text-purple-900">Instance Segmentation</h3>
            </div>
            <p className="text-purple-700">
              Pixel-perfect segmentation for detailed object analysis.
            </p>
          </div>
        </>
      ) : (
        <>
          <div className="bg-white p-6 rounded-xl shadow-lg hover:shadow-2xl transition-all duration-300 transform hover:-translate-y-1">
            <div className="flex items-center gap-3 mb-4">
              <FileText className="w-8 h-8 text-purple-500" />
              <h3 className="text-xl font-semibold text-purple-900">Named Entity Recognition</h3>
            </div>
            <p className="text-purple-700">
              Automatically identify and classify named entities in text.
            </p>
          </div>

          <div className="bg-white p-6 rounded-xl shadow-lg hover:shadow-2xl transition-all duration-300 transform hover:-translate-y-1">
            <div className="flex items-center gap-3 mb-4">
              <Brain className="w-8 h-8 text-purple-500" />
              <h3 className="text-xl font-semibold text-purple-900">Sentiment Analysis</h3>
            </div>
            <p className="text-purple-700">
              Analyze text sentiment and emotional content with high accuracy.
            </p>
          </div>
        </>
      )}
    </div>
  </div>
</section>


      {/* Benefits Section */}
      <section className="py-16 bg-purple-50">
        <div className="container mx-auto px-4">
          <h2 className="text-3xl font-bold text-center mb-12 text-purple-900">Platform Benefits</h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {[
              { icon: Zap, title: 'Lightning Fast', desc: 'Process thousands of annotations per hour' },
              { icon: Lock, title: 'Secure Infrastructure', desc: 'Enterprise-grade security with encryption' },
              { icon: Settings, title: 'Custom Models', desc: 'Support for custom model integration' }
            ].map((benefit, index) => (
              <div 
                key={index}
                className="group bg-white p-6 rounded-xl shadow-lg hover:shadow-2xl transition-all duration-500 transform hover:-translate-y-2"
              >
                <benefit.icon className="w-8 h-8 text-purple-500 mb-4 transform group-hover:scale-110 transition-transform duration-300" />
                <h3 className="text-xl font-semibold mb-3 text-purple-900">{benefit.title}</h3>
                <p className="text-purple-700">{benefit.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Contact Section */}
      <section id="contact" className="py-16">
        <div className="container mx-auto px-4">
          <div className="max-w-2xl mx-auto bg-white rounded-xl shadow-xl p-8">
            <h2 className="text-3xl font-bold text-center mb-8 text-purple-900">Get Started Today</h2>
            <form className="space-y-6">
              <div>
                <label className="block text-purple-700 mb-2">Email</label>
                <input 
                  type="email" 
                  className="w-full px-4 py-2 border-2 border-purple-200 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-purple-500 transition-all"
                  placeholder="your@email.com"
                />
              </div>
              <div>
                <label className="block text-purple-700 mb-2">Message</label>
                <textarea 
                  className="w-full px-4 py-2 border-2 border-purple-200 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-purple-500 transition-all"
                  rows="4"
                  placeholder="Tell us about your project..."
                />
              </div>
              <button className="group w-full bg-purple-600 text-white px-6 py-3 rounded-lg hover:bg-purple-700 transition-all hover:scale-105 flex items-center justify-center gap-2">
                Send Message
                <ArrowRight className="w-5 h-5 transform group-hover:translate-x-1 transition-transform" />
              </button>
            </form>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-purple-900 text-white py-12">
        <div className="container mx-auto px-4">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
            <div>
              <h3 className="text-xl font-bold mb-4">datascribe.ai</h3>
              <p className="text-purple-200">
                Advanced auto-annotation platform for AI/ML teams
              </p>
            </div>
            <div>
              <h4 className="font-semibold mb-4">Features</h4>
              <ul className="space-y-2 text-purple-200">
                <li className="hover:text-white transition-colors">Image Annotation</li>
                <li className="hover:text-white transition-colors">Text Annotation</li>
                <li className="hover:text-white transition-colors">Custom Models</li>
                <li className="hover:text-white transition-colors">API Access</li>
              </ul>
            </div>
            <div>
              <h4 className="font-semibold mb-4">Company</h4>
              <ul className="space-y-2 text-purple-200">
                <li className="hover:text-white transition-colors">About Us</li>
                <li className="hover:text-white transition-colors">Blog</li>
                <li className="hover:text-white transition-colors">Careers</li>
                <li className="hover:text-white transition-colors">Contact</li>
              </ul>
            </div>
            <div>
              <h4 className="font-semibold mb-4">Legal</h4>
              <ul className="space-y-2 text-purple-200">
                <li className="hover:text-white transition-colors">Privacy Policy</li>
                <li className="hover:text-white transition-colors">Terms of Service</li>
                <li className="hover:text-white transition-colors">Security</li>
              </ul>
            </div>
          </div>
        </div>
      </footer>
      <PricingModal isOpen={isModalOpen} onClose={() => setIsModalOpen(false)} />
    </div>
  );
};

export default LandingPage;