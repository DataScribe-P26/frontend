import React, { useState, useEffect } from "react";
import {
  Search,
  Bell,
  HelpCircle,
  Sun,
  Moon,
  LogOut,
  DollarSign,
  Wallet,
  ChevronDown,
  Plus,
  CreditCard,
  Wallet2,
} from "lucide-react";
import { useAuth, logout } from "../../utils/authUtils";
import { useNavigate } from "react-router-dom";
import { get, post } from "../../state/api-client/api";
import OrgCreditPurchaseModal from "./orgPricing";
import useWalletStore from "../../state/store/walletStore/walletSlice";
import { useTheme } from "../../utils/themeUtils";
import useOrganizationStore from "../../state/store/organizationStore/organizationSlice";
export const OrgTopBar = ({ title, setActiveSection }) => {
  const { balance, setBalance } = useWalletStore();
  const { user } = useAuth();
  const { orgId } = useOrganizationStore();

  const { isDarkMode, toggleTheme } = useTheme(); // Use the theme hook instead of local state

  const [showProfile, setShowProfile] = useState(false);
  const [openPricing, setOpenPricing] = useState(false);

  const [organizationName, setOrganizationName] = useState("");
  const [showNotifications, setShowNotifications] = useState(false);
  const [notifications, setNotifications] = useState([]);

  // New wallet-related state
  const [showWalletDropdown, setShowWalletDropdown] = useState(false);
  const [credits, setCredits] = useState(100);

  const navigate = useNavigate();

  useEffect(() => {
    const storedOrgName = localStorage.getItem("organizationName");
    if (storedOrgName) {
      setOrganizationName(storedOrgName);
    }
  }, []);

  // Existing functions
  const getDisplayName = () => {
    if (!user) return "";
    if (user.name) return user.name;
    if (user.email) return user.email.split("@")[0];
    return "User";
  };
  useEffect(() => {
    get(`/org-wallet/${orgId}`)
      .then((response) => {
        console.log("wallet", response);
        setBalance(response.data.balance);
      })
      .catch((error) => {
        console.log(error);
      });
  }, [user]);

  const displayName = getDisplayName();

  // Handle logout
  const handleLogout = () => {
    logout(navigate);
    navigate("/login");
    setShowProfile(false);
  };
  const onClose = () => {
    setOpenPricing(false);
  };

  // Close profile dropdown when clicking outside
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (showProfile && !event.target.closest(".profile-container")) {
        setShowProfile(false);
      }
      if (showWalletDropdown && !event.target.closest(".wallet-container")) {
        setShowWalletDropdown(false);
      }
      if (
        showNotifications &&
        !event.target.closest(".notification-container")
      ) {
        setShowNotifications(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, [showProfile, showWalletDropdown, showNotifications]);

  // Handle Notifications Toggle
  const toggleNotifications = () => {
    setShowNotifications(!showNotifications);
    setShowWalletDropdown(false);
  };

  // Toggle wallet dropdown
  const toggleWalletDropdown = () => {
    setShowWalletDropdown(!showWalletDropdown);
    setShowNotifications(false);
  };

  // Handle buying credits
  const handleBuyCredits = () => {
    // Placeholder for credit purchase functionality
    setOpenPricing(true);
    setShowWalletDropdown(false);
  };

  // Fetch credits balance

  // Fetch Pending Invitations for the User
  const fetchNotifications = async () => {
    try {
      const response = await get(
        `/notification`,
        { email: user?.email },
        {
          Authorization: `Bearer ${user?.token}`,
        }
      );
      console.log(response.data);
      const notificationsArray = response.data.notifications || [];
      setNotifications(notificationsArray);
      console.log(notificationsArray);
    } catch (error) {
      console.error("Error fetching invitations:", error);
      setNotifications([]);
    }
  };

  // Handle responding to an invitation
  const respondToInvitation = async (notificationId, action) => {
    try {
      console.log(notificationId, " ", action);
      const response = await post(
        `/notifications/respond`,
        { notification_id: notificationId, action },
        {
          headers: {
            Authorization: `Bearer ${user?.token}`,
          },
        }
      );

      console.log(response.data.message);

      setNotifications((prevNotifications) =>
        prevNotifications.filter((notif) => notif._id !== notificationId)
      );
    } catch (error) {
      console.error("Error responding to invitation:", error);
    }
  };

  useEffect(() => {
    fetchNotifications();
  }, []);

  // Update notifications when dropdown is toggled
  useEffect(() => {
    if (showNotifications) {
      fetchNotifications();
    }
  }, [showNotifications]);

  return (
    <div className="h-16 flex items-center justify-between px-6 border-b bg-white dark:bg-gray-900 transition-colors duration-300">
      {/* Title Section */}
      <div className="flex items-center gap-4">
        <h1 className="text-xl font-semibold text-gray-800 dark:text-white">
          Organization
        </h1>
      </div>
      <OrgCreditPurchaseModal isOpen={openPricing} onClose={onClose} />

      {/* Right-Side Icons & User Profile */}
      <div className="flex items-center gap-6">
        {/* Theme Toggle */}
        <div className="flex items-center space-x-4">
          <button
            onClick={toggleTheme}
            className="p-2 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors duration-200"
            aria-label="Toggle Theme"
          >
            {isDarkMode ? (
              <Sun className="text-yellow-400" size={20} />
            ) : (
              <Moon className="text-gray-400" size={20} />
            )}
          </button>
        </div>

        {/* Help Icon with Tooltip
        <div className="relative">
          <HelpCircle
            className="text-gray-500 dark:text-gray-400 hover:text-purple-500 dark:hover:text-purple-400 cursor-pointer transition-colors duration-200"
            size={20}
            onMouseEnter={() => setShowTooltip(true)}
            onMouseLeave={() => setShowTooltip(false)}
          />
          {showTooltip && (
            <div className="absolute top-[120%] right-0 z-50 bg-gray-800 text-gray-100 text-sm rounded-lg shadow-lg p-4 w-64">
              <h3 className="font-semibold text-lg mb-2 text-purple-400">
                Key Features:
              </h3>
              <ul className="list-disc pl-5 space-y-1">
                <li>
                  Image annotation with bounding boxes, polygons, and
                  segmentation.
                </li>
                <li>Text annotation with NER tagging.</li>
                <li>AI-driven auto-annotation.</li>
                <li>Dynamic label management.</li>
              </ul>
            </div>
          )}
        </div> */}

        {/* Wallet */}
        <div className="relative wallet-container">
          <button
            onClick={toggleWalletDropdown}
            className="flex items-center gap-2 px-3 py-2 rounded-full bg-gradient-to-r from-purple-600 to-indigo-600 text-white text-sm hover:from-purple-700 hover:to-indigo-700 transition-all duration-300"
          >
            <Wallet2 size={20} /> <span>{balance} credits</span>
            <ChevronDown
              size={14}
              className={`transition-transform duration-300 ${
                showWalletDropdown ? "rotate-180" : ""
              }`}
            />
          </button>

          {/* Wallet Dropdown */}
          {showWalletDropdown && (
            <div className="absolute top-full right-0 mt-2 bg-white dark:bg-gray-800 rounded-lg shadow-xl py-3 w-64 z-50">
              <div className="px-4 py-2 border-b border-gray-100 dark:border-gray-700">
                <div className="flex items-center justify-between">
                  <h3 className="text-sm font-medium text-gray-900 dark:text-white">
                    Credits Balance
                  </h3>
                  <span className="text-lg font-bold text-purple-600 dark:text-purple-400">
                    {balance}
                  </span>
                </div>
              </div>

              <div className="px-4 py-3">
                <div className="text-xs text-gray-500 dark:text-gray-400 mb-2">
                  Credits are used for auto-annotation and custom AI features.
                </div>

                <div className="flex flex-col gap-2">
                  <button
                    onClick={handleBuyCredits}
                    className="w-full flex items-center justify-center gap-2 py-2 bg-purple-600 hover:bg-purple-700 text-white rounded-md transition-colors duration-200"
                  >
                    <Plus size={16} />
                    <span>Buy More Credits</span>
                  </button>

                  <button
                    onClick={() => {
                      setActiveSection("wallet");
                      setShowWalletDropdown(!showWalletDropdown);
                    }}
                    className="w-full flex items-center justify-center gap-2 py-2 bg-gray-100 dark:bg-gray-700 hover:bg-gray-200 dark:hover:bg-gray-600 text-gray-700 dark:text-gray-200 rounded-md transition-colors duration-200"
                  >
                    <CreditCard size={16} />
                    <span>Billing History</span>
                  </button>
                </div>
              </div>
            </div>
          )}
        </div>

        {/* Notification Icon */}
        <div className="relative notification-container">
          <Bell
            className="text-gray-500 dark:text-gray-400 hover:text-purple-500 dark:hover:text-purple-400 cursor-pointer"
            size={20}
            onClick={toggleNotifications}
          />
          {/* Badge for notification count */}
          {notifications.length > 0 && (
            <span className="absolute -top-1 -right-1 bg-red-500 text-white text-xs font-semibold rounded-full h-3 w-3 flex items-center justify-center">
              {notifications.length}
            </span>
          )}
          {/* Notifications Dropdown */}
          {showNotifications && (
            <div className="absolute top-[120%] right-0 z-50 bg-white dark:bg-gray-800 text-sm rounded-lg shadow-lg p-4 w-72">
              <h3 className="font-semibold text-lg mb-2 text-purple-400">
                Invitations
              </h3>
              {notifications.length > 0 ? (
                <ul className="list-none space-y-4">
                  {notifications.map((notif, index) => (
                    <React.Fragment key={notif._id}>
                      <li className="flex flex-col text-gray-700 dark:text-gray-300">
                        <p>
                          {`You have an invitation to join organization "${notif.org_name}" as a ${notif.role}`}
                        </p>
                        <div className="mt-2 flex justify-end gap-2">
                          <button
                            className="px-2 py-1 text-sm bg-green-500 text-white rounded-md hover:bg-green-600"
                            onClick={() =>
                              respondToInvitation(notif._id, "Accept")
                            }
                          >
                            Accept
                          </button>
                          <button
                            className="px-2 py-1 text-sm bg-red-500 text-white rounded-md hover:bg-red-600"
                            onClick={() =>
                              respondToInvitation(notif._id, "Reject")
                            }
                          >
                            Reject
                          </button>
                        </div>
                      </li>
                      {index < notifications.length - 1 && (
                        <hr className="border-t border-gray-300 dark:border-gray-600 my-2" />
                      )}
                    </React.Fragment>
                  ))}
                </ul>
              ) : (
                <p className="text-gray-500 dark:text-gray-400">
                  No new invitations.
                </p>
              )}
            </div>
          )}
        </div>

        {/* User Profile Section */}
        <div className="relative profile-container">
          <div className="flex items-center space-x-3">
            {/* Username display */}
            <span className="text-sm font-medium hidden md:block text-gray-700 dark:text-gray-300">
              {displayName}
            </span>

            {/* Profile Avatar */}
            <div
              className="w-8 h-8 rounded-full bg-gradient-to-r from-purple-800 to-indigo-800 text-white flex items-center justify-center cursor-pointer hover:opacity-90 transition-opacity duration-300"
              onClick={() => setShowProfile(!showProfile)}
            >
              {displayName.charAt(0).toUpperCase()}
            </div>

            {/* Dropdown Menu */}
            {showProfile && (
              <div className="absolute top-full right-0 mt-2 bg-white dark:bg-gray-800 rounded-lg shadow-xl py-2 w-48 z-50">
                <div className="px-4 py-2 border-b border-gray-100 dark:border-gray-700">
                  <p className="text-sm font-medium text-gray-900 dark:text-white">
                    {displayName}
                  </p>
                  <p className="text-xs text-gray-500 dark:text-gray-400">
                    {user?.email}
                  </p>
                </div>
                <button
                  onClick={handleLogout}
                  className="w-full px-4 py-2 text-left text-sm text-red-600 hover:bg-gray-50 dark:hover:bg-gray-700 dark:text-red-400 flex items-center space-x-2"
                >
                  <LogOut size={16} />
                  <span>Logout</span>
                </button>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default OrgTopBar;
