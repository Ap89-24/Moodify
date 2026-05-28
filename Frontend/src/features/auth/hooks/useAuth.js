import { useContext } from "react";
import { register, login, getMe, logout } from "../services/api.auth";
import { AuthContext } from "../auth.context";

export const useAuth = () => {
  const context = useContext(AuthContext);

  if (!context) {
    throw new Error("useAuth must be used within an AuthProvider");
  }

  const { user, setUser, loading, setLoading } = context;

  const registerUser = async ({ username, email, password }) => {
    setLoading(true);
    try {
      const data = await register({ username, email, password });
      setUser(data.user);
    } catch (error) {
      console.error("Error registering user:", error);
    } finally {
      setLoading(false);
    }
  };

  const loginUser = async ({ username, email, password }) => {
    setLoading(true);
    try {
      const data = await login({ username, email, password });
      setUser(data.user);
    } catch (error) {
      console.error("Error logging in user:", error);
    } finally {
      setLoading(false);
    }
  };

  const fetchUser = async () => {
    setLoading(true);
    try {
      const data = await getMe();
      setUser(data.user);
    } catch (error) {
      console.error("Error fetching user:", error);
    } finally {
      setLoading(false);
    }
  };

  const logoutUser = async () => {
    setLoading(true);
    try {
      const data = await logout();
      setUser(null);
    } catch (error) {
      console.error("Error logging out user:", error);
    } finally {
      setLoading(false);
    }
  };

  return ({
    user, loading, registerUser, loginUser, fetchUser, logoutUser
  })
};
