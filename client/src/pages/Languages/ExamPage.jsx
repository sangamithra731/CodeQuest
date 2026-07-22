import { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { api } from "../../services/api";
import { generateCertificate } from "../../utils/certificateGenerator";
import "./ExamPage.css";

export default function ExamPage() {
  const { languageId, levelId } = useParams();
  const navigate = useNavigate();

  const [exam, setExam] = useState(null);
  const [answers, setAnswers] = useState({}); // { [questionId]: selectedIndex }
  const [activeIndex, setActiveIndex] = useState(0);
  const [result, setResult] = useState(null);
  const [submitting, setSubmitting] = useState(false);

  useEffect(() => {
    api
      .get(`/api/progress/levels/${levelId}/exam`)
      .then((res) => setExam(res.data.exam))
      .catch(console.error);
  }, [levelId]);

  if (!exam) {
    return <h2 className="loading">Loading exam...</h2>;
  }

  const questions = exam.questions;
  const currentQuestion = questions[activeIndex];
  const answeredCount = Object.keys(answers).length;
  const allAnswered = answeredCount === questions.length;

  const selectAnswer = (questionId, optionIndex) => {
    setAnswers((prev) => ({ ...prev, [questionId]: optionIndex }));
  };

  const goPrev = () => setActiveIndex((i) => Math.max(i - 1, 0));
  const goNext = () => setActiveIndex((i) => Math.min(i + 1, questions.length - 1));

  const handleSubmit = async () => {
    if (!allAnswered) {
      const confirmSubmit = window.confirm(
        `You've answered ${answeredCount} of ${questions.length} questions. Submit anyway?`
      );
      if (!confirmSubmit) return;
    }

    setSubmitting(true);
    try {
      const res = await api.post(`/api/progress/levels/${levelId}/exam/submit`, {
        answers,
      });
      setResult(res.data.result);
    } catch (err) {
      console.error("Exam submit failed:", err);
      alert("Something went wrong submitting your exam. Please try again.");
    } finally {
      setSubmitting(false);
    }
  };

  const handleDownloadCertificate = () => {
    const storedUser = JSON.parse(localStorage.getItem("cq_user") || "{}");
    const studentName = storedUser.name || "Student";
    const courseName = exam.title.replace(" — Certification Exam", "");
    const dateStr = new Date().toLocaleDateString("en-US", {
      year: "numeric",
      month: "long",
      day: "numeric",
    });

    generateCertificate({ studentName, courseName, dateStr });
  };

  // ---- Result screen ----
  if (result) {
    const passed = result.passed;
    return (
      <div className="exam-shell">
        <div className={`exam-result ${passed ? "passed" : "failed"}`}>
          <h1>{passed ? "🎉 You passed!" : "Not quite there yet"}</h1>
          <p className="exam-score">
            {result.correctCount} / {result.totalQuestions} correct (
            {result.scorePercent}%)
          </p>
          {passed ? (
            <>
              <p>You've earned your certificate for this track.</p>
              {result.certificateIssued && (
                <p className="exam-cert-note">
                  Certificate for {result.certificateIssued.languageName} issued!
                </p>
              )}
              <button className="exam-btn" onClick={handleDownloadCertificate}>
                Download Certificate
              </button>
            </>
          ) : (
            <p>You need 80% (20/25) to pass. Review the material and try again.</p>
          )}
          <button
            className="exam-btn"
            onClick={() => navigate(`/languages/${languageId}`)}
          >
            Back to course overview
          </button>
        </div>
      </div>
    );
  }

  // ---- Question screen ----
  return (
    <div className="exam-shell">
      <div className="exam-topbar">
        <h1>{exam.title}</h1>
        <span className="exam-progress-label">
          Question {activeIndex + 1} / {questions.length} — {answeredCount} answered
        </span>
      </div>

      <div className="exam-progress-track">
        <div
          className="exam-progress-fill"
          style={{ width: `${((activeIndex + 1) / questions.length) * 100}%` }}
        />
      </div>

      <div className="exam-question-card">
        <h2>{currentQuestion.question}</h2>
        <div className="exam-options">
          {currentQuestion.options.map((opt, i) => (
            <button
              key={i}
              className={`exam-option ${
                answers[currentQuestion.id] === i ? "selected" : ""
              }`}
              onClick={() => selectAnswer(currentQuestion.id, i)}
            >
              {opt}
            </button>
          ))}
        </div>
      </div>

      <div className="exam-nav">
        <button className="exam-nav-btn" onClick={goPrev} disabled={activeIndex === 0}>
          ← Previous
        </button>

        {activeIndex === questions.length - 1 ? (
          <button className="exam-submit-btn" onClick={handleSubmit} disabled={submitting}>
            {submitting ? "Submitting..." : "Submit Exam"}
          </button>
        ) : (
          <button className="exam-nav-btn" onClick={goNext}>
            Next →
          </button>
        )}
      </div>

      <div className="exam-jumplist">
        {questions.map((q, i) => (
          <button
            key={q.id}
            className={`exam-jump-dot ${i === activeIndex ? "active" : ""} ${
              answers[q.id] !== undefined ? "answered" : ""
            }`}
            onClick={() => setActiveIndex(i)}
          >
            {i + 1}
          </button>
        ))}
      </div>
    </div>
  );
}