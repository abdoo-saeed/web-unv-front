import { useState } from "react";

function SendMessagePage() {
  const [form, setForm] = useState({
    to: "",
    body: "",
  });

  const [loading, setLoading] = useState(false);
  const [msg, setMsg] = useState(null);
  const [error, setError] = useState(null);

  const handleChange = (e) => {
    setForm({
      ...form,
      [e.target.name]: e.target.value,
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    setLoading(true);
    setError(null);
    setMsg(null);

    try {
      const res = await fetch("http://localhost:3000/message/send-message", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(form),
      });

      const data = await res.json();

      if (!res.ok) {
        throw new Error(data?.message || "Failed to send message");
      }

      setMsg("Message sent successfully ✅");
      setForm({ to: "", body: "" });
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <section className="page hero-page">
      <p className="eyebrow">Anonymous Message</p>
      <h1>Send a Message</h1>
      <p className="subtitle">
        Send a completely anonymous message to any user on Saraha App.
      </p>

      {/* FORM CARD (same style as feature cards) */}
      <div className="feature-grid" style={{ maxWidth: "600px", margin: "0 auto" }}>
        <form className="card" onSubmit={handleSubmit}>
          <h3>New Message</h3>

          <input
            type="email"
            name="to"
            placeholder="Recipient Email"
            value={form.to}
            onChange={handleChange}
            required
            className="input"
          />

          <textarea
            name="body"
            placeholder="Write your message..."
            value={form.body}
            onChange={handleChange}
            required
            className="input"
            rows="4"
          />

          <button className="btn btn-primary" disabled={loading}>
            {loading ? "Sending..." : "Send Message"}
          </button>

          {msg && <p style={{ color: "green" }}>{msg}</p>}
          {error && <p style={{ color: "red" }}>{error}</p>}
        </form>
      </div>
    </section>
  );
}

export default SendMessagePage;