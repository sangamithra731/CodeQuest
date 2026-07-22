import { useState } from "react";
import { useNavigate } from "react-router-dom";
import NightSky from "../../components/common/NightSky";

const AVATARS = ["🐰", "🦊", "🐱", "🐧", "🦉", "🤖"];

const LEVELS = [
  { id: "beginner", icon: "🌱", title: "Beginner", desc: "New to coding" },
  { id: "intermediate", icon: "🌿", title: "Intermediate", desc: "Know the basics" },
  { id: "advanced", icon: "🌳", title: "Advanced", desc: "Comfortable building" },
];

const PATHS = [
  { id: "fundamentals", icon: "🧩", title: "Programming Fundamentals", desc: "Variables, loops, logic" },
  { id: "web", icon: "🌐", title: "Web Development", desc: "HTML, CSS, JavaScript" },
  { id: "dsa", icon: "🧠", title: "Data Structures & Algorithms", desc: "Problem solving" },
  { id: "mobile", icon: "📱", title: "Mobile Apps", desc: "Build for Android & iOS" },
  { id: "data", icon: "📊", title: "Data Science", desc: "Analysis with Python" },
  { id: "games", icon: "🎮", title: "Game Development", desc: "Build small games" },
];

const STEPS = ["Avatar", "Username", "Level", "Path"];

function Onboarding() {
  const navigate = useNavigate();
  const [step, setStep] = useState(0);
  const [avatar, setAvatar] = useState("");
  const [username, setUsername] = useState("");
  const [level, setLevel] = useState("");
  const [path, setPath] = useState("");

  const canContinue =
    (step === 0 && avatar !== "") ||
    (step === 1 && username.trim().length >= 3) ||
    (step === 2 && level !== "") ||
    (step === 3 && path !== "");

  const goNext = () => {
    if (step < STEPS.length - 1) {
      setStep(step + 1);
      return;
    }
    const profile = { avatar, username: username.trim(), level, path };
    // TODO: replace with a real call to your Express backend, e.g.
    // axios.post(`${API_BASE_URL}/api/profile`, profile)
    localStorage.setItem("rcl_profile", JSON.stringify(profile));
    navigate("/dashboard");
  };

  const goBack = () => {
    if (step > 0) setStep(step - 1);
  };

  return (
    <div className="onboard-page">
      <NightSky />

      <div className="onboard-card">
        <div className="step-dots">
          {STEPS.map((_, i) => (
            <div
              key={i}
              className={`step-dot ${i === step ? "active" : ""} ${i < step ? "done" : ""}`}
            />
          ))}
        </div>

        {step === 0 && (
          <>
            <h2 className="onboard-heading">Pick your avatar</h2>
            <p className="onboard-subheading">You can change this later in settings</p>
            <div className="avatar-grid">
              {AVATARS.map((a) => (
                <button
                  key={a}
                  type="button"
                  className={`avatar-option ${avatar === a ? "selected" : ""}`}
                  onClick={() => setAvatar(a)}
                >
                  {a}
                </button>
              ))}
            </div>
          </>
        )}

        {step === 1 && (
          <>
            <h2 className="onboard-heading">Choose a username</h2>
            <p className="onboard-subheading">This is how other learners will see you</p>
            <div className="field">
              <div className="field-input-wrap">
                <input
                  type="text"
                  placeholder="e.g. codebreaker99"
                  value={username}
                  onChange={(e) => setUsername(e.target.value)}
                  maxLength={20}
                />
              </div>
            </div>
            <p className="xp-label" style={{ marginTop: 4 }}>
              {username.trim().length < 3
                ? "At least 3 characters"
                : `Nice, "${username.trim()}" it is`}
            </p>
          </>
        )}

        {step === 2 && (
          <>
            <h2 className="onboard-heading">What's your level?</h2>
            <p className="onboard-subheading">We'll tailor lessons to match</p>
            <div className="level-grid">
              {LEVELS.map((l) => (
                <button
                  key={l.id}
                  type="button"
                  className={`option-card ${level === l.id ? "selected" : ""}`}
                  onClick={() => setLevel(l.id)}
                >
                  <span className="option-icon">{l.icon}</span>
                  <span className="option-title">{l.title}</span>
                  <span className="option-desc">{l.desc}</span>
                </button>
              ))}
            </div>
          </>
        )}

        {step === 3 && (
          <>
            <h2 className="onboard-heading">Pick a learning path</h2>
            <p className="onboard-subheading">You can explore others anytime</p>
            <div className="path-grid">
              {PATHS.map((p) => (
                <button
                  key={p.id}
                  type="button"
                  className={`option-card ${path === p.id ? "selected" : ""}`}
                  onClick={() => setPath(p.id)}
                >
                  <span className="option-icon">{p.icon}</span>
                  <span className="option-title">{p.title}</span>
                  <span className="option-desc">{p.desc}</span>
                </button>
              ))}
            </div>
          </>
        )}

        <div className="wizard-nav">
          {step > 0 ? (
            <button type="button" className="btn-ghost" onClick={goBack}>
              Back
            </button>
          ) : (
            <span />
          )}
          <button
            type="button"
            className="btn-primary"
            disabled={!canContinue}
            onClick={goNext}
          >
            {step === STEPS.length - 1 ? "Finish" : "Continue"}
          </button>
        </div>
      </div>
    </div>
  );
}

export default Onboarding;