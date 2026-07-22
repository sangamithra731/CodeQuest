import { Link } from "react-router-dom";
import DifficultyIcon from "./DifficultyIcon";

// Each language gets a deterministic original gradient + motif instead of
// stock illustrations — keeps the visual language consistent with the
// lantern/pixel theme while still giving every course a distinct banner.
const BANNER_THEMES = {
  python: { gradient: "from-[#1a3a2e] via-[#2d5a45] to-[#3a7a5a]", glyph: "🐍" },
  javascript: { gradient: "from-[#3a2e0a] via-[#6b5015] to-[#a87f1f]", glyph: "⚡" },
  "html-css": { gradient: "from-[#3a1a3a] via-[#5a2d5a] to-[#7a3a7a]", glyph: "🎨" },
  c: { gradient: "from-[#1a2a3a] via-[#2d4a5a] to-[#3a6a7a]", glyph: "⚙️" },
  default: { gradient: "from-[#1a2438] via-[#28324a] to-[#3fd0ff]/30", glyph: "✦" },
};

function CourseBanner({ slug, icon }) {
  const theme = BANNER_THEMES[slug] || BANNER_THEMES.default;

  return (
    <div className={`relative h-36 bg-gradient-to-br ${theme.gradient} overflow-hidden`}>
      {/* faint pixel-star scatter, consistent with the app's motif */}
      <div className="absolute inset-0 bg-stars opacity-60" />
      {/* floating glyph as the banner's focal point */}
      <div className="absolute inset-0 flex items-center justify-center">
        <span className="text-5xl drop-shadow-[0_4px_0_rgba(0,0,0,0.35)]">
          {icon || theme.glyph}
        </span>
      </div>
      {/* bottom fade into the card body */}
      <div className="absolute bottom-0 left-0 right-0 h-8 bg-gradient-to-t from-panel to-transparent" />
    </div>
  );
}

export default function CourseCard({ language }) {
  const { slug, name, description, difficulty, icon } = language;

  return (
    <Link
      to={`/languages/${slug}`}
      className="group block pixel-panel overflow-hidden hover:-translate-y-1 hover:shadow-pixelSky transition-all duration-150"
    >
      <CourseBanner slug={slug} icon={icon} />

      <div className="p-5">
        <p className="font-display text-[11px] font-bold text-mist uppercase tracking-widest mb-2">
          Course
        </p>
        <h3 className="font-display text-lg font-bold text-parchment mb-2 group-hover:text-sky transition-colors">
          {name}
        </h3>
        <p className="font-body text-sm text-mist leading-relaxed mb-4 line-clamp-2">
          {description}
        </p>

        <span className="pixel-badge bg-panelLight text-mist border-border">
          <DifficultyIcon difficulty={difficulty} />
          {difficulty}
        </span>
      </div>
    </Link>
  );
}