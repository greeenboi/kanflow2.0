'use client';
import type React from 'react';
import { createContext, useContext, useState, useEffect } from 'react';
import { useRouter, usePathname } from 'next/navigation';
import { getUser, updateUser, logout } from '@/lib/store/userStore';
import type { User } from '@/lib/db/actions';
import { RefreshCcw } from 'lucide-react';

// Route configuration
const PROTECTED_ROUTES = ['/dashboard', '/settings', '/profile'];
const PUBLIC_ONLY_ROUTES = ['/auth', '/learnmore', '/'];

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

const UserProvider: React.FC<{ children: React.ReactNode }> = ({
  children,
}) => {
  const [user, setUserState] = useState<User | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const router = useRouter();
  const pathname = usePathname();

  useEffect(() => {
    const fetchUser = async () => {
      try {
        console.log('UserProvider: Fetching user from store');
        const currentUser = await getUser();
        console.log('UserProvider: Fetched user:', currentUser);
        setUserState(currentUser);

        // Route protection logic
        if (currentUser) {
          // If user is authenticated and tries to access public-only routes
          if (PUBLIC_ONLY_ROUTES.includes(pathname)) {
            console.log(
              'UserProvider: Authenticated user redirecting to dashboard'
            );
            router.push('/dashboard');
          }
        } else {
          // If user is not authenticated and tries to access protected routes
          if (PROTECTED_ROUTES.some(route => pathname.startsWith(route))) {
            console.log(
              'UserProvider: Unauthenticated user redirecting to login'
            );
            router.push(`/auth?from=${pathname}`);
          }
        }
      } catch (error) {
        console.error('UserProvider: Error fetching user:', error);
        setUserState(null);
      } finally {
        setIsLoading(false);
      }
    };
    fetchUser();
  }, [pathname, router]);

  const setUser = async (userData: User): Promise<void> => {
    console.log('UserProvider: Setting user:', userData);
    await updateUser(userData);
    setUserState(userData);
    console.log('UserProvider: User state updated');
    router.push('/dashboard');
  };

  const logoutUser = async (): Promise<void> => {
    console.log('UserProvider: Logging out user');
    await logout();
    setUserState(null);
    console.log('UserProvider: User logged out');
    router.push('/auth');
  };

  if (isLoading) {
    return <RefreshCcw className="animate-spin" />;
  }

  return (
    <UserContext.Provider value={{ user, setUser, logoutUser }}>
      {children}
    </UserContext.Provider>
  );
};

export default UserProvider;
