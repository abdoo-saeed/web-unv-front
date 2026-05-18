import { useEffect, useState } from "react";

const MESSAGES_URL = "http://localhost:3000/message/my-messages";
const REFRESH_URL = "http://localhost:3000/auth/refresh-Token";

function GetMessagePage() {
  const [messages, setMessages] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const loadMessages = async () => {
      const refreshToken = localStorage.getItem("refreshToken");
      let accessToken = localStorage.getItem("accessToken");

      const refreshAccessToken = async () => {
        if (!refreshToken) return null;

        const res = await fetch(REFRESH_URL, {
          method: "POST",
          headers: { Authorization: refreshToken },
        });

        const data = await res.json();

        if (!res.ok || !data?.data?.accessToken) return null;

        localStorage.setItem("accessToken", data.data.accessToken);
        return data.data.accessToken;
      };

      try {
        if (!accessToken && refreshToken) {
          accessToken = await refreshAccessToken();
        }

        if (!accessToken) throw new Error("Unauthorized");

        let res = await fetch(MESSAGES_URL, {
          method: "GET",
          headers: {
            Authorization: `Bearer ${accessToken}`,
          },
        });

        // 🔥 handle expired token
        if ((res.status === 401 || res.status === 403) && refreshToken) {
          const newToken = await refreshAccessToken();

          if (!newToken) throw new Error("Session expired");

          res = await fetch(MESSAGES_URL, {
            method: "GET",
            headers: {
              Authorization: `Bearer ${newToken}`,
            },
          });
        }

        const data = await res.json();

        if (!res.ok) {
          throw new Error(data?.errMsg || "Failed to load messages");
        }

        setMessages(data?.data?.data || []);
      } catch (err) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };

    loadMessages();
  }, []);

  return (
    <section className="page hero-page">
      <p className="eyebrow">Inbox</p>
      <h1>Your Messages</h1>
      <p className="subtitle">
        Here are the anonymous messages you’ve received.
      </p>

      {/* STATES */}
      {loading && <p>Loading messages...</p>}
      {error && <p style={{ color: "red" }}>{error}</p>}

      {/* EMPTY */}
      {!loading && messages.length === 0 && (
        <p>No messages yet 👀</p>
      )}

      {/* MESSAGES GRID (same style as Home cards) */}
      <div className="feature-grid">
        {messages.map((msg) => (
          <article key={msg._id} className="card">
            <p>{msg.body}</p>

            <small style={{ opacity: 0.6 }}>
              {new Date(msg.createdAt).toLocaleString()}
            </small>
          </article>
        ))}
      </div>
    </section>
  );
}

export default GetMessagePage;