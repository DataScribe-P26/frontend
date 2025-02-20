import React, { useState, useEffect } from 'react';
import { UserPlus, X } from 'lucide-react';
import axios from 'axios';

const TeamMemberModal = ({ isteamOpen, onCloseteam, organizationName, onSubmit }) => {
  const [searchQuery, setSearchQuery] = useState("");
  const [searchResults, setSearchResults] = useState([]);
  const [selectedMembers, setSelectedMembers] = useState([]);
  const [availableMembers, setAvailableMembers] = useState([]);

  useEffect(() => {
    if (isteamOpen) {
      fetchAvailableMembers();
    }
  }, [isteamOpen, organizationName]);

  const fetchAvailableMembers = async () => {
    try {
      const response = await axios.get(
        `http://127.0.0.1:8000/organization-members/`,
        { params: { org_name: organizationName } }
      );
      setAvailableMembers(response.data.members || []);
    } catch (error) {
      console.error("Error fetching members:", error);
    }
  };

  const handleSearch = async (query) => {
    setSearchQuery(query);
    if (query.trim() === "") {
      setSearchResults([]);
      return;
    }

    try {
      const response = await axios.get(
        `http://127.0.0.1:8000/organization-members/search`,
        { params: { org_name: organizationName, query } }
      );
      setSearchResults(response.data.matches);
    } catch (error) {
      console.error("Error fetching search results:", error);
    }
  };

  const handleSelectMember = (email) => {
    if (!selectedMembers.includes(email)) {
      setSelectedMembers([...selectedMembers, email]);
    }
    setSearchQuery("");
    setSearchResults([]);
  };

  const handleRemoveMember = (email) => {
    setSelectedMembers(selectedMembers.filter((member) => member !== email));
  };

  const handleSubmit = () => {
    onSubmit(selectedMembers);
    onCloseteam();
  };

  if (!isteamOpen) return null;

  return (
    <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50 z-50">
      <div className="w-full max-w-4xl mx-4 my-6 bg-white dark:bg-gray-800 rounded-lg shadow-lg">
        {/* Header */}
        <div className="flex justify-between items-center p-4 border-b">
          <h2 className="text-xl font-semibold">Add Team Members</h2>
          <button
            onClick={onCloseteam}
            className="text-gray-500 hover:text-gray-700 transition-colors"
          >
            <X size={20} />
          </button>
        </div>

        {/* Content */}
        <div className="p-6 flex gap-8">
          {/* Available Members */}
          <div className="w-1/2">
            <h3 className="text-lg font-semibold mb-4">Available Members</h3>
            <div className="relative mb-4">
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => handleSearch(e.target.value)}
                className="w-full p-3 pl-10 rounded-lg border dark:text-gray-700"
                placeholder="Search members..."
              />
              <UserPlus className="absolute left-3 top-3.5 w-5 h-5 text-gray-400" />
            </div>
            <div className="h-96 overflow-y-auto border rounded-lg p-4">
              {(searchQuery ? searchResults : availableMembers).map((member) => (
                <div
                  key={member.email}
                  className="flex items-center  justify-between p-2 hover:bg-gray-500 rounded-lg cursor-pointer"
                  onClick={() => handleSelectMember(member.email)}
                >
                  <span>{member.email}</span>
                  <button className="text-blue-600 hover:text-blue-800">
                    Add
                  </button>
                </div>
              ))}
            </div>
          </div>

          {/* Selected Members */}
          <div className="w-1/2">
            <h3 className="text-lg font-semibold mb-4">Selected Members</h3>
            <div className="h-96 overflow-y-auto border rounded-lg p-4">
              {selectedMembers.map((email) => (
                <div
                  key={email}
                  className="flex items-center justify-between p-2 bg-gray-50 rounded-lg mb-2"
                >
                  <span>{email}</span>
                  <button
                    onClick={() => handleRemoveMember(email)}
                    className="text-red-600 hover:text-red-800"
                  >
                    Remove
                  </button>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Footer */}
        <div className="flex justify-end p-4 border-t gap-4">
          <button
            onClick={onCloseteam}
            className="px-5 py-2 rounded-md bg-gray-500 text-white hover:bg-gray-600"
          >
            Cancel
          </button>
          <button
            onClick={handleSubmit}
            className="px-5 py-2 rounded-md bg-blue-600 text-white hover:bg-blue-700"
          >
            Add Members
          </button>
        </div>
      </div>
    </div>
  );
};

export default TeamMemberModal;
