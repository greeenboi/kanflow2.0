import type { User } from '@/lib/db/actions';
import Cookies from 'js-cookie';

const USER_COOKIE_KEY = 'app_user';

export const saveUserToCookie = (user: User) => {
  Cookies.set(USER_COOKIE_KEY, JSON.stringify(user), { expires: 7 });
};

export const getUserFromCookie = (): User | null => {
  const userStr = Cookies.get(USER_COOKIE_KEY);
  if (!userStr) return null;
  try {
    return JSON.parse(userStr);
  } catch (error) {
    console.error('Error parsing user cookie:', error);
    return null;
  }
};

export const removeUserFromCookie = () => {
  Cookies.remove(USER_COOKIE_KEY);
};
