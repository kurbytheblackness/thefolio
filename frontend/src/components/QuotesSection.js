import React from "react";

function QuotesSection() {
  return (
    <section className="quotes-section">

      <div className="quote-card">
        <h3>Inspirational Quote</h3>
        <p>
          "Education is not preparation for life. Education is life itself"
          (John Dewey) and
          "Live as if you were to die tomorrow. Learn as if you were to live forever"
          (Mahatma Gandhi).
        </p>
      </div>

      <div className="quote-card">
        <h3>Funny Perspective on Coding</h3>
        <p>
          Experiencing code that runs correctly on the very first try is
          a rare and satisfying achievement.
        </p>
      </div>

    </section>
  );
}

export default QuotesSection;