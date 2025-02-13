// hooks/useUser.js
import { useState, useEffect } from 'react';

// Mock data for development
const MOCK_USER = {
  id: 1,
  name: 'Mohit Kirtane',
  title: 'Software Engineer',
  email: 'test@example.com',
  phone: '+123456789',
  location: 'Kothrud, Pune',
  bio: 'Full-stack developer with 5 years of experience',
  github: 'https://github.com/mohit',
  linkedin: 'https://linkedin.com/in/mohit',
  website: 'https://mohit.dev',
  avatar: null,
  organizationName: 'Mohit k.',
  skills: ['React', 'Node.js', 'TypeScript']
};

export const useUser = () => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    // Simulate API call with mock data
    const fetchUser = async () => {
      try {
        // Simulate network delay
        await new Promise(resolve => setTimeout(resolve, 1000));
        setUser(MOCK_USER);
      } catch (err) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };

    fetchUser();
  }, []);

  const updateUser = async (userData) => {
    try {
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 1000));
      const updatedUser = { ...MOCK_USER, ...userData };
      setUser(updatedUser);
      return updatedUser;
    } catch (err) {
      setError(err.message);
      throw err;
    }
  };

  return { user, loading, error, updateUser };
};
