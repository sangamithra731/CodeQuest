import { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { COURSE_CATALOG } from '../../data/courseCatalog';
import { getLanguageProgress } from '../../services/api';
import './LanguageOverview.css';
import BackgroundPathMap from './BackgroundPathMap';

// 👇 Local image — save your jungle map background into public/images/
// as jungle-map-bg.jpg (Pinterest URLs get blocked by hotlink protection,
// so this MUST be a file living in your own public/ folder).
const MAP_BACKGROUND_URL = 'https://i.pinimg.com/1200x/1a/b0/ab/1ab0ab02ea50b87cb12fa16d8f543f97.jpg';

// Calibrated positions read directly off the path in MAP_BACKGROUND_URL
// (bottom-left field → past the pond/bridge → up to the top-right house).
// If you ever swap the background image, set calibrate={true} below,
// click through the path in order, and paste the new numbers in here.
const CALIBRATED_PATH = [
  { x: 4,  y: 86 },
  { x: 17, y: 86 },
  { x: 40, y: 86 },
  { x: 79, y: 86 },
  { x: 91, y: 65 },
  { x: 63, y: 59 },
  { x: 49, y: 52 },
  { x: 26, y: 60 },
  { x: 3,  y: 59 },
  { x: 15, y: 40 },
  { x: 75, y: 48 },
  { x: 85, y: 25 },
  { x: 66, y: 20 },
  { x: 47, y: 22 },
  { x: 33, y: 27 },
  { x: 7,  y: 12 },
  { x: 23, y: 2  },
  { x: 55, y: 4  },
  { x: 77, y: 0  },
  { x: 96, y: 4  },
];

// Sits on the road between level 3 (index 2) and level 4 (index 3).
// Adjust x/y if you want it nudged off the straight-line midpoint.
const CUP_POSITION = {
  x: (CALIBRATED_PATH[2].x + CALIBRATED_PATH[3].x) / 2,
  y: (CALIBRATED_PATH[2].y + CALIBRATED_PATH[3].y) / 2,
};

// Each level index maps to a FIXED point on CALIBRATED_PATH.
// Level 1 is always CALIBRATED_PATH[0], level 2 is always
// CALIBRATED_PATH[1], and so on — so adding/removing modules
// never shifts the position of any other, already-placed level.
// (If a course somehow has more modules than we have calibrated
// points for, we just clamp to the last point rather than crash.)
function defaultPositions(count) {
  if (count <= 0) return [];

  const lastIndex = CALIBRATED_PATH.length - 1;
  const positions = [];

  for (let i = 0; i < count; i++) {
    const idx = Math.min(i, lastIndex);
    positions.push({
      x: CALIBRATED_PATH[idx].x,
      y: CALIBRATED_PATH[idx].y,
    });
  }

  return positions;
}

export default function LanguageOverview() {
  const { languageId } = useParams();
  const navigate = useNavigate();
  const [modules, setModules] = useState(null);
  const [loading, setLoading] = useState(true);

  const course = COURSE_CATALOG.find((c) => c.id === languageId);

  useEffect(() => {
    let active = true;

    getLanguageProgress(languageId)
      .then((data) => {
        if (!active) return;

        const modules = data.modules.map((mod) => ({
          id: mod.id,
          slug: mod.slug,
          title: mod.title,
          levelCount: mod.levels.length,
          unlocked: mod.levels[0]?.unlocked ?? false,
          completed: mod.levels.every((lvl) => lvl.completed),
          // needed to route straight into ExamPage for the final-exam module
          firstLevelId: mod.levels[0]?.id ?? null,
        }));

        setModules(modules);
        setLoading(false);
      })
      .catch((err) => {
        console.error(err);
        setLoading(false);
        setModules(null);
      });

    return () => {
      active = false;
    };
  }, [languageId]);

  if (!course) {
    return (
      <div className="overview-page">
        <div className="overview-empty">
          <p>We couldn't find that language.</p>
          <button className="overview-back" onClick={() => navigate('/languages')}>
            ← Back to languages
          </button>
        </div>
      </div>
    );
  }

  // ---- Build the level list BackgroundPathMap expects ----
  let levels = [];
  if (modules && modules.length > 0) {
    const positions = defaultPositions(modules.length);

    levels = modules.map((mod, i) => {
      const locked = i > 0 && !mod.unlocked;
      const isExam = mod.slug === 'final-exam';
      const isCurrent = !locked && !mod.completed;

      return {
        id: mod.id,
        x: positions[i].x,
        y: positions[i].y,
        // always show the level number (or lock/trophy icon) — no checkmark
        label: locked ? '🔒' : isExam ? '20' : i + 1,
        status: { locked, completed: mod.completed, current: isCurrent, exam: isExam },
        // stashed so the click handler below can route correctly
        _mod: mod,
      };
    });

    // Insert a "cup" checkpoint node between level 3 and level 4
    // (i.e. after index 2 in the array). It's not tied to a real
    // module — clicking it just jumps straight to the exam.
    if (levels.length > 3) {
      levels.splice(3, 0, {
        id: 'cup-1',
        x: CUP_POSITION.x,
        y: CUP_POSITION.y,
        label: '🏅',
        status: { cup: true },
        _mod: null,
      });
    }
  }

  function handleSelectLevel(lvl) {
    // Cup node → always route to the exam module, wherever it is.
    if (lvl.status?.cup) {
      const examMod = modules?.find((m) => m.slug === 'final-exam');
      if (examMod?.firstLevelId) {
        navigate(`/languages/${languageId}/exam/${examMod.firstLevelId}`);
      }
      return;
    }

    const mod = lvl._mod;
    if (mod.slug === 'final-exam') {
      if (mod.firstLevelId) {
        navigate(`/languages/${languageId}/exam/${mod.firstLevelId}`);
      }
    } else {
      navigate(`/languages/${languageId}/modules/${mod.slug}`);
    }
  }

  return (
    <div className="overview-page" style={{ '--course-color': course.color }}>
      <header className="overview-header">
        <button className="overview-back" onClick={() => navigate('/languages')}>
          ← All Languages
        </button>
        <div className="overview-hero">
          <span className="overview-icon">{course.icon}</span>
          <div>
            <h1>{course.name}</h1>
            <p>{course.tagline}</p>
            <span className="overview-pill">{course.difficulty}</span>
          </div>
        </div>
      </header>

      <section className="overview-map-wrap">
        {loading && <p className="overview-loading">Loading modules…</p>}

        {!loading && modules === null && (
          <p className="overview-loading">
            Couldn't load modules — please make sure you're logged in, then try again.
          </p>
        )}

        {!loading && modules && modules.length === 0 && (
          <p className="overview-loading">
            Modules for {course.name} are still being written — check back soon!
          </p>
        )}

        {!loading && modules && modules.length > 0 && (
          <BackgroundPathMap
            backgroundUrl={MAP_BACKGROUND_URL}
            levels={levels}
            // 👇 flip this to true only while re-clicking new calibration points
            calibrate={false}
            onSelectLevel={handleSelectLevel}
          />
        )}
      </section>
    </div>
  );
}