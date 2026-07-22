import { Routes, Route } from "react-router-dom";
import { PlacementList, PlacementDetail } from "./pages/Placement/Placement";
import Home from "./pages/Home/Home";
import Login from "./pages/Auth/Login";
import Signup from "./pages/Auth/Signup";
import Onboarding from "./pages/Onboarding/Onboarding";
import Dashboard from "./pages/Dashboard/Dashboard";
import Languages from "./pages/Languages/Languages";
import LanguageOverview from "./pages/Languages/LanguageOverview";
import ModulePage from "./pages/Languages/ModulePage";
import ExamPage from "./pages/Languages/ExamPage";
import GameArcade from './pages/GameArcade/GameArcade';
import EligibilityStatus from "./pages/Eligibility/EligibilityStatus";
import { PlatformPicker } from "./pages/Problems/PlatformPicker";
import { ProblemList } from "./pages/Problems/ProblemList";
import { ProblemDetail } from "./pages/Problems/ProblemDetail";
import { RequiresOnline } from "./components/RequiresOnline";
import Leaderboard from "./pages/Leaderboard/Leaderboard";
import Achievements from "./pages/Achievements/Achievements";
import Settings from "./pages/Settings/Settings";

export default function App() {
  return (
    <Routes>
      {/* Core */}
      <Route path="/" element={<Home />} />
      <Route path="/login" element={<Login />} />
      <Route path="/signup" element={<Signup />} />
      <Route path="/onboarding" element={<Onboarding />} />
      <Route path="/dashboard" element={<Dashboard />} />

      {/* Languages */}
      <Route path="/languages" element={<Languages />} />
      <Route path="/languages/:languageId" element={<LanguageOverview />} />
      <Route path="/languages/:languageId/modules/:moduleSlug" element={<ModulePage />} />
      <Route path="/languages/:languageId/exam/:levelId" element={<ExamPage />} />

      {/* Placement (requires online) */}
      <Route path="/placement" element={<RequiresOnline><PlacementList /></RequiresOnline>} />
      <Route path="/placement/:slug" element={<RequiresOnline><PlacementDetail /></RequiresOnline>} />

      {/* Eligibility */}
      <Route path="/eligibility" element={<EligibilityStatus />} />

      {/* Problems (requires online) */}
      <Route path="/problems" element={<RequiresOnline><PlatformPicker /></RequiresOnline>} />
      <Route path="/problems/:platform" element={<RequiresOnline><ProblemList /></RequiresOnline>} />
      <Route path="/problems/:platform/:slug" element={<RequiresOnline><ProblemDetail /></RequiresOnline>} />
 <Route path="/arcade" element={<GameArcade />} />
      {/* Leaderboard (requires online) */}
      <Route path="/leaderboard" element={<RequiresOnline><Leaderboard /></RequiresOnline>} />

      {/* Achievements & Settings */}
      <Route path="/achievements" element={<Achievements />} />
      <Route path="/settings" element={<Settings />} />
    </Routes>
  );
}