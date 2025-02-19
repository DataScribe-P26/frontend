import React from 'react';
import { Check, Globe, Building2, Zap, Rocket } from 'lucide-react';

const PricingPage = () => {
  const plans = [
    {
      name: "Free",
      icon: <Globe className="w-5 h-5 text-purple-600" />,
      description: "For personal use",
      price: "0",
      period: "/month",
      features: ["3 Projects", "Basic Analytics", "Community Support", "1GB Storage", "Public API"],
      buttonText: "Get Started",
      highlighted: false,
      badge: null,
    },
    {
      name: "Basic",
      icon: <Zap className="w-5 h-5 text-purple-600" />,
      description: "For small teams",
      price: "29",
      period: "/month",
      features: ["10 Projects", "Advanced Analytics", "Email Support", "10GB Storage", "API Access", "Team Collaboration"],
      buttonText: "Start Trial",
      highlighted: false,
      badge: null,
    },
    {
      name: "Growth",
      icon: <Rocket className="w-5 h-5 text-purple-600" />,
      description: "For scaling teams",
      price: "99",
      period: "/month",
      features: ["Unlimited Projects", "Custom Analytics", "Priority Support", "100GB Storage", "Advanced API", "Advanced Security", "Custom Integrations"],
      buttonText: "Start Trial",
      highlighted: true,
      badge: "POPULAR",
    },
    {
      name: "Enterprise",
      icon: <Building2 className="w-5 h-5 text-purple-600" />,
      description: "For organizations",
      price: "Custom",
      period: "",
      features: ["Everything in Growth", "24/7 Premium Support", "Unlimited Storage", "Custom Solutions", "SLA Guarantee", "Dedicated Account Manager", "On-premise Deployment"],
      buttonText: "Contact Sales",
      highlighted: false,
      badge: null,
    },
  ];

  return (
    <div className="min-h-screen w-full flex flex-col items-center justify-center px-6 py-12 overflow-auto">
      {/* Header */}
      <div className="max-w-3xl text-center">
        <h1 className="text-4xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-purple-600 to-indigo-400">
          Choose Your Plan
        </h1>
        <p className="mt-3 text-gray-600 text-lg">Get started with our flexible pricing options.</p>
      </div>

      {/* Plans Grid */}
      <div className="mt-10 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 max-w-6xl w-full px-4">
        {plans.map((plan) => (
          <div
            key={plan.name}
            className={`relative rounded-xl p-6 transition-all duration-200 shadow-md max-w-full ${
              plan.highlighted
                ? 'border-2 border-indigo-500 shadow-lg bg-gradient-to-b from-indigo-50 to-white'
                : 'border border-gray-200 hover:border-indigo-300 hover:shadow-lg'
            }`}
          >
            {plan.badge && (
              <span className="absolute -top-3 left-1/2 transform -translate-x-1/2 px-3 py-1 bg-indigo-600 text-white text-xs font-semibold rounded-full">
                {plan.badge}
              </span>
            )}

            {/* Plan Header */}
            <div className="flex items-center space-x-3">
              <div className={`p-2 rounded-lg ${plan.highlighted ? 'bg-white' : 'bg-gray-50'}`}>{plan.icon}</div>
              <h3 className="text-lg font-semibold text-gray-900">{plan.name}</h3>
            </div>
            <p className="mt-2 text-sm text-gray-600">{plan.description}</p>

            {/* Pricing */}
            <div className="mt-4 flex items-baseline">
              {plan.price === "Custom" ? (
                <span className="text-2xl font-bold text-gray-900">Custom</span>
              ) : (
                <>
                  <span className="text-3xl font-bold text-gray-900">${plan.price}</span>
                  <span className="text-gray-600 ml-1">{plan.period}</span>
                </>
              )}
            </div>

            {/* Features */}
            <ul className="mt-5 space-y-3">
              {plan.features.map((feature) => (
                <li key={feature} className="flex items-start text-sm">
                  <Check className="w-4 h-4 text-indigo-600 mt-0.5 shrink-0" />
                  <span className="ml-3 text-gray-600">{feature}</span>
                </li>
              ))}
            </ul>

            {/* Action Button */}
            <button
              className={`mt-6 w-full py-2.5 px-4 rounded-lg font-medium text-sm transition-all duration-200 ${
                plan.highlighted
                  ? 'bg-indigo-600 text-white hover:bg-indigo-700 shadow-md hover:shadow-lg'
                  : 'bg-white text-indigo-600 border border-indigo-200 hover:bg-indigo-50'
              }`}
            >
              {plan.buttonText}
            </button>
          </div>
        ))}
      </div>

      {/* Footer */}
      <div className="mt-8 text-gray-600 text-sm text-center px-4">
        All plans include automatic platform updates and basic customer support.
      </div>
    </div>
  );
};

export default PricingPage;
