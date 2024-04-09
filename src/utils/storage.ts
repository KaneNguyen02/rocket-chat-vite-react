
export const StorageService = {
  get(key: string) {
    const value = localStorage.getItem(key);
    if (value) {
      try {
        return JSON.parse(value);
      } catch (e) {
        console.error("Error parsing localStorage value for key:", key);
        return null;
      }
    } 
    return null;
  },

  set(key: string, value: any) {
    try {
      const valueToStore = JSON.stringify(value);
      localStorage.setItem(key, valueToStore);
    } catch (e) {
      console.error("Error setting localStorage key:", key);
    }
  },

  remove(key: string) {
    localStorage.removeItem(key);
  },

  clear() {
    localStorage.clear();
  }
};

export default StorageService;