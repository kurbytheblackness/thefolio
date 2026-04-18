import React from "react";
import GuessNumber from "../games/GuessNumber";
import QuotesSection from "../components/QuotesSection";
import "../styles/AboutPage.css";

function About() {
  return (
    <div className="about-page">
      {/* Hero Section */}
      <section className="about-hero">
        <div className="about-hero-content">
          <div className="about-hero-text">
            <h1>About Me</h1>
            <p className="about-subtitle">
              Computer Science Student | Web Developer | Problem Solver
            </p>
            <p className="about-description">
              Passionate about creating digital solutions and continuously learning
              new technologies to build amazing user experiences.
            </p>
          </div>
          <div className="about-hero-image">
            <img src="/assets/profile.jpg" alt="Profile" />
          </div>
        </div>
      </section>

      {/* Main Content */}
      <div className="about-content">
        {/* About Section */}
        <section className="about-section">
          <div className="about-card">
            <h2>Who I Am</h2>
            <p>
              I am a Computer Science student who is deeply interested in technology,
              problem-solving, and continuous learning. My journey in tech started with
              curiosity and has evolved into a passion for creating meaningful digital experiences.
            </p>
            <div className="about-image-container">
              <img src="/assets/workspace.jpg" alt="My workspace" />
            </div>
          </div>
        </section>

        {/* Background Section */}
        <section className="about-section">
          <div className="about-card">
            <h2>My Background & Journey</h2>
            <p>
              As a student, I have developed strong interests in programming,
              web technologies, and system design. Every day is an opportunity
              to learn something new and improve my skills.
            </p>

            <div className="timeline">
              <div className="timeline-item">
                <div className="timeline-marker"></div>
                <div className="timeline-content">
                  <h3>Began studying Computer Science</h3>
                  <p>Started my journey into the world of programming and technology</p>
                </div>
              </div>

              <div className="timeline-item">
                <div className="timeline-marker"></div>
                <div className="timeline-content">
                  <h3>Learned basic programming concepts</h3>
                  <p>Mastered fundamentals of algorithms, data structures, and logic</p>
                </div>
              </div>

              <div className="timeline-item">
                <div className="timeline-marker"></div>
                <div className="timeline-content">
                  <h3>Explored web development fundamentals</h3>
                  <p>Dived into HTML, CSS, JavaScript, and modern frameworks</p>
                </div>
              </div>

              <div className="timeline-item">
                <div className="timeline-marker"></div>
                <div className="timeline-content">
                  <h3>Worked on academic and personal projects</h3>
                  <p>Built real-world applications and learned through hands-on experience</p>
                </div>
              </div>

              <div className="timeline-item">
                <div className="timeline-marker"></div>
                <div className="timeline-content">
                  <h3>Continuing to improve technical skills</h3>
                  <p>Always learning new technologies and best practices</p>
                </div>
              </div>
            </div>

            <div className="about-image-container">
              <img src="/assets/working.jpg" alt="Working on projects" />
            </div>
          </div>
        </section>

        {/* Skills/Interests Section */}
        <section className="about-section">
          <div className="skills-grid">
            <div className="skill-card">
              <h3>🚀 Web Development</h3>
              <p>Building responsive and interactive web applications</p>
            </div>
            <div className="skill-card">
              <h3>💻 Programming</h3>
              <p>Writing clean, efficient, and maintainable code</p>
            </div>
            <div className="skill-card">
              <h3>🎯 Problem Solving</h3>
              <p>Finding creative solutions to complex challenges</p>
            </div>
            <div className="skill-card">
              <h3>📚 Continuous Learning</h3>
              <p>Always exploring new technologies and frameworks</p>
            </div>
          </div>
        </section>
      </div>

      {/* Interactive Sections */}
      <QuotesSection />
      <GuessNumber />
    </div>
  );
}

export default About;