import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import RabbitMascot from "../../components/common/RabbitMascot";
import NightSky from "../../components/common/NightSky";
import { API_BASE_URL } from "../../utils/config";
import api from "../../services/api";

function Login() {
  const navigate = useNavigate();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const filled = [email.trim().length > 0, password.length > 0];
  const filledCount = filled.filter(Boolean).length;

  // Sends the browser to your Express backend's OAuth route.
  // The backend (using e.g. Passport.js) then redirects to Google/GitHub,
  // and on success redirects back into the app with a session/token.
  const handleOAuth = (provider) => {
    window.location.href = `${API_BASE_URL}/auth/${provider}`;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    setLoading(true);
    try {
      const res = await api.post("/api/auth/login", { email, password });
      localStorage.setItem("cq_access_token", res.data.accessToken);
      localStorage.setItem("cq_user", JSON.stringify(res.data.user));
      navigate("/dashboard");
    } catch (err) {
      setError(err.response?.data?.error || err.response?.data?.message || "Couldn't log you in. Try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="auth-page">
      <NightSky />

      <div className="mascot-row">
        <RabbitMascot size={6} />
        <div className="speech-bubble">Welcome back! Ready to keep your streak going? :)</div>
      </div>

      <div className="auth-card">
        <h1 className="auth-title pixel-font">Rural CodeLearn</h1>
        <p className="auth-subtitle">Log in to continue learning</p>

        <div className="oauth-row">
          <button type="button" className="btn-oauth" onClick={() => handleOAuth("google")}>
            <span style={{ color: "#4285F4", fontWeight: 700 }}>G</span> Google
          </button>
          <button type="button" className="btn-oauth" onClick={() => handleOAuth("github")}>
            <span aria-hidden="true">🐙</span> GitHub
          </button>
        </div>

        <div className="divider">OR</div>

        <form onSubmit={handleSubmit}>
          <div className="field">
            <label htmlFor="email">Email</label>
            <div className="field-input-wrap">
              <input
                id="email"
                type="email"
                placeholder="you@example.com"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
              />
            </div>
          </div>

          <div className="field">
            <label htmlFor="password">Password</label>
            <div className="field-input-wrap">
              <input
                id="password"
                type={showPassword ? "text" : "password"}
                placeholder="••••••••"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
              />
              <button
                type="button"
                className="field-toggle"
                onClick={() => setShowPassword((v) => !v)}
              >
                {showPassword ? "hide" : "show"}
              </button>
            </div>
          </div>

          <div className="xp-track">
            {filled.map((isFilled, i) => (
              <div key={i} className={`xp-seg ${isFilled ? "filled" : ""}`} />
            ))}
          </div>
          <p className="xp-label">Login quest — {filledCount}/2 complete</p>

          {error && <p className="form-error">{error}</p>}

          <button type="submit" className="btn-primary" disabled={loading}>
            {loading ? "Logging in…" : "Log in"}
          </button>
        </form>

        <p className="auth-footer">
          New here? <Link to="/signup">Create an account</Link>
        </p>
      </div>
    </div>
  );
}

export default Login;