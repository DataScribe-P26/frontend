import React from 'react';
import { Check, Sparkles, Building2, X } from 'lucide-react';

const PricingModal = ({ isOpen, onClose }) => {
  if (!isOpen) return null;

  const plans = [
    {
      name: "Free",
      icon: <Sparkles className="w-5 h-5 text-purple-500" />,
      description: "Perfect for starters",
      price: "0",
      period: "forever",
      features: [
        "5 Projects",
        "Basic Analytics",
        "Community Support",
        "1GB Storage",
        "Basic API Access"
      ],
      buttonText: "Get Started",
      highlighted: false
    },
    {
      name: "Enterprise",
      icon: <Building2 className="w-5 h-5 text-purple-500" />,
      description: "For growing teams",
      price: "Custom",
      period: "billed annually",
      features: [
        "Unlimited Projects",
        "Advanced Analytics",
        "Priority Support",
        "Unlimited Storage",
        "Custom Integration"
      ],
      buttonText: "Contact Sales",
      highlighted: true
    }
  ];

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto bg-black/60 backdrop-blur-sm flex items-center justify-center p-4">
      <div 
        className="bg-white rounded-xl shadow-xl max-w-3xl w-full mx-auto transform transition-all duration-300 scale-95 hover:scale-100"
        style={{ maxWidth: '800px',
          
         }}
      >
        {/* Header */}
        <div className="relative p-5 text-center">
          <button 
            onClick={onClose}
            className="absolute right-4 top-4 text-gray-400 hover:text-gray-600 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
          <h2 className="text-2xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-purple-800 to-indigo-400">
            Choose Your Plan
          </h2>
          <p className="mt-2 text-sm text-gray-500">Unlock the perfect features for your needs</p>
        </div>

        {/* Plans Grid */}
        <div className="p-5 grid md:grid-cols-2 gap-4">
          {plans.map((plan) => (
            <div nt
              key={plan.name}
              className={`relative rounded-lg p-5 transition-all duration-200 ${
                plan.highlighted 
                  ? 'bg-gradient-to-b from-purple-50 to-white border-2 border-purple-200 shadow-lg' 
                  : 'bg-white border border-gray-100 hover:border-purple-200 hover:shadow-md'
              }`}
            >
              {plan.highlighted && (
                <div className="absolute -top-3 right-4 bg-purple-500 text-white text-xs px-3 py-1 rounded-full">
                  Popular
                </div>
              )}

              <div className="flex items-center space-x-2">
                <div className={`p-2 rounded-lg ${plan.highlighted ? 'bg-purple-100' : 'bg-gray-50'}`}>
                  {plan.icon}
                </div>
                <div>
                  <h3 className="font-semibold text-gray-900">{plan.name}</h3>
                  <p className="text-xs text-gray-500">{plan.description}</p>
                </div>
              </div>

              <div className="mt-4 flex items-baseline">
                <span className="text-3xl font-bold text-gray-900">
                  {plan.price === "0" ? "Free" : plan.price}
                </span>
                <span className="ml-2 text-sm text-gray-500">{plan.period}</span>
              </div>

              <ul className="mt-4 space-y-3">
                {plan.features.map((feature) => (
                  <li key={feature} className="flex items-center text-sm">
                    <Check className="w-4 h-4 text-purple-500 mr-2 flex-shrink-0" />
                    <span className="text-gray-600">{feature}</span>
                  </li>
                ))}
              </ul>

              <button
                className={`mt-5 w-full py-2 px-4 rounded-lg font-medium text-sm transition-all duration-200 ${
                  plan.highlighted
                    ? 'bg-purple-600 text-white hover:bg-purple-700 shadow-md hover:shadow-lg'
                    : 'bg-gray-50 text-gray-700 hover:bg-gray-100'
                }`}
              >
                {plan.buttonText}
              </button>
            </div>
          ))}
        </div>

        <div className="p-4 text-center border-t border-gray-100">
          <p className="text-xs text-gray-500">
            Questions? Contact our sales team for help
          </p>
        </div>
      </div>
    </div>
  );
};

export default PricingModal;