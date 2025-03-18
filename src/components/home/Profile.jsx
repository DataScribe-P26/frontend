import React from "react";
import { motion } from "framer-motion";
import { ProfileForm } from "../userProfile/profileform";
export const Profile = ({ user, onUpdateProfile }) => {
  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="p-0 dark:bg-gray-900 mt-0"
    >
      <div className="flex justify-between items-center mb-0 dark:bg-gray-900">
        <div className="flex items-center gap-4 dark:bg-gray-900">
          <div className="w-20 h-20 bg-gray-200 rounded-full ">
            {user?.avatar && (
              <img
                src={user.avatar}
                alt={user.name}
                className="w-full h-full rounded-full object-cover "
              />
            )}
          </div>
          <div>
            <h2 className="text-2xl font-bold dark:text-gray-100 ">
              {user?.name || "Loading..."}
            </h2>
            <p className="text-gray-600 dark:text-gray-100">
              {user?.title || "Loading..."}
            </p>
          </div>
        </div>
      </div>

      <div className="bg-white rounded-lg shadow p-6 dark:bg-gray-900">
        <ProfileForm user={user} onUpdate={onUpdateProfile} />
      </div>
    </motion.div>
  );
};

import { useState, useEffect } from "react";

export const useUser = () => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // useEffect(() => {
  //   const fetchUser = async () => {
  //     try {
  //       // Replace with your actual API call
  //       const response = await fetch("/api/user");
  //       const data = await response.json();
  //       setUser(data);
  //     } catch (err) {
  //       setError(err);
  //     } finally {
  //       setLoading(false);
  //     }
  //   };

  //   fetchUser();
  // }, []);

  const updateUser = async (userData) => {
    try {
      // Replace with your actual API call
      const response = await fetch("/api/user", {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(userData),
      });
      const data = await response.json();
      setUser(data);
      return data;
    } catch (err) {
      setError(err);
      throw err;
    }
  };

  return { user, loading, error, updateUser };
};
