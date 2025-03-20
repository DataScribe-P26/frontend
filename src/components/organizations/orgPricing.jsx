import React, { useState } from "react";
import { CheckCircle } from "lucide-react";
import { useAuth } from "../../utils/authUtils";
import { post } from "../../state/api-client/api";
import toast from "react-hot-toast";
import useWalletStore from "../../state/store/walletStore/walletSlice";

const OrgCreditPurchaseModal = ({ isOpen, onClose }) => {
  const [selectedOption, setSelectedOption] = useState(null);
  const { setBalance, balance } = useWalletStore();

  const creditOptions = [
    {
      id: 1,
      amount: 100,
      price: 9.99,
      popular: false,
    },
    {
      id: 2,
      amount: 250,
      price: 19.99,
      popular: true,
    },
    {
      id: 3,
      amount: 500,
      price: 34.99,
      popular: false,
    },
  ];
  const { user } = useAuth();

  const handlePurchase = () => {
    console.log("purchased", creditOptions[selectedOption - 1].price);
    post(`/wallet/${user.user_id}/add`, {
      amount: creditOptions[selectedOption - 1].amount,
      transaction_type: "CREDIT",
      description: `${
        creditOptions[selectedOption - 1].amount
      } credits purchased with ${
        creditOptions[selectedOption - 1].price
      } dollar`,
    })
      .then((response) => {
        toast.success("Successfully Purchased");
        setBalance(balance + creditOptions[selectedOption - 1].amount);
        onClose();
      })
      .catch((error) => {
        console.log(error);
        toast.error("Successfully Failed");
      });
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 dark:bg-black dark:bg-opacity-70 flex items-center justify-center z-50">
      <div className="bg-white dark:bg-gray-800 rounded-xl shadow-lg w-full max-w-md mx-4 overflow-hidden">
        {/* Header */}
        <div className="bg-gradient-to-r from-purple-600 to-indigo-500 p-6">
          <h2 className="text-xl font-bold text-white">Purchase Credits</h2>
          <p className="text-purple-100 mt-1">
            Select the amount of credits you need
          </p>
        </div>

        {/* Credit Options */}
        <div className="p-6">
          <div className="space-y-4">
            {creditOptions.map((option) => (
              <div
                key={option.id}
                className={`border rounded-lg p-4 cursor-pointer transition-all duration-200 ${
                  selectedOption === option.id
                    ? "border-purple-500 bg-purple-50 dark:bg-purple-900 dark:bg-opacity-20 dark:border-purple-400"
                    : "border-gray-200 dark:border-gray-700 hover:border-purple-300 dark:hover:border-purple-500"
                }`}
                onClick={() => setSelectedOption(option.id)}
              >
                <div className="flex justify-between items-center">
                  <div>
                    <div className="flex items-center">
                      <span className="font-semibold text-gray-900 dark:text-gray-100">
                        {option.amount} Credits
                      </span>
                      {option.popular && (
                        <span className="ml-2 px-2 py-1 bg-purple-100 dark:bg-purple-900 text-purple-600 dark:text-purple-300 text-xs font-medium rounded-full">
                          Best Value
                        </span>
                      )}
                    </div>
                    <p className="text-gray-600 dark:text-gray-400 text-sm mt-1">
                      ${option.price}
                    </p>
                  </div>
                  {selectedOption === option.id && (
                    <CheckCircle className="w-6 h-6 text-purple-600 dark:text-purple-400" />
                  )}
                </div>
              </div>
            ))}
          </div>

          {/* Actions */}
          <div className="mt-6 flex gap-3">
            <button
              className="w-full py-2 border border-gray-300 dark:border-gray-600 rounded-lg text-gray-700 dark:text-gray-300 font-medium hover:bg-gray-50 dark:hover:bg-gray-700"
              onClick={onClose}
            >
              Cancel
            </button>
            <button
              className={`w-full py-2 bg-purple-600 text-white rounded-lg font-medium hover:bg-purple-700 transition-colors ${
                !selectedOption ? "opacity-50 cursor-not-allowed" : ""
              }`}
              disabled={!selectedOption}
              onClick={handlePurchase}
            >
              Purchase Now
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default OrgCreditPurchaseModal;
