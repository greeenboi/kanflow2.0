'use client';
import type React from 'react';
import { createContext, useContext, useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { getUser, updateUser, logout } from '@/lib/store/userStore';
import type { User } from '@/lib/db/actions';

interface UserContextProps {
  user: User | null;
  setUser: (userData: User) => void;
  logoutUser: () => void;
}

const UserContext = createContext<UserContextProps | undefined>(undefined);

export function useUser() {
  const context = useContext(UserContext);
  if (!context) {
    throw new Error('useUser must be used within a UserProvider');
  }
  return context;
}

const UserProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [user, setUserState] = useState<User | null>(null);
  const router = useRouter();

  useEffect(() => {
    const fetchUser = async () => {
      try {
        console.log('UserProvider: Fetching user from store');
        const currentUser = await getUser();
        console.log('UserProvider: Fetched user:', currentUser);
        setUserState(currentUser);
        
        if (currentUser) {
          console.log('UserProvider: User found, redirecting to dashboard');
          router.push('/dashboard');
        }
      } catch (error) {
        console.error('UserProvider: Error fetching user:', error);
        setUserState(null);
      }
    };
    fetchUser();
  }, [router]);

  const setUser = async (userData: User): Promise<void> => {
    console.log('UserProvider: Setting user:', userData);
    await updateUser(userData);
    setUserState(userData);
    console.log('UserProvider: User state updated');
  };

  const logoutUser = async (): Promise<void> => {
    console.log('UserProvider: Logging out user');
    await logout();
    setUserState(null);
    console.log('UserProvider: User logged out');
  };

  return (
    <UserContext.Provider value={{ user, setUser, logoutUser }}>
      {children}
    </UserContext.Provider>
  );
};

export default UserProvider;