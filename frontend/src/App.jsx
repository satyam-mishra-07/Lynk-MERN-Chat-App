import Navbar from "./components/Navbar.jsx";
import Home from "./pages/Home.jsx";
import Login from "./pages/Login.jsx";
import Profile from "./pages/Profile.jsx";
import Settings from "./pages/Settings.jsx";
import Signup from "./pages/Signup.jsx";
import { Routes, Route, Navigate } from "react-router-dom";
import { useAuthStore } from "./store/useAuthStore.js";
import { useThemeStore } from "./store/useThemeStore.js";
import { useEffect } from "react";
import { Loader } from "lucide-react";
import { Toaster } from "react-hot-toast";
import Search from "./pages/Search.jsx";
import Lynks from "./pages/Lynks.jsx";
import Request from "./pages/Request.jsx";

function App() {
  const { authUser, checkAuth, isCheckingAuth } = useAuthStore();
  const {theme} = useThemeStore();

  useEffect(() => {
    checkAuth();
  }, [checkAuth]);

  console.log("authUser: ", authUser);

  if (isCheckingAuth && !authUser) {
    return (
      <div className="flex items-center justify-center h-screen">
        <Loader className="size-10 animate-spin" />
      </div>
    );
  }

  return (
    <>
      <div data-theme={theme}>
        <Navbar />

        <Routes>
          <Route path="/" element={authUser ? <Home /> : <Navigate to="/login"/>} />
          <Route path="/signup" element={!authUser ? <Signup /> : <Navigate to="/"/>} />
          <Route path="/login" element={!authUser ? <Login /> : <Navigate to="/"/>} />
          <Route path="/profile" element={authUser ? <Profile /> : <Navigate to="/login"/>} />
          <Route path="/search" element={authUser ? <Search /> : <Navigate to="/login"/>} />
          <Route path="/lynks" element={authUser ? <Lynks /> : <Navigate to="/login"/>} />
          <Route path="/requests" element={authUser ? <Request /> : <Navigate to="/login"/>} />
          <Route path="/settings" element={<Settings />} />
          <Route path="*" element={<Home />} />
        </Routes>

        <Toaster />
      </div>
    </>
  );
}

export default App;
