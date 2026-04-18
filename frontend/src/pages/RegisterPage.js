import { useState } from "react";
import { useNavigate } from "react-router-dom";
import API from "../api/axios";
import "../styles/RegisterPage.css";

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
      <div className="register-wrapper">
        <div className="register-content">
          <h2>Join My Community</h2>
          <p>
            Sign up to stay updated with my latest web development projects,
            tutorials, and portfolio improvements. Get exclusive access to
            behind-the-scenes content and early project announcements.
          </p>

          <div className="register-image">
            <img src="/assets/decorative.jpg" alt="Web development illustration" />
          </div>
        </div>

        <div className="register-form-card">
          <h3>Create Your Account</h3>

          <form onSubmit={validateForm}>
            <div className="form-row">
              <div className="form-group">
                <label>Full Name</label>
                <input
                  type="text"
                  value={fullname}
                  onChange={(e) => setFullname(e.target.value)}
                  placeholder="Enter your full name"
                />
                <span className="error">{errors.fullname}</span>
              </div>

              <div className="form-group">
                <label>Username</label>
                <input
                  type="text"
                  value={username}
                  onChange={(e) => setUsername(e.target.value)}
                  placeholder="Choose a username"
                />
                <span className="error">{errors.username}</span>
              </div>
            </div>

            <div className="form-group">
              <label>Email Address</label>
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="Enter your email"
              />
              <span className="error">{errors.email}</span>
            </div>

            <div className="form-row">
              <div className="form-group">
                <label>Password</label>
                <input
                  type="password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="Create a password"
                />
                <span className="error">{errors.password}</span>
              </div>

              <div className="form-group">
                <label>Confirm Password</label>
                <input
                  type="password"
                  value={confirmPassword}
                  onChange={(e) => setConfirmPassword(e.target.value)}
                  placeholder="Confirm your password"
                />
                <span className="error">{errors.confirmPassword}</span>
              </div>
            </div>

            <div className="form-group">
              <label>Date of Birth</label>
              <input
                type="date"
                value={dob}
                onChange={(e) => setDob(e.target.value)}
              />
              <span className="error">{errors.dob}</span>
            </div>

            <div className="form-group">
              <label>Interest Level</label>
              <div className="radio-group">
                <label className="radio-option">
                  <input
                    type="radio"
                    value="beginner"
                    checked={level === "beginner"}
                    onChange={(e) => setLevel(e.target.value)}
                  />
                  <span>Beginner - Just getting started</span>
                </label>

                <label className="radio-option">
                  <input
                    type="radio"
                    value="intermediate"
                    checked={level === "intermediate"}
                    onChange={(e) => setLevel(e.target.value)}
                  />
                  <span>Intermediate - Some experience</span>
                </label>

                <label className="radio-option">
                  <input
                    type="radio"
                    value="expert"
                    checked={level === "expert"}
                    onChange={(e) => setLevel(e.target.value)}
                  />
                  <span>Expert - Advanced developer</span>
                </label>
              </div>
              <span className="error">{errors.level}</span>
            </div>

            <div className="checkbox-group">
              <input
                type="checkbox"
                checked={terms}
                onChange={(e) => setTerms(e.target.checked)}
                id="terms"
              />
              <label htmlFor="terms">
                I agree to the terms and conditions and privacy policy
              </label>
            </div>
            <span className="error">{errors.terms}</span>

            <button type="submit" className="btn">Create Account</button>
          </form>
        </div>
      </div>
    </section>
  );
}

export default RegisterPage;