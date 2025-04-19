const useLocalStorage = () => {
  const isLocalStorageAvailable = (): boolean => {
    // Prevents accessing LS on Server and or in the case of disabled browser cookies
    try {
      const testKey = '__test__';
      localStorage.setItem(testKey, 'test');
      localStorage.removeItem(testKey);
      return true;
    } catch {
      return false;
    }
  };

  const setLocalStorage = (key: string, value: string) => {
    try {
      if (isLocalStorageAvailable()) {
        localStorage.removeItem(key);
        localStorage.setItem(key, value);
      }
    } catch (error) {
      console.error('Could not set localStorage key:', key, error);
    }
  };

  const getLocalStorage = (key: string) => {
    try {
      if (isLocalStorageAvailable()) {
        return localStorage.getItem(key);
      }
    } catch (error) {
      console.error('Could not get localStorage key:', key, error);
      return null;
    }
  };

  const clearLocalStorage = () => {
    try {
      if (isLocalStorageAvailable()) {
        localStorage.clear();
      }
    } catch (error) {
      console.error('Could not clear localStorage:', error);
    }
  };

  const getLocalStorageJSON = (key: string) => {
    try {
      const item = getLocalStorage(key);
      return item ? JSON.parse(item) : null;
    } catch (error) {
      console.error('Could not parse localStorage key:', key, error);
      return {};
    }
  };

  const removeLocalStorage = (key: string) => {
    try {
      if (isLocalStorageAvailable()) {
        localStorage.removeItem(key);
      }
    } catch (error) {
      console.error('Could not remove localStorage key:', key, error);
    }
  };

  return {
    setLocalStorage,
    getLocalStorage,
    clearLocalStorage,
    getLocalStorageJSON,
    isLocalStorageAvailable,
    removeLocalStorage,
  };
};

export default useLocalStorage;
