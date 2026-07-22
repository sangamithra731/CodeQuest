import { useState } from 'react';

export default function BackgroundPathMap({
  backgroundUrl,
  levels = [],
  aspectRatio = '877 / 406',
  calibrate = false,
  onSelectLevel,
}) {
  const [lastClick, setLastClick] = useState(null);

  function handleImageClick(e) {
    if (!calibrate) return;
    const rect = e.currentTarget.getBoundingClientRect();
    const x = +(((e.clientX - rect.left) / rect.width) * 100).toFixed(1);
    const y = +(((e.clientY - rect.top) / rect.height) * 100).toFixed(1);
    setLastClick({ x, y });
    console.log('level position →', { x, y });
  }

  return (
    <div
      onClick={handleImageClick}
      style={{
        position: 'relative',
        width: '100%',
        aspectRatio,
        margin: '0 auto',
        borderRadius: 20,
        overflow: 'hidden',
        backgroundImage: `url(${backgroundUrl})`,
        backgroundSize: 'cover',
        backgroundPosition: 'center',
        backgroundRepeat: 'no-repeat',
        cursor: calibrate ? 'crosshair' : 'default',
        boxShadow: '0 16px 40px rgba(0,0,0,0.25)',
      }}
    >
      <style>{`
        @keyframes bobUpDown {
          0%   { transform: translate(-50%, -50%) translateY(0px); }
          50%  { transform: translate(-50%, -50%) translateY(-8px); }
          100% { transform: translate(-50%, -50%) translateY(0px); }
        }
      `}</style>

      {levels.map((lvl) => {
        const { locked, completed, current, exam, cup } = lvl.status || {};

        const bg = locked
          ? 'linear-gradient(180deg,#9aa3ab,#6d7680)'
          : completed
          ? 'linear-gradient(180deg,#aee2ff,#c9b6f5)'
          : exam
          ? 'linear-gradient(180deg,#ff7a3d,#d1401b)'
          : cup
          ? 'linear-gradient(180deg,#ffd54d,#f5a623)'
          : 'linear-gradient(180deg,#8ecbff,#b8a4ec)';

        return (
          <button
            key={lvl.id}
            type="button"
            disabled={locked}
            onClick={(e) => {
              e.stopPropagation();
              if (locked) return;
              onSelectLevel?.(lvl);
            }}
            style={{
              position: 'absolute',
              left: `${lvl.x}%`,
              top: `${lvl.y}%`,
              transform: 'translate(-50%, -50%)',
              width: exam ? 54 : 44,
              height: exam ? 54 : 44,
              borderRadius: cup ? 8 : '50%',
              border: '3px solid #fff',
              background: bg,
              color: '#fff',
              fontWeight: 800,
              fontFamily: 'sans-serif',
              fontSize: 16,
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              boxShadow: current
                ? '0 0 0 4px rgba(255,255,255,0.5), 0 4px 10px rgba(0,0,0,0.35)'
                : '0 4px 10px rgba(0,0,0,0.35)',
              cursor: locked ? 'not-allowed' : 'pointer',
              animation: current ? 'bobUpDown 1.4s ease-in-out infinite' : 'none',
              zIndex: current ? 2 : 1,
            }}
          >
            {lvl.label}
          </button>
        );
      })}

      {calibrate && lastClick && (
        <div
          style={{
            position: 'absolute',
            bottom: 10,
            left: 10,
            background: 'rgba(0,0,0,0.7)',
            color: '#fff',
            fontFamily: 'monospace',
            fontSize: 12,
            padding: '6px 10px',
            borderRadius: 6,
          }}
        >
          last click: x {lastClick.x}%, y {lastClick.y}%
        </div>
      )}
    </div>
  );
}