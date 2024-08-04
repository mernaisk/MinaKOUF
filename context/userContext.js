// context/UserContext.js
import React, { createContext, useContext, useState, useEffect } from 'react';
import { onAuthStateChanged } from 'firebase/auth';
import { auth } from '../firebase/firebaseConfig';
import { getOneDocInCollection } from '../firebase/firebaseModel';
import { useQuery } from '@tanstack/react-query';

const UserContext = createContext();

export const UserProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [userInfo, setUserInfo] = useState(null);

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (user) => {
      if (user) {
        setUser(user);
        console.log('User is set:', user); // Debug log
      } else {
        setUser(null);
        setUserInfo(null); // Clear userInfo when user logs out
      }
    });
    return () => unsubscribe();
  }, []);

  const { data, isLoading, isError } = useQuery({
    queryFn: () => getOneDocInCollection('STMinaKOUFData', user?.uid),
    queryKey: ['userInfo', user?.uid],
    onError: (error) => {
      console.error('Error fetching userInfo:', error); // Debug log
    },
  });

  useEffect(() => {
    setUserInfo(data);
}, [data]);

  return (
    <UserContext.Provider value={{ user, userInfo, isLoading }}>
      {children}
    </UserContext.Provider>
  );
};

export const useUser = () => useContext(UserContext);
