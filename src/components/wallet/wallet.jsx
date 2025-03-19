import React, { useState, useEffect } from "react";
import { useAuth } from "../../utils/authUtils";
import { get } from "../../state/api-client/api";
import CreditPurchaseModal from "./pricingModal";
import {
  DollarSign,
  CreditCard,
  Calendar,
  Clock,
  ChevronRight,
  ArrowUpRight,
  Plus,
  Download,
  FileText,
  Wallet,
} from "lucide-react";
import useWalletStore from "../../state/store/walletStore/walletSlice";

const WalletSection = () => {
  const { balance, setBalance } = useWalletStore();
  const { user } = useAuth();
  const [credits, setCredits] = useState(100);
  const [openPricing, setOpenPricing] = useState(false);
  const [transactions, setTransactions] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedTab, setSelectedTab] = useState("overview");

  useEffect(() => {
    const fetchWalletData = async () => {
      try {
        setLoading(true);
        setCredits(balance);

        const response = await get(`wallet/${user.user_id}/transactions`);
        console.log("history", response.data);

        const mappedTransactions = response.data.map((tx) => ({
          id: tx._id,
          type: tx.transaction_type === "DEBIT" ? "usage" : "purchase",
          amount: tx.amount || 0,
          credits: tx.transaction_type === "DEBIT" ? -tx.amount : tx.amount,
          date: new Date(tx.created_at),
          status: "completed",
          description: tx.description || "Transaction",
        }));

        setTransactions(mappedTransactions);

        setTimeout(() => {
          setLoading(false);
        }, 500);
      } catch (error) {
        console.error("Error fetching wallet data:", error);
        setLoading(false);
      }
    };

    fetchWalletData();
  }, [user.user_id, balance]);

  const formatDate = (date) => {
    const validDate = date instanceof Date && !isNaN(date) ? date : new Date();

    return new Intl.DateTimeFormat("en-US", {
      year: "numeric",
      month: "short",
      day: "numeric",
      hour: "numeric",
      minute: "numeric",
    }).format(validDate);
  };

  const handleBuyCredits = () => {
    setOpenPricing(true);
    console.log("Buy credits clicked");
  };

  const calculateStats = () => {
    const usageTransactions = transactions.filter((tx) => tx.type === "usage");
    const purchaseTransactions = transactions.filter(
      (tx) => tx.type === "purchase"
    );

    const totalUsed = usageTransactions.reduce(
      (total, tx) => total + Math.abs(tx.credits),
      0
    );
    const totalPurchased = purchaseTransactions.reduce(
      (total, tx) => total + tx.credits,
      0
    );

    return {
      totalUsed,
      totalPurchased,
      availablePercentage: Math.round((credits / totalPurchased) * 100) || 0,
    };
  };

  const stats = calculateStats();

  const onClose = () => {
    setOpenPricing(false);
  };

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900 py-8">
      {openPricing && (
        <CreditPurchaseModal isOpen={openPricing} onClose={onClose} />
      )}{" "}
      <div className="max-w-6xl mx-auto px-4">
        <div className="flex items-center mb-8">
          <Wallet
            className="mr-2 text-purple-600 dark:text-purple-400"
            size={28}
          />
          <h1 className="text-2xl font-bold text-gray-800 dark:text-white">
            Wallet
          </h1>
        </div>

        {/* Tabs */}
        <div className="mb-6 border-b border-gray-200 dark:border-gray-700">
          <nav className="flex space-x-8">
            <button
              onClick={() => setSelectedTab("overview")}
              className={`py-4 px-1 font-medium text-sm border-b-2 ${
                selectedTab === "overview"
                  ? "border-purple-600 text-purple-600 dark:border-purple-400 dark:text-purple-400"
                  : "border-transparent text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-300"
              }`}
            >
              Overview
            </button>
            <button
              onClick={() => setSelectedTab("transactions")}
              className={`py-4 px-1 font-medium text-sm border-b-2 ${
                selectedTab === "transactions"
                  ? "border-purple-600 text-purple-600 dark:border-purple-400 dark:text-purple-400"
                  : "border-transparent text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-300"
              }`}
            >
              Transaction History
            </button>
          </nav>
        </div>

        {loading ? (
          <div className="flex items-center justify-center h-64">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-purple-600 dark:border-purple-400"></div>
          </div>
        ) : (
          <>
            {selectedTab === "overview" && (
              <div className="space-y-6">
                {/* Credits Card */}
                <div className="bg-white dark:bg-gray-800 rounded-lg shadow overflow-hidden">
                  <div className="p-6">
                    <div className="flex flex-col md:flex-row md:justify-between md:items-center">
                      <div>
                        <h2 className="text-lg font-medium text-gray-900 dark:text-white">
                          Your Credits
                        </h2>
                        <p className="text-sm text-gray-500 dark:text-gray-400 mt-1">
                          Credits are used for AI-powered annotation and
                          processing
                        </p>
                      </div>
                      <div className="mt-4 md:mt-0">
                        <button
                          onClick={handleBuyCredits}
                          className="flex items-center justify-center gap-2 px-4 py-2 bg-gradient-to-r from-purple-600 to-indigo-600 text-white rounded-md hover:from-purple-700 hover:to-indigo-700 transition-all duration-300"
                        >
                          <Plus size={18} />
                          <span>Buy Credits</span>
                        </button>
                      </div>
                    </div>

                    <div className="mt-6">
                      <div className="flex items-baseline">
                        <span className="text-4xl font-bold text-gray-900 dark:text-white">
                          {credits}
                        </span>
                        <span className="ml-2 text-lg text-gray-500 dark:text-gray-400">
                          credits available
                        </span>
                      </div>

                      <div className="mt-4">
                        <div className="bg-gray-200 dark:bg-gray-700 rounded-full h-2.5">
                          <div
                            className="bg-gradient-to-r from-purple-600 to-indigo-600 h-2.5 rounded-full"
                            style={{ width: `${stats.availablePercentage}%` }}
                          ></div>
                        </div>
                        <div className="flex justify-between mt-2 text-xs text-gray-500 dark:text-gray-400">
                          <span>{stats.availablePercentage}% remaining</span>
                          <span>{stats.totalPurchased} total purchased</span>
                        </div>
                      </div>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-8 pt-6 border-t border-gray-100 dark:border-gray-700">
                      <div className="bg-gray-50 dark:bg-gray-700 p-4 rounded-lg">
                        <div className="flex items-center mb-2">
                          <ArrowUpRight
                            className="text-green-500 mr-2"
                            size={18}
                          />
                          <h3 className="text-sm font-medium text-gray-700 dark:text-gray-300">
                            Total Purchased
                          </h3>
                        </div>
                        <p className="text-2xl font-semibold text-gray-900 dark:text-white">
                          {stats.totalPurchased} credits
                        </p>
                      </div>

                      <div className="bg-gray-50 dark:bg-gray-700 p-4 rounded-lg">
                        <div className="flex items-center mb-2">
                          <Download className="text-red-500 mr-2" size={18} />
                          <h3 className="text-sm font-medium text-gray-700 dark:text-gray-300">
                            Total Used
                          </h3>
                        </div>
                        <p className="text-2xl font-semibold text-gray-900 dark:text-white">
                          {stats.totalUsed} credits
                        </p>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            )}

            {selectedTab === "transactions" && (
              <div className="bg-white dark:bg-gray-800 rounded-lg shadow">
                <div className="px-6 py-5 border-b border-gray-200 dark:border-gray-700">
                  <h2 className="text-lg font-medium text-gray-900 dark:text-white">
                    Transaction History
                  </h2>
                </div>

                <div className="overflow-x-auto">
                  <div className="max-h-96 overflow-y-auto">
                    <table className="min-w-full divide-y divide-gray-200 dark:divide-gray-700">
                      <thead className="bg-gray-50 dark:bg-gray-900 sticky top-0 z-10">
                        <tr>
                          <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                            Description
                          </th>
                          <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                            Credits
                          </th>
                          <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                            Date & Time
                          </th>
                        </tr>
                      </thead>
                      <tbody className="bg-white dark:bg-gray-800 divide-y divide-gray-200 dark:divide-gray-700">
                        {transactions.map((transaction) => (
                          <tr key={transaction.id}>
                            <td className="px-6 py-4 whitespace-nowrap">
                              <div className="flex items-center">
                                <div
                                  className={`flex-shrink-0 h-10 w-10 rounded-full flex items-center justify-center ${
                                    transaction.type === "purchase"
                                      ? "bg-green-100 dark:bg-green-900"
                                      : "bg-blue-100 dark:bg-blue-900"
                                  }`}
                                >
                                  {transaction.type === "purchase" ? (
                                    <CreditCard
                                      className={`h-5 w-5 text-green-600 dark:text-green-400`}
                                    />
                                  ) : (
                                    <Clock
                                      className={`h-5 w-5 text-blue-600 dark:text-blue-400`}
                                    />
                                  )}
                                </div>
                                <div className="ml-4">
                                  <div className="text-sm font-medium text-gray-900 dark:text-white">
                                    {transaction.description}
                                  </div>
                                </div>
                              </div>
                            </td>
                            <td className="px-6 py-4 whitespace-nowrap">
                              <div
                                className={`text-sm font-medium ${
                                  transaction.credits > 0
                                    ? "text-green-600 dark:text-green-400"
                                    : "text-blue-600 dark:text-blue-400"
                                }`}
                              >
                                {transaction.credits > 0 ? "+" : ""}
                                {transaction.credits}
                              </div>
                            </td>
                            <td className="px-6 py-4 whitespace-nowrap">
                              <div className="text-sm text-gray-900 dark:text-white">
                                {formatDate(transaction.date)}
                              </div>
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                </div>
              </div>
            )}
          </>
        )}
      </div>
    </div>
  );
};

export default WalletSection;
