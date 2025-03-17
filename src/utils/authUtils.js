import { useEffect } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import useAuthStore from "../state/store/authData/authStore";

export const setCookie = function (name, value, hours) {
  let expires = "";
  if (hours) {
    let date = new Date();
    date.setTime(date.getTime() + hours * 60 * 60 * 1000);
    expires = "; expires=" + date.toUTCString();
  }
  document.cookie =
    name + "=" + encodeURIComponent(value) + expires + "; path=/";
};

export const getCookie = function (name) {
  let cookies = document.cookie.split("; ");
  for (let i = 0; i < cookies.length; i++) {
    let cookie = cookies[i].split("=");
    if (cookie[0] === name) {
      return decodeURIComponent(cookie[1]);
    }
  }
  return null;
};

export const isPublicRoute = function (path) {
  const publicRoutes = ["/", "/login", "/register", "/price"];
  return publicRoutes.includes(path);
};

export const useAuthCheck = function () {
  const { token, setToken, setUser } = useAuthStore();
  const location = useLocation();
  const navigate = useNavigate();

  useEffect(
    function () {
      const checkAuth = function () {
        const cookieToken = getCookie("token");
        const cookieUserData = getCookie("user");

        if (token && (!cookieToken || !cookieUserData)) {
          localStorage.removeItem("token");
          localStorage.removeItem("user");
          setCookie("token", "", -1);
          setCookie("user", "", -1);
          setToken(null);
          setUser(null);
        }

        if (!token && cookieToken && cookieUserData) {
          setToken(cookieToken);
          try {
            setUser(JSON.parse(cookieUserData));
          } catch (error) {
            console.error("Failed to parse user data from cookie:", error);
            setCookie("user", "", -1);
          }
        }
      };

      checkAuth();
    },
    [token, setToken, setUser]
  );

  useEffect(
    function () {
      if (token && isPublicRoute(location.pathname)) {
        navigate("/home", { replace: true });
      }
    },
    [token, location.pathname, navigate]
  );
};

export const useAuth = function () {
  const {
    token,
    user,
    setToken,
    setUser,
    logout: storeLogout,
  } = useAuthStore();
  const navigate = useNavigate();

  const login = function (accessToken, userData) {
    setCookie("token", accessToken, 3);
    setCookie("user", JSON.stringify(userData), 3);

    localStorage.setItem("token", accessToken);
    localStorage.setItem("user", JSON.stringify(userData));

    setToken(accessToken);
    setUser(userData);
    navigate("/home", { replace: true });
  };

  const logout = function () {
    setCookie("token", "", -1);
    setCookie("user", "", -1);

    localStorage.removeItem("token");
    localStorage.removeItem("user");

    storeLogout();
    navigate("/login", { replace: true });
  };

  return {
    token,
    user,
    login,
    logout,
    isAuthenticated: !!token,
  };
};
