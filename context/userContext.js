// context/UserContext.js
import React, { createContext, useContext, useState, useEffect } from 'react';
import { onAuthStateChanged } from 'firebase/auth';
import { auth } from '../firebase/firebaseConfig';
import { getOneDocInCollection } from '../firebase/firebaseModel';
import { useQuery } from '@tanstack/react-query';

const UserContext = createContext();

export const UserProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [isUserLoading, setIsLoading] = useState(false);

  // Use useQuery hook to fetch userInfo based on the user state
  const { data: userInfo, isLoading: userInfoLoading, isError } = useQuery({
    queryKey: ['userInfo', user?.uid],
    queryFn: () => getOneDocInCollection('Members', user?.uid),
    enabled: !!user, // Run the query only if user exists
    onError: (error) => {
      console.error('Error fetching userInfo:', error); // Debug log
    },
  });

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (user) => {
      setUser(user);
      if (!user) {
        setUser(null);
        setIsLoading(false);
      }
    });
    return () => unsubscribe();
  }, []);

  // Update isUserLoading based on both user loading and userInfo loading states
  useEffect(() => {
    setIsLoading(userInfoLoading);
  }, [userInfoLoading]);

  return (
    <UserContext.Provider value={{ user, userInfo, isUserLoading }}>
      {children}
    </UserContext.Provider>
  );
};

export const useUser = () => useContext(UserContext);
