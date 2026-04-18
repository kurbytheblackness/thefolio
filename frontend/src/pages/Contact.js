import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import API from "../api/axios";
import "../styles/ContactPage.css";

function Contact() {
  const navigate = useNavigate();
  const [name,setName] = useState("");
  const [email,setEmail] = useState("");
  const [message,setMessage] = useState("");
  const [loading, setLoading] = useState(false);

  // Check if user is admin and redirect
  useEffect(() => {
    const user = JSON.parse(localStorage.getItem("user"));
    if (user && user.role === "admin") {
      navigate("/admin"); // Redirect admin to admin dashboard
    }
  }, [navigate]);

  const submitForm = async (e)=>{
    e.preventDefault();

    if(name.length < 2){
      alert("Name too short");
      return;
    }

    if(!email.includes("@")){
      alert("Invalid email");
      return;
    }

    if(message.length < 10){
      alert("Message too short");
      return;
    }

    setLoading(true);

    try {
      await API.post("/contacts", {
        name,
        email,
        message
      });

      alert("Message sent successfully!");
      setName("");
      setEmail("");
      setMessage("");
    } catch (err) {
      console.error("CONTACT ERROR:", err);
      alert(err.response?.data?.message || "Failed to send message");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="contact-container">
      <section className="contact-section">
        <h2>Contact Me</h2>

        <form onSubmit={submitForm} className="contact-form">
          <div className="form-group">
            <label htmlFor="name">Name</label>
            <input
              id="name"
              type="text"
              placeholder="Your Name"
              value={name}
              onChange={(e)=>setName(e.target.value)}
            />
          </div>

          <div className="form-group">
            <label htmlFor="email">Email</label>
            <input
              id="email"
              type="email"
              placeholder="Your Email"
              value={email}
              onChange={(e)=>setEmail(e.target.value)}
            />
          </div>

          <div className="form-group">
            <label htmlFor="message">Message</label>
            <textarea
              id="message"
              placeholder="Your Message"
              value={message}
              onChange={(e)=>setMessage(e.target.value)}
            />
          </div>

          <button type="submit" className="submit-btn" disabled={loading}>
            {loading ? "Sending..." : "Send Message"}
          </button>
        </form>
      </section>

      <section className="contact-section resources-section">
        <h2>Helpful Resources</h2>

        <table className="resources-table">
          <thead>
            <tr>
              <th>Resource Name</th>
              <th>Description</th>
            </tr>
          </thead>

          <tbody>
            <tr>
              <td>MDN Web Docs</td>
              <td>Comprehensive documentation for HTML, CSS, and JavaScript.</td>
            </tr>

            <tr>
              <td>W3Schools</td>
              <td>Beginner-friendly tutorials for web development.</td>
            </tr>

            <tr>
              <td>PHP.net</td>
              <td>Official PHP manual for backend programming.</td>
            </tr>
          </tbody>
        </table>

        <div className="resources-links">
          <a href="https://developer.mozilla.org" target="_blank" rel="noopener noreferrer">
            MDN Web Docs
          </a>{" | "}
          <a href="https://www.w3schools.com" target="_blank" rel="noopener noreferrer">
            W3Schools
          </a>{" | "}
          <a href="https://www.php.net" target="_blank" rel="noopener noreferrer">
            PHP.net
          </a>
        </div>
      </section>

      <section className="contact-section contact-map-section">
        <h2>Visit Us</h2>
        <div className="contact-map-container">
          <img
            src="/assets/loc.png"
            alt="Contact location map"
            className="contact-map-image"
          />
        </div>
      </section>
    </div>
    
  );
}

export default Contact;