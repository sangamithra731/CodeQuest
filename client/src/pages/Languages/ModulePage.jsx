import { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { getModule, getLanguageProgress } from "../../services/api";
import { usePyodide } from "../../hooks/usePyodide";
import { submitLevel } from "../../services/progressService";
import "./ModulePage.css";

export default function ModulePage() {
  const { languageId, moduleSlug } = useParams();
  const navigate = useNavigate();
  const [module, setModule] = useState(null);
  const [code, setCode] = useState({});
  const [output, setOutput] = useState({});
  const [activeIndex, setActiveIndex] = useState(0);
  const { pyodide, loading: pyodideLoading } = usePyodide();

  useEffect(() => {
    getModule(languageId, moduleSlug)
      .then((data) => {
        console.log("MODULE DATA:", data);
        setModule(data);
        const initial = {};
        data.levels.forEach((level) =>
          level.practice.forEach((p, i) => {
            initial[`${level.id}-${i}`] = p.starterCode;
          })
        );
        setCode(initial);
        setActiveIndex(0); // reset to first question whenever module changes
      })
      .catch(console.error);
  }, [languageId, moduleSlug]);

  if (!module) {
    return <h2 className="loading">Loading...</h2>;
  }

  // Flatten every level's practice items into one ordered sequence
  const flatPractices = module.levels.flatMap((level) =>
    (level.practice || []).map((practice, i) => ({
      level,
      practice,
      key: `${level.id}-${i}`,
    }))
  );

  if (flatPractices.length === 0) {
    return (
      <h2 className="loading">
        No practice exercises found for this module. Check the console log
        above ("MODULE DATA") to see what was returned.
      </h2>
    );
  }

  const safeIndex = Math.min(activeIndex, flatPractices.length - 1);
  const current = flatPractices[safeIndex];
  const { level, practice, key } = current;

  const normalize = (s) => (s || "").replace(/\r\n/g, "\n").trim();

  const handleRun = async (key) => {
    if (!pyodide) {
      setOutput((prev) => ({ ...prev, [key]: "Python is still loading..." }));
      return;
    }
    setOutput((prev) => ({ ...prev, [key]: "" }));
    pyodide.setStdout({
      batched: (msg) =>
        setOutput((prev) => ({
          ...prev,
          [key]: (prev[key] || "") + msg + "\n",
        })),
    });
    try {
      await pyodide.runPythonAsync(code[key]);
    } catch (err) {
      setOutput((prev) => ({ ...prev, [key]: String(err) }));
    }
  };

  const handleSubmit = async (key, level, practice) => {
    if (!output[key]) {
      alert("Click Run first to see your output before submitting.");
      return;
    }

    const result = normalize(output[key]);
    const expected = normalize(practice.expectedOutput);
    const passed = expected.length > 0 && result === expected;

    try {
      await submitLevel(level.id, { code: code[key], passed });
    } catch (err) {
      console.error("Submit failed:", err);
    }

    if (passed) {
      alert("✅ Correct!");

      const isLastQuestion = safeIndex === flatPractices.length - 1;

      if (isLastQuestion) {
        const currentModuleNum = parseInt(moduleSlug.split("-")[1], 10);
const TOTAL_MODULES = 20;

if (currentModuleNum >= TOTAL_MODULES) {
  try {
    const language = await getLanguageProgress(languageId);

    console.log("LANGUAGE:", language);

    const examModule = language.modules.find(
      (m) => m.slug === "final-exam"
    );

    if (!examModule) {
      alert("Final Exam module not found.");
      return navigate(`/languages/${languageId}`);
    }

    if (!examModule.levels || examModule.levels.length === 0) {
      alert("Final Exam has no level.");
      return navigate(`/languages/${languageId}`);
    }

    navigate(
      `/languages/${languageId}/exam/${examModule.levels[0].id}`,
      { replace: true }
    );
  } catch (err) {
    console.error(err);
    navigate(`/languages/${languageId}`);
  }
} else {
  navigate(`/languages/${languageId}/modules/module-${currentModuleNum + 1}`);
}
      } else {
        setActiveIndex((prev) => Math.min(prev + 1, flatPractices.length - 1));
      }

      try {
        const updated = await getModule(languageId, moduleSlug);
        setModule(updated);
      } catch (err) {
        console.error("Refetch failed:", err);
      }
    } else {
      alert(
        `❌ Not quite.\n\nExpected:\n${practice.expectedOutput}\n\nYour output:\n${output[key]}`
      );
    }
  };

  const goPrev = () => setActiveIndex((prev) => Math.max(prev - 1, 0));
  const goNext = () =>
    setActiveIndex((prev) => Math.min(prev + 1, flatPractices.length - 1));

  return (
    <div className="ide-shell">
      {/* top bar */}
      <div className="ide-topbar">
        <div className="ide-brand">
          <span className="brand-dot">●</span> CodeQuest
          <span className="crumb">
            {" "}
            / {module.language ?? "Python"} / {module.title}
          </span>
        </div>
        <div className="ide-progress">
          <div className="progress-track">
            <div
              className="progress-fill"
              style={{
                width: `${Math.round(
                  ((safeIndex + 1) / flatPractices.length) * 100
                )}%`,
              }}
            />
          </div>
          <span>
            {safeIndex + 1} / {flatPractices.length}
          </span>
        </div>
      </div>

      <div className="ide-body">
        {/* LEFT: lesson panel — only current level shown */}
        <div className="lesson-panel">
          <div className="lesson-scroll">
            <h1 className="lesson-title">{module.title}</h1>

            <div className="lesson-block">
              <span className="lang-pill"># Python</span>

              <section className="section">
                <h3>📖 Theory</h3>
                <p>{level.theory}</p>
              </section>

              <section className="section">
                <h3>💻 Examples</h3>
                {(level.examples || []).map((example, index) => (
                  <div className="example-card" key={index}>
                    <pre>
                      <code>{example.code}</code>
                    </pre>
                    <p>{example.explanation}</p>
                  </div>
                ))}
              </section>

              <section className="section instructions">
                <h3>Instructions</h3>
                <div className="practice-instruction">
                  <p>{practice.prompt}</p>
                </div>
              </section>

              {level.hint && (
                <details className="hint-block">
                  <summary>💡 Hint</summary>
                  <p>{level.hint}</p>
                </details>
              )}
            </div>

            <div className="nav-buttons">
              <button
                className="nav-btn"
                onClick={goPrev}
                disabled={safeIndex === 0}
              >
                ← Previous
              </button>
              <button
                className="nav-btn"
                onClick={goNext}
                disabled={safeIndex === flatPractices.length - 1}
              >
                Next →
              </button>
            </div>
          </div>
        </div>

        {/* RIGHT: editor panel — only current practice shown */}
        <div className="editor-panel">
          <div className="editor-block">
            <div className="editor-tabbar">
              <div className="tab active">
                <span className="tab-dot">🐍</span> script.py
              </div>
            </div>

            <textarea
              className="code-area"
              spellCheck="false"
              value={code[key] ?? practice.starterCode}
              onChange={(e) =>
                setCode((prev) => ({ ...prev, [key]: e.target.value }))
              }
            />

            <div className="editor-actions">
              <div className="editor-icons">
                <button className="icon-btn" title="Copy">⧉</button>
                <button
                  className="icon-btn"
                  title="Reset"
                  onClick={() =>
                    setCode((prev) => ({
                      ...prev,
                      [key]: practice.starterCode,
                    }))
                  }
                >
                  ⟲
                </button>
                <button className="icon-btn" title="Help">?</button>
              </div>
              <div className="action-buttons">
                <button
                  className="run-btn"
                  onClick={() => handleRun(key)}
                  disabled={pyodideLoading}
                >
                  {pyodideLoading ? "Loading Python..." : "▶ Run"}
                </button>
                <button
                  className="submit-btn"
                  onClick={() => handleSubmit(key, level, practice)}
                >
                  Submit answer
                </button>
              </div>
            </div>

            <div className="terminal">
              <div className="terminal-header">Terminal</div>
              <div className="terminal-body">
                {output[key] ? (
                  <pre>{output[key]}</pre>
                ) : (
                  <div className="terminal-placeholder">
                    <span className="term-icon">{"<>"}</span>
                    <p>Click Run to view your results</p>
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}