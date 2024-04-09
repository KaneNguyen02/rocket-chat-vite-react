import StorageService from "../utils/storage";

export const useAuth = () => {
  const isLogin = StorageService.get("isLogin");
  return { isLogin };
};
