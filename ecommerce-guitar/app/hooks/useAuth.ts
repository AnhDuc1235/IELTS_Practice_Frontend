import { useEffect, useState } from "react";
import { getCurrentUser } from "../(main)/_actions/auth.action";

export const useAuth = () => {
  const [user, setUser] = useState(
    {} as {
      id: number;
      name: string;
      email: string;
    },
  );
  const [isLoading, setLoading] = useState(true);
  const [isAuthenticated, setAuthenticated] = useState(false);
  const [accessToken, setAccessToken] = useState("");

  useEffect(() => {
    const getUser = async () => {
      try {
        const currentUser = await getCurrentUser();
        if (!currentUser) {
          setAccessToken("");
          setAuthenticated(false);
          setLoading(false);
          return;
        }
        setUser(currentUser.data);
        setAccessToken(currentUser.accessToken);
        setAuthenticated(true);
      } catch (error) {
        console.error("Auth error:", error);
        setAccessToken("");
        setAuthenticated(false);
      } finally {
        setLoading(false);
      }
    };
    getUser();
  }, []);

  return { user, isLoading, isAuthenticated, accessToken };
};
