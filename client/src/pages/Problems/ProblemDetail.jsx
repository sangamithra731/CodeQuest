import { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { api } from '../../services/api';
import './Problems.css';

const LANGUAGE_TEMPLATES = {
  javascript: '// Write your solution here\nfunction solution() {\n  // Your code here\n  \n}',
  python: '# Write your solution here\ndef solution():\n    # Your code here\n    pass',
  java: 'public class Solution {\n    public static void main(String[] args) {\n        // Your code here\n    }\n}',
  cpp: '#include <iostream>\nusing namespace std;\n\nint main() {\n    // Your code here\n    return 0;\n}'
};

function getYouTubeEmbedUrl(url) {
  if (!url) return null;
  
  let videoId = null;
  
  // Format: https://www.youtube.com/watch?v=VIDEO_ID
  let match = url.match(/(?:youtube\.com\/watch\?v=|youtu\.be\/)([\w-]{11})/);
  if (match) {
    videoId = match[1];
  }
  
  // Format: https://youtu.be/VIDEO_ID
  match = url.match(/youtu\.be\/([\w-]{11})/);
  if (match) {
    videoId = match[1];
  }
  
  // Format: https://www.youtube.com/embed/VIDEO_ID
  match = url.match(/youtube\.com\/embed\/([\w-]{11})/);
  if (match) {
    videoId = match[1];
  }
  
  // Format: https://www.youtube.com/shorts/VIDEO_ID
  match = url.match(/youtube\.com\/shorts\/([\w-]{11})/);
  if (match) {
    videoId = match[1];
  }
  
  if (!videoId) return null;
  
  const params = new URLSearchParams({
    autoplay: '0',
    rel: '0',
    modestbranding: '1',
    cc_lang_pref: 'en',
    cc_load_policy: '1',
    hl: 'en',
    iv_load_policy: '3',
    fs: '1',
    origin: window.location.origin
  });
  
  return `https://www.youtube.com/embed/${videoId}?${params.toString()}`;
}

export function ProblemDetail() {
  const { platform, slug } = useParams();
  const navigate = useNavigate();
  const [problem, setProblem] = useState(null);
  const [completed, setCompleted] = useState(false);
  const [marking, setMarking] = useState(false);
  const [code, setCode] = useState('');
  const [language, setLanguage] = useState('javascript');
  const [result, setResult] = useState(null);
  const [running, setRunning] = useState(false);
  const [activeTab, setActiveTab] = useState('description');
  const [videoError, setVideoError] = useState(false);

  useEffect(() => {
    api.get(`/api/problems/${slug}`)
      .then((res) => {
        setProblem(res.data.problem);
        setCode(res.data.problem.template || LANGUAGE_TEMPLATES[language]);
        setVideoError(false);
      })
      .catch(() => setVideoError(true));
      
    api.get('/api/problems/completions')
      .then((res) => setCompleted(res.data.completed.includes(problem?.id)))
      .catch(() => {});
  }, [slug, language, problem?.id]);

  const handleMarkCompleted = async () => {
    setMarking(true);
    try {
      await api.post(`/api/problems/${slug}/complete`);
      setCompleted(true);
    } catch {
      alert('Could not mark as completed. Please make sure you are logged in.');
    } finally {
      setMarking(false);
    }
  };

  const handleRunCode = async () => {
    setRunning(true);
    setResult(null);
    try {
      const response = await api.post(`/api/problems/${slug}/run`, {
        code,
        language
      });
      setResult(response.data);
    } catch (error) {
      setResult({
        status: 'error',
        message: error.response?.data?.message || 'Failed to run code'
      });
    } finally {
      setRunning(false);
    }
  };

  const handleLanguageChange = (e) => {
    const newLanguage = e.target.value;
    setLanguage(newLanguage);
    setCode(LANGUAGE_TEMPLATES[newLanguage] || '');
  };

  if (!problem) {
    return (
      <div className="problem-loading-container">
        <div className="spinner"></div>
        <p>Loading problem…</p>
      </div>
    );
  }

  const embedUrl = getYouTubeEmbedUrl(problem.videoUrl);

  return (
    <div className="problem-detail-page">
      <div className="problem-panel">
        <div className="problem-header">
          <button className="back-btn" onClick={() => navigate(`/problems/${platform}`)}>
            ← Back to problems
          </button>
          <h1>{problem.title}</h1>
          <div className="problem-meta">
            <span className={`diff-tag diff-${problem.difficulty.toLowerCase()}`}>
              {problem.difficulty}
            </span>
            <span className="problem-topic">{problem.topic}</span>
            {problem.videoUrl && (
              <span className="video-badge">🎬 Video Available</span>
            )}
          </div>
        </div>

        <div className="problem-tabs">
          <button 
            className={`tab-btn ${activeTab === 'description' ? 'active' : ''}`}
            onClick={() => setActiveTab('description')}
          >
            📝 Description
          </button>
          <button 
            className={`tab-btn ${activeTab === 'video' ? 'active' : ''}`}
            onClick={() => setActiveTab('video')}
          >
            🎬 Video Solution
          </button>
          <button 
            className={`tab-btn ${activeTab === 'submissions' ? 'active' : ''}`}
            onClick={() => setActiveTab('submissions')}
          >
            📊 Submissions
          </button>
        </div>

        <div className="problem-content">
          {activeTab === 'description' && (
            <>
              <p className="problem-description">{problem.description}</p>
              
              {problem.examples && problem.examples.length > 0 && (
                <div className="problem-examples">
                  <h4>Examples:</h4>
                  {problem.examples.map((example, idx) => (
                    <div key={idx} className="problem-example">
                      <p><strong>Input:</strong> {example.input}</p>
                      <p><strong>Output:</strong> {example.output}</p>
                      {example.explanation && (
                        <p><strong>Explanation:</strong> {example.explanation}</p>
                      )}
                    </div>
                  ))}
                </div>
              )}

              {problem.constraints && (
                <div className="problem-constraints">
                  <h4>Constraints:</h4>
                  <ul>
                    {problem.constraints.map((constraint, idx) => (
                      <li key={idx}>{constraint}</li>
                    ))}
                  </ul>
                </div>
              )}
            </>
          )}

          {activeTab === 'video' && (
            <div className="problem-video-section">
              {embedUrl && !videoError ? (
                <div className="video-container">
                  <iframe
                    src={embedUrl}
                    title="Problem Solution Video - English"
                    width="100%"
                    height="450"
                    allowFullScreen
                    allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                    frameBorder="0"
                    className="video-iframe"
                    onError={() => setVideoError(true)}
                  />
                  <div className="video-controls">
                    <div className="video-info">
                      <span className="video-language">🇬🇧 English</span>
                      <span className="video-captions">CC Available</span>
                      <button 
                        className="video-fullscreen-btn"
                        onClick={() => {
                          const iframe = document.querySelector('.video-iframe');
                          if (iframe && iframe.requestFullscreen) {
                            iframe.requestFullscreen();
                          }
                        }}
                      >
                        ⛶ Fullscreen
                      </button>
                    </div>
                    <div className="video-notes">
                      <p>💡 <strong>Tip:</strong> Use the CC button to enable English captions/subtitles</p>
                    </div>
                  </div>
                </div>
              ) : (
                <div className="video-placeholder">
                  <div className="video-placeholder-icon">🎬</div>
                  <h3>Video Solution Unavailable</h3>
                  <p>This problem doesn't have a video solution yet.</p>
                  <p className="video-suggestion">Check back later or try solving it on your own!</p>
                </div>
              )}
            </div>
          )}

          {activeTab === 'submissions' && (
            <div className="problem-submissions">
              <p>Your submissions for this problem will appear here.</p>
            </div>
          )}
        </div>

        <div className="problem-actions">
          {problem.leetcodeUrl && (
            <a 
              href={problem.leetcodeUrl} 
              target="_blank" 
              rel="noopener noreferrer" 
              className="submit-btn"
            >
              Solve on LeetCode ↗
            </a>
          )}
          <button 
            onClick={handleMarkCompleted} 
            disabled={completed || marking}
            className={completed ? 'completed-btn' : 'mark-btn'}
          >
            {completed ? '✅ Completed' : marking ? 'Marking…' : 'Mark as Completed'}
          </button>
        </div>
      </div>

      <div className="editor-panel">
        <div className="editor-toolbar">
          <select 
            value={language} 
            onChange={handleLanguageChange}
            className="language-select"
          >
            <option value="javascript">JavaScript</option>
            <option value="python">Python</option>
            <option value="java">Java</option>
            <option value="cpp">C++</option>
          </select>
          <button 
            onClick={handleRunCode} 
            disabled={running}
            className="run-btn"
          >
            {running ? '⏳ Running…' : '▶ Run Code'}
          </button>
        </div>
        
        <textarea 
          className="code-editor"
          value={code}
          onChange={(e) => setCode(e.target.value)}
          spellCheck={false}
        />

        {result && (
          <div className="result-panel">
            <div className={`result-status status-${result.status}`}>
              {result.status === 'accepted' ? '✅ All tests passed!' :
               result.status === 'error' ? '❌ Error' :
               `❌ ${result.status}`}
            </div>
            {result.results && result.results.map((test, idx) => (
              <div key={idx} className={`test-case-result ${test.passed ? 'tc-pass' : 'tc-fail'}`}>
                <span>Test {idx + 1}: </span>
                <span>{test.passed ? '✅' : '❌'}</span>
                <span> {test.message}</span>
                {test.expected && (
                  <div className="test-details">
                    <span>Expected: {test.expected}</span>
                    <span>Got: {test.got}</span>
                  </div>
                )}
              </div>
            ))}
            {result.message && (
              <div className="test-error">{result.message}</div>
            )}
          </div>
        )}
      </div>
    </div>
  );
}