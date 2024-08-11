import React, { createContext, useContext, useState, useEffect } from 'react';
import { onAuthStateChanged } from 'firebase/auth';
import { auth } from '../firebase/firebaseConfig';
import { getOneDocInCollection } from '../firebase/firebaseModel';
import { useQuery } from '@tanstack/react-query';

const UserContext = createContext();

export const UserProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [authChecked, setAuthChecked] = useState(false); // New state to track if auth check is complete
  const [isUserLoading, setIsUserLoading] = useState(true);
  const [isMemberBeingCreated, setIsMemberBeingCreated] = useState(false)
  const { data: userInfo, isLoading: userInfoLoading, isError } = useQuery({
    queryKey: ['userInfo', user?.uid],
    queryFn: () => getOneDocInCollection('Members', user?.uid),
    enabled: !!user && !isMemberBeingCreated, 
    onError: (error) => {
      console.error('Error fetching userInfo:', error);
    },
  });

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (currentUser) => {
      setUser(currentUser);
      setAuthChecked(true); 
    });

    return () => unsubscribe();
  }, []);

  useEffect(() => {
    if (authChecked) {
      setIsUserLoading(user ? userInfoLoading : false);
    }
  }, [authChecked, user, userInfoLoading]);


  return (
    <UserContext.Provider value={{ user, userInfo, isUserLoading,setIsMemberBeingCreated }}>
      {children}
    </UserContext.Provider>
  );
};

export const useUser = () => useContext(UserContext);
