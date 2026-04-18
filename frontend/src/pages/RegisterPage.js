import { useState } from "react";
import { useNavigate } from "react-router-dom";
import API from "../api/axios";

function RegisterPage() {

  const [fullname, setFullname] = useState("");
  const [username, setUsername] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [dob, setDob] = useState("");
  const [level, setLevel] = useState("");
  const [terms, setTerms] = useState(false);

  const [errors, setErrors] = useState({});

  const navigate = useNavigate();

  const validateForm = async (e) => {
    e.preventDefault();

    let newErrors = {};

    // ✅ FULL NAME
    if (fullname.trim() === "") {
      newErrors.fullname = "Full name is required";
    }

    // ✅ USERNAME
    if (username.trim() === "") {
      newErrors.username = "Username is required";
    } else if (username.length < 4) {
      newErrors.username = "Username must be at least 4 characters";
    }

    // ✅ EMAIL
    if (email.trim() === "") {
      newErrors.email = "Email is required";
    } else if (!email.includes("@")) {
      newErrors.email = "Invalid email";
    }

    // ✅ PASSWORD
    if (password === "") {
      newErrors.password = "Password is required";
    } else if (password.length < 6) {
      newErrors.password = "Password must be at least 6 characters";
    }

    // ✅ CONFIRM PASSWORD
    if (confirmPassword === "") {
      newErrors.confirmPassword = "Please confirm your password";
    } else if (password !== confirmPassword) {
      newErrors.confirmPassword = "Passwords do not match";
    }

    // ✅ DOB + AGE CHECK (FIXED)
    if (dob === "") {
      newErrors.dob = "Date of birth is required";
    } else {
      const today = new Date();
      const birth = new Date(dob);

      let age = today.getFullYear() - birth.getFullYear();
      const m = today.getMonth() - birth.getMonth();

      if (m < 0 || (m === 0 && today.getDate() < birth.getDate())) {
        age--;
      }

      if (age < 18) {
        newErrors.dob = "You must be at least 18 years old";
      }
    }

    // ✅ LEVEL
    if (level === "") {
      newErrors.level = "Please select interest level";
    }

    // ✅ TERMS
    if (!terms) {
      newErrors.terms = "You must agree to the terms";
    }

    setErrors(newErrors);

    // 🚀 IF NO ERRORS → REGISTER
    if (Object.keys(newErrors).length === 0) {
      try {

        await API.post(
          "/auth/register",
          {
            name: fullname,
            username: username,
            email: email,
            password: password,
            dob: dob,
            level: level
          }
        );

        alert("Registration successful!");

        // 🧹 CLEAR FORM
        setFullname("");
        setUsername("");
        setEmail("");
        setPassword("");
        setConfirmPassword("");
        setDob("");
        setLevel("");
        setTerms(false);

        // 🔥 REDIRECT TO LOGIN
        navigate("/login");

      } catch (err) {
        alert("Registration failed");
      }
    }
  };

  return (
    <section className="register-container">

      <h2>Sign Up for Updates</h2>

      <p>
        By signing up, you’ll receive updates about my latest web development
        projects and portfolio improvements.
      </p>

      <div className="form-image">
        <img src="/assets/decorative.jpg" alt="Web development illustration" />
      </div>

      <form onSubmit={validateForm}>

        <label>Full Name:</label>
        <input
          type="text"
          value={fullname}
          onChange={(e) => setFullname(e.target.value)}
        />
        <span className="error">{errors.fullname}</span>

        <label>Preferred Username:</label>
        <input
          type="text"
          value={username}
          onChange={(e) => setUsername(e.target.value)}
        />
        <span className="error">{errors.username}</span>

        <label>Email:</label>
        <input
          type="email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
        />
        <span className="error">{errors.email}</span>

        <label>Password:</label>
        <input
          type="password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
        />
        <span className="error">{errors.password}</span>

        <label>Confirm Password:</label>
        <input
          type="password"
          value={confirmPassword}
          onChange={(e) => setConfirmPassword(e.target.value)}
        />
        <span className="error">{errors.confirmPassword}</span>

        <label>Date of Birth:</label>
        <input
          type="date"
          value={dob}
          onChange={(e) => setDob(e.target.value)}
        />
        <span className="error">{errors.dob}</span>

        <p><strong>Interest Level:</strong></p>

        <label>
          <input
            type="radio"
            value="beginner"
            checked={level === "beginner"}
            onChange={(e) => setLevel(e.target.value)}
          />
          Beginner
        </label>

        <label>
          <input
            type="radio"
            value="intermediate"
            checked={level === "intermediate"}
            onChange={(e) => setLevel(e.target.value)}
          />
          Intermediate
        </label>

        <label>
          <input
            type="radio"
            value="expert"
            checked={level === "expert"}
            onChange={(e) => setLevel(e.target.value)}
          />
          Expert
        </label>

        <span className="error">{errors.level}</span>

        <br /><br />

        <label>
          <input
            type="checkbox"
            checked={terms}
            onChange={(e) => setTerms(e.target.checked)}
          />
          I agree to the terms and conditions
        </label>

        <span className="error">{errors.terms}</span>

        <br /><br />

        <button type="submit">Register</button>

      </form>

    </section>
  );
}

export default RegisterPage;