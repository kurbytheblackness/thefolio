import { BrowserRouter, Routes, Route } from "react-router-dom";

import { useState, useEffect } from "react";

import Navbar from "./components/Navbar";

import HomePage from "./pages/HomePage";
import LoginPage from "./pages/LoginPage";
import RegisterPage from "./pages/RegisterPage";
import CreatePostPage from "./pages/CreatePostPage";
import EditPostPage from "./pages/EditPostPage";
import Contact from "./pages/Contact";
import AboutPage from "./pages/AboutPage";
import MyProfile from "./pages/MyProfile";
import AdminDashboard from "./pages/AdminDashboard";
import ProtectedRoute from "./components/ProtectedRoute";
import AdminRoute from "./components/AdminRoute";

// CSS imports
import "./styles/global.css";
import "./styles/header.css";
import "./styles/hero.css";
import "./styles/posts.css";
import "./styles/forms.css";
import "./styles/quotes.css";
import "./styles/darkmode.css";
import "./styles/AboutPage.css";

function App() {

  // 🔐 GLOBAL AUTH STATE
  const [isLoggedIn, setIsLoggedIn] = useState(false);

    // 🔥 persist login
  useEffect(() => {
    const user = localStorage.getItem("user");
    if (user) setIsLoggedIn(true);
  }, []);

  return (
    <BrowserRouter>

      {/* 🔥 NAVBAR ALWAYS VISIBLE */}
      <Navbar 
        isLoggedIn={isLoggedIn} 
        setIsLoggedIn={setIsLoggedIn} 
      />

      <Routes>

        <Route 
          path="/" 
          element={<HomePage isLoggedIn={isLoggedIn} />} 
        />

        <Route 
          path="/login" 
          element={<LoginPage setIsLoggedIn={setIsLoggedIn} />} 
        />

        <Route 
          path="/register" 
          element={<RegisterPage />} 
        />

        <Route element={<ProtectedRoute />}>
          <Route 
            path="/create-post" 
            element={<CreatePostPage />} 
          />
          <Route
            path="/edit-post/:id"
            element={<EditPostPage />}
          />
        </Route>

        <Route 
          path="/contact" 
          element={<Contact />} 
        />

        <Route 
          path="/about" 
          element={<AboutPage />} 
        />

        <Route element={<ProtectedRoute />}>
          <Route 
            path="/profile" 
            element={<MyProfile />} 
          />
        </Route>

        <Route element={<AdminRoute />}>
          <Route 
            path="/admin" 
            element={<AdminDashboard />} 
          />
        </Route>

      </Routes>
    </BrowserRouter>
  );
}

export default App;