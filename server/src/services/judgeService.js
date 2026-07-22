// server/src/services/judgeService.js
const axios = require("axios");

const CODERUNNER_URL = "https://agent-gateway-kappa.vercel.app/v1/agent-coderunner/api/execute";

const LANGUAGE_CONFIG = {
  javascript: "javascript",
  typescript: "typescript",
  python: "python",
  python3: "python",
  bash: "bash",
};

async function runSingle({ language, code, stdin }) {
  const lang = LANGUAGE_CONFIG[language];
  if (!lang) throw new Error(`Unsupported language: ${language}. This judge only supports javascript, typescript, python, bash.`);

  const res = await axios.post(CODERUNNER_URL, {
    code,
    language: lang,
    stdin: stdin || "",
  });

  const { stdout, stderr } = res.data;

  const cleanStdout = (stdout || "").trim();
  const cleanStderr = (stderr || "").trim();

  return {
    stdout: cleanStdout,
    stderr: cleanStderr,
    statusDescription: cleanStderr ? "Runtime Error" : "Accepted",
    timeMs: null,
  };
}

async function runAgainstTestCases({ language, code, testCases }) {
  const results = [];
  let allPassed = true;

  for (const tc of testCases) {
    const run = await runSingle({ language, code, stdin: tc.input });
    const passed = run.stdout === tc.expected.trim() && !run.stderr;
    if (!passed) allPassed = false;

    results.push({
      testCaseId: tc.id,
      input: tc.isHidden ? undefined : tc.input,
      expected: tc.isHidden ? undefined : tc.expected,
      actual: tc.isHidden ? undefined : run.stdout,
      passed,
      isHidden: tc.isHidden,
      error: run.stderr || undefined,
      statusDescription: run.statusDescription,
    });
  }

  const passedCount = results.filter((r) => r.passed).length;
  let overallStatus = "Accepted";
  if (!allPassed) {
    const hasError = results.some((r) => r.error);
    overallStatus = hasError ? "Runtime Error" : "Wrong Answer";
  }

  return {
    status: overallStatus,
    passedCount,
    totalCount: testCases.length,
    runtimeMs: null,
    results,
  };
}

module.exports = { runSingle, runAgainstTestCases, LANGUAGE_CONFIG };