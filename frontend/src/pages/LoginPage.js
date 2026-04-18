import { useState } from "react";
import API from "../api/axios";
import { useNavigate } from "react-router-dom";

function LoginPage({ setIsLoggedIn }) {

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const navigate = useNavigate();

  const handleLogin = async (e) => {
    e.preventDefault();

    try {

      const res = await API.post(
        "/auth/login",
        { email, password }
      );

      alert(res.data.message);

      // 💾 SAVE USER + TOKEN
      localStorage.setItem("user", JSON.stringify(res.data.user));
      localStorage.setItem("token", res.data.token);

      setIsLoggedIn(true);

      navigate("/");

    } catch (err) {
      alert(err.response?.data?.message || "Login failed");
    }
  };

  return (
    <form onSubmit={handleLogin}>
      <h2>Login</h2>

      <input
        type="email"
        placeholder="Email"
        value={email}
        onChange={(e)=>setEmail(e.target.value)}
      />

      <input
        type="password"
        placeholder="Password"
        value={password}
        onChange={(e)=>setPassword(e.target.value)}
      />

      <button type="submit">Login</button>
    </form>
  );
}

export default LoginPage;