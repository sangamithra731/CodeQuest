import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import RabbitMascot from "../../components/common/RabbitMascot";
import NightSky from "../../components/common/NightSky";
import { API_BASE_URL } from "../../utils/config";
import api from "../../services/api";

function Signup() {
  const navigate = useNavigate();
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const filled = [name.trim().length > 0, email.trim().length > 0, password.length > 0];
  const filledCount = filled.filter(Boolean).length;

  const handleOAuth = (provider) => {
    window.location.href = `${API_BASE_URL}/auth/${provider}`;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    setLoading(true);
    try {
      const res = await api.post("/api/auth/signup", { name, email, password });
      localStorage.setItem("cq_access_token", res.data.accessToken);
      localStorage.setItem("cq_user", JSON.stringify(res.data.user));
      navigate("/onboarding");
    } catch (err) {
      setError(err.response?.data?.error || err.response?.data?.message || "Couldn't create your account. Try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="auth-page">
      <NightSky />

      <div className="mascot-row">
        <RabbitMascot size={6} />
        <div className="speech-bubble">Create an account to save your progress :)</div>
      </div>

      <div className="auth-card">
        <h1 className="auth-title pixel-font">Start your quest</h1>
        <p className="auth-subtitle">Join Rural CodeLearn for free</p>

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
            <label htmlFor="name">Name</label>
            <div className="field-input-wrap">
              <input
                id="name"
                type="text"
                placeholder="Your name"
                value={name}
                onChange={(e) => setName(e.target.value)}
              />
            </div>
          </div>

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
          <p className="xp-label">Signup quest — {filledCount}/3 complete</p>

          {error && <p className="form-error">{error}</p>}

          <button type="submit" className="btn-primary green" disabled={loading}>
            {loading ? "Creating account…" : "Create account"}
          </button>
        </form>

        <p className="terms-note">
          By signing up, you agree to Rural CodeLearn's <a href="#">Terms</a>.
        </p>

        <p className="auth-footer">
  Already have an account? <Link to="/login">Log in</Link>
</p>
      </div>
    </div>
  );
}

export default Signup;