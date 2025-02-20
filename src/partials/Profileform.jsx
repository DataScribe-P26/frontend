import React, { useState, useEffect, useRef } from 'react';
import { User, Upload, Camera, Loader2, X } from 'lucide-react';

export const ProfileForm = ({ user, onUpdate }) => {
  const [formData, setFormData] = useState({
    email: user?.email || '',
    full_name: user?.full_name || '',
    title: user?.title || '',
    phone: user?.phone || '',
    location: user?.location || '',
    bio: user?.bio || '',
    github: user?.github || '',
    linkedin: user?.linkedin || '',
    website: user?.website || '',
    skills: user?.skills || [],
    profile_picture: user?.profile_picture || null,
  });
  
  const [imagePreview, setImagePreview] = useState(user?.profile_picture || null);
  const [isUploading, setIsUploading] = useState(false);
  const [showImageModal, setShowImageModal] = useState(false);
  const fileInputRef = useRef(null);
  
  useEffect(() => {
    // Update form data if user prop changes
    if (user) {
      setFormData({
        email: user.email || '',
        full_name: user.full_name || '',
        title: user.title || '',
        phone: user.phone || '',
        location: user.location || '',
        bio: user.bio || '',
        github: user.github || '',
        linkedin: user.linkedin || '',
        website: user.website || '',
        skills: user.skills || [],
        profile_picture: user.profile_picture || null,
      });
      
      setImagePreview(user.profile_picture || null);
    }
  }, [user]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleImageChange = (e) => {
    const file = e.target.files[0];
    if (!file) return;
    
    // Preview the selected image
    const reader = new FileReader();
    reader.onloadend = () => {
      setImagePreview(reader.result);
    };
    reader.readAsDataURL(file);
    
    // Handle image upload
    uploadProfileImage(file);
  };
  
  const uploadProfileImage = async (file) => {
    setIsUploading(true);
    
    try {
      // Create a FormData object to send the file
      const formData = new FormData();
      formData.append('profile_image', file);
      
      // Example API call - replace with your actual API endpoint
      const response = await fetch('/api/upload-profile-image', {
        method: 'POST',
        body: formData,
        // No Content-Type header needed as it will be set automatically for FormData
      });
      
      if (!response.ok) throw new Error('Failed to upload image');
      
      const data = await response.json();
      
      // Update form state with the image URL returned from the server
      setFormData(prev => ({
        ...prev,
        profile_picture: data.imageUrl
      }));
      
    } catch (error) {
      console.error('Error uploading image:', error);
      // Handle error - could add toast notification here
    } finally {
      setIsUploading(false);
    }
  };
  
  const triggerFileInput = () => {
    fileInputRef.current.click();
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    try {
      // Assuming onUpdate makes the API call, or implement API call here
      await onUpdate(formData);
    } catch (error) {
      console.error('Error updating profile:', error);
      // Handle error
    }
  };

  const openImageModal = () => {
    if (imagePreview) {
      setShowImageModal(true);
    }
  };

  const closeImageModal = () => {
    setShowImageModal(false);
  };

  const inputClasses = "w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-purple-500 outline-none transition-colors duration-200 bg-white dark:bg-gray-800 text-gray-900 dark:text-white border-gray-300 dark:border-gray-600";
  const labelClasses = "block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1";

  return (
    <>
      <form onSubmit={handleSubmit} className="space-y-6 p-6 bg-white dark:bg-gray-900 rounded-lg shadow-md transition-colors duration-200">
        {/* Profile Picture Section */}
        <div className="flex flex-col items-center mb-6">
          <h3 className="text-lg font-medium mb-4 text-gray-900 dark:text-white">Profile Picture</h3>
          <div className="relative">
            <div 
              className="w-32 h-32 rounded-full overflow-hidden bg-gray-200 dark:bg-gray-700 flex items-center justify-center border-2 border-purple-300 dark:border-purple-600 cursor-pointer"
              onClick={openImageModal}
            >
              {imagePreview ? (
                <img 
                  src={imagePreview} 
                  alt="Profile preview" 
                  className="w-full h-full object-cover"
                />
              ) : (
                <User className="w-16 h-16 text-gray-400 dark:text-gray-500" />
              )}
              {isUploading && (
                <div className="absolute inset-0 bg-black bg-opacity-50 flex items-center justify-center rounded-full">
                  <Loader2 className="w-8 h-8 text-white animate-spin" />
                </div>
              )}
            </div>
            <button
              type="button"
              onClick={triggerFileInput}
              className="absolute bottom-0 right-0 bg-purple-600 p-2 rounded-full text-white hover:bg-purple-700 transition-colors duration-200"
              disabled={isUploading}
            >
              <Camera className="w-4 h-4" />
            </button>
            <input
              type="file"
              ref={fileInputRef}
              onChange={handleImageChange}
              className="hidden"
              accept="image/*"
            />
          </div>
          <p className="text-sm text-gray-500 dark:text-gray-400 mt-2">
            {imagePreview ? "Click on image to view full size" : "Click the camera icon to upload a profile picture"}
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div>
            <label className={labelClasses}>
              Email Address
            </label>
            <input
              type="email"
              name="email"
              value={formData.email}
              onChange={handleChange}
              className={inputClasses}
              placeholder="Enter your email address"
              readOnly={user?.email ? true : false} // Make read-only if editing existing user
            />
          </div>

          <div>
            <label className={labelClasses}>
              Full Name
            </label>
            <input
              type="text"
              name="full_name"
              value={formData.full_name}
              onChange={handleChange}
              className={inputClasses}
              placeholder="Enter your full name"
            />
          </div>

          <div>
            <label className={labelClasses}>
              Title
            </label>
            <input
              type="text"
              name="title"
              value={formData.title}
              onChange={handleChange}
              className={inputClasses}
              placeholder="Enter your job title"
            />
          </div>

          <div>
            <label className={labelClasses}>
              Phone
            </label>
            <input
              type="tel"
              name="phone"
              value={formData.phone}
              onChange={handleChange}
              className={inputClasses}
              placeholder="Enter your phone number"
            />
          </div>

          <div>
            <label className={labelClasses}>
              Location
            </label>
            <input
              type="text"
              name="location"
              value={formData.location}
              onChange={handleChange}
              className={inputClasses}
              placeholder="Enter your location"
            />
          </div>

          <div>
            <label className={labelClasses}>
              Website
            </label>
            <input
              type="url"
              name="website"
              value={formData.website}
              onChange={handleChange}
              className={inputClasses}
              placeholder="Enter your website URL"
            />
          </div>

          <div className="md:col-span-2">
            <label className={labelClasses}>
              Bio
            </label>
            <textarea
              name="bio"
              value={formData.bio}
              onChange={handleChange}
              rows={4}
              className={inputClasses}
              placeholder="Tell us about yourself..."
            />
          </div>

          <div>
            <label className={labelClasses}>
              GitHub Profile
            </label>
            <div className="relative">
              <div className="absolute inset-y-0 left-0 flex items-center pl-3 pointer-events-none">
                <svg className="w-5 h-5 text-gray-500 dark:text-gray-400" fill="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                  <path d="M12 0C5.37 0 0 5.37 0 12c0 5.31 3.435 9.795 8.205 11.385.6.105.825-.255.825-.57 0-.285-.015-1.23-.015-2.235-3.015.555-3.795-.735-4.035-1.41-.135-.345-.72-1.41-1.23-1.695-.42-.225-1.02-.78-.015-.795.945-.015 1.62.87 1.845 1.23 1.08 1.815 2.805 1.305 3.495.99.105-.78.42-1.305.765-1.605-2.67-.3-5.46-1.335-5.46-5.925 0-1.305.465-2.385 1.23-3.225-.12-.3-.54-1.53.12-3.18 0 0 1.005-.315 3.3 1.23.96-.27 1.98-.405 3-.405s2.04.135 3 .405c2.295-1.56 3.3-1.23 3.3-1.23.66 1.65.24 2.88.12 3.18.765.84 1.23 1.905 1.23 3.225 0 4.605-2.805 5.625-5.475 5.925.435.375.81 1.095.81 2.22 0 1.605-.015 2.895-.015 3.3 0 .315.225.69.825.57A12.02 12.02 0 0024 12c0-6.63-5.37-12-12-12z" />
                </svg>
              </div>
              <input
                type="url"
                name="github"
                value={formData.github}
                onChange={handleChange}
                className={`${inputClasses} pl-10`}
                placeholder="https://github.com/username"
              />
            </div>
          </div>

          <div>
            <label className={labelClasses}>
              LinkedIn Profile
            </label>
            <div className="relative">
              <div className="absolute inset-y-0 left-0 flex items-center pl-3 pointer-events-none">
                <svg className="w-5 h-5 text-gray-500 dark:text-gray-400" fill="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                  <path d="M20.447 20.452h-3.554v-5.569c0-1.328-.027-3.037-1.852-3.037-1.853 0-2.136 1.445-2.136 2.939v5.667H9.351V9h3.414v1.561h.046c.477-.9 1.637-1.85 3.37-1.85 3.601 0 4.267 2.37 4.267 5.455v6.286zM5.337 7.433c-1.144 0-2.063-.926-2.063-2.065 0-1.138.92-2.063 2.063-2.063 1.14 0 2.064.925 2.064 2.063 0 1.139-.925 2.065-2.064 2.065zm1.782 13.019H3.555V9h3.564v11.452zM22.225 0H1.771C.792 0 0 .774 0 1.729v20.542C0 23.227.792 24 1.771 24h20.454C23.2 24 24 23.227 24 22.271V1.729C24 .774 23.2 0 22.225 0z" />
                </svg>
              </div>
              <input
                type="url"
                name="linkedin"
                value={formData.linkedin}
                onChange={handleChange}
                className={`${inputClasses} pl-10`}
                placeholder="https://linkedin.com/in/username"
              />
            </div>
          </div>
        </div>

        <div className="flex justify-end space-x-4">
          <button
            type="button"
            className="px-4 py-2 bg-gray-200 text-gray-800 dark:bg-gray-700 dark:text-gray-200 rounded-lg hover:bg-gray-300 dark:hover:bg-gray-600 transition-colors duration-200"
            onClick={() => window.history.back()}
          >
            Cancel
          </button>
          <button
            type="submit"
            className="px-4 py-2 bg-purple-600 text-white rounded-lg hover:bg-purple-700 transition-colors duration-200 flex items-center"
          >
            <span>Save Changes</span>
          </button>
        </div>
      </form>

      {/* Image Preview Modal */}
      {showImageModal && (
        <div className="fixed inset-0 bg-black bg-opacity-70 flex items-center justify-center z-50 p-4" role="dialog" aria-modal="true">
          <div className="relative bg-white dark:bg-gray-800 p-2 rounded-lg max-w-3xl max-h-full overflow-auto">
            <button 
              onClick={closeImageModal}
              className="absolute top-2 right-2 text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-200"
              aria-label="Close modal"
            >
              <X className="w-6 h-6" />
            </button>
            <div className="mt-6 mb-2 flex justify-center">
              <img 
                src={imagePreview} 
                alt="Profile" 
                className="max-w-full max-h-96 object-contain"
              />
            </div>
          </div>
        </div>
      )}
    </>
  );
};