// client/src/components/common/OfflineNotice.jsx
import { WifiOff } from 'lucide-react';

export default function OfflineNotice({ label = 'This section' }) {
  return (
    <div style={{
      display: 'flex', alignItems: 'center', gap: 10,
      background: 'rgba(236,73,153,0.1)', border: '1px solid rgba(236,73,153,0.3)',
      color: '#ec4899', padding: '14px 18px', borderRadius: 14, fontSize: 13, fontWeight: 600,
    }}>
      <WifiOff size={18} />
      {label} needs an internet connection. Reconnect to view it — your quests are still available offline.
    </div>
  );
}