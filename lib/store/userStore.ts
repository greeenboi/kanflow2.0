import { load, type Store } from '@tauri-apps/plugin-store';
import type { User } from '@/lib/db/actions';
import { getUserFromCookie, saveUserToCookie, removeUserFromCookie } from '../utils/cookies';

let store: Store | null = null;

// Function to initialize the store
const initializeStore = async (): Promise<Store> => {
  if (!store) {
    store = await load('userStore.json', { autoSave: true, createNew: true });
    console.log('userStore: Store initialized');
  }
  return store;
};

// Add user management methods
export const getUser = async (): Promise<User | null> => {
  console.log('userStore: getUser called');
  const storeInstance = await initializeStore();
  const user = await storeInstance.get<User>('user');
  
  if (!user) {
    console.log('userStore: No user in store, checking cookies');
    const cookieUser = getUserFromCookie();
    if (cookieUser) {
      console.log('userStore: Found user in cookies');
      await updateUser(cookieUser);
      return cookieUser;
    }
  }
  
  console.log('userStore: getUser result:', user);
  return user || null;
};

// biome-ignore lint/suspicious/noExplicitAny: <explanation>
export const updateUser = async (userData: User): Promise<void> => {
  console.log('userStore: updateUser called with data:', userData);
  const storeInstance = await initializeStore();
  await storeInstance.set('user', userData);
  await storeInstance.save();
  saveUserToCookie(userData);
  console.log('userStore: updateUser completed and store saved');
};

export const logout = async (): Promise<void> => {
  console.log('userStore: logout called');
  const storeInstance = await initializeStore();
  await storeInstance.delete('user');
  await storeInstance.save();
  removeUserFromCookie();
  console.log('userStore: logout completed and store saved');
};