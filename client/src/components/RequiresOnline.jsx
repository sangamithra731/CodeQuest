import { useOnlineStatus } from '../hooks/useOnlineStatus';

export function RequiresOnline({ children }) {
  const isOnline = useOnlineStatus();

  if (!isOnline) {
    return (
      <div style={{ textAlign: 'center', padding: '60px 20px' }}>
        <h2>📡 You're offline</h2>
        <p>This section needs an internet connection. Course content you've already visited is still available offline.</p>
      </div>
    );
  }

  return children;
}