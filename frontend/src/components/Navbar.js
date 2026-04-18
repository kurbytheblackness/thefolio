import { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { useNavigate } from "react-router-dom";


function Navbar({ isLoggedIn, setIsLoggedIn }) {

  const [darkMode, setDarkMode] = useState(false);
  const user = JSON.parse(localStorage.getItem("user"));
  console.log(user);
  useEffect(() => {
    const saved = localStorage.getItem("darkMode") === "true";

    setDarkMode(saved);

    if (saved) {
      document.body.classList.add("dark-mode");
    }
  }, []);

  const toggleDarkMode = () => {
    const newMode = !darkMode;
    setDarkMode(newMode);

    document.body.classList.toggle("dark-mode");
    localStorage.setItem("darkMode", newMode);
  };

  const navigate = useNavigate();

  const handleLogout = () => {
    const confirmLogout = window.confirm("Are you sure you want to logout?");
    if (confirmLogout) {
      localStorage.removeItem("user");
      setIsLoggedIn(false);
      navigate("/login"); // redirect after logout
    }
  };

  return (
    <header>

      <h1>My Portfolio</h1>

      <nav>

        <Link to="/">Home</Link>
        <Link to="/about">About</Link>
        {(!user || user.role !== "admin") && (
          <Link to="/contact">Contact</Link>
        )}

        {/* 🔐 CONDITIONAL NAV */}
        {!isLoggedIn ? (
          <>
            <Link to="/login">Login</Link>
            <Link to="/register">Register</Link>
          </>
        ) : (
          <>
            <Link to="/profile">My Profile</Link>
            {user && user.role === "admin" && (
              <Link to="/admin">Admin Dashboard</Link>
            )}

            <button onClick={handleLogout}>Logout</button>
          </>
        )}

        

        {/* 🌙 DARK MODE */}
        <button onClick={toggleDarkMode}>
          {darkMode ? "Light Mode" : "Dark Mode"}
        </button>

      </nav>

    </header>
  );
}

export default Navbar;