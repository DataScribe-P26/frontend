import React from "react";
import { Search, Bell, HelpCircle, Sun } from "lucide-react";
import DropdownProfile from "../components/DropdownProfile"; // Ensure correct import

export const TopBar = ({ title, user }) => {
  return (
    <div className="h-16 flex items-center justify-between px-6 border-b bg-white dark:bg-white">
      {/* Title Section */}
      <div className="flex items-center gap-4">
        <h1 className="text-xl font-semibold text-gray-800 dark:text-gray-800">Welcome User.....</h1>
      </div>

      {/* Right-Side Icons & User Profile */}
      <div className="flex items-center gap-4">
        {/* Icons */}
        {[
          { Icon: Search, label: "Search" },
          { Icon: Bell, label: "Notifications" },
          { Icon: HelpCircle, label: "Help" },
          { Icon: Sun, label: "Theme" },
        ].map(({ Icon, label }, index) => (
          <button
            key={index}
            className="p-2 rounded-lg transition-colors duration-200"
            aria-label={label}
          >
            <Icon className="text-red-500 dark:text-purple-500" size={20} />
          </button>
        ))}

        {/* User Dropdown */}
        <DropdownProfile user={user} />
      </div>
    </div>
  );
};

export default TopBar;
