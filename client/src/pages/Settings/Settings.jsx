// src/pages/Settings.jsx
import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  ArrowLeft, User, Shield, Bell, Palette, Globe, Lock,
  Key, Smartphone, Mail, Camera, Save, Sun, Moon,
  Monitor, CreditCard, Download, Trash2, CheckCircle,
  Award, LogOut
} from 'lucide-react';
import {
  getUserProfile,
  updateProfile,
  updateNotificationSettings,
  changePassword,
  deleteAccount,
  exportUserData,
} from '../../services/api';
import './Settings.css';

export default function Settings() {
  const navigate = useNavigate();
  const [theme, setTheme] = useState(() => localStorage.getItem('cq_theme') || 'dark');
  const [saved, setSaved] = useState(false);
  const [saving, setSaving] = useState(false);
  const [activeTab, setActiveTab] = useState('profile');
  const [error, setError] = useState('');

  const [settings, setSettings] = useState({
    username: '',
    email: '',
    bio: '',
    level: 1,
    xp: 0,
    notifications: {
      email: true,
      push: true,
      questUpdates: true,
      achievements: true,
      marketing: false,
    },
  });

  useEffect(() => {
    document.documentElement.setAttribute('data-theme', theme);
    localStorage.setItem('cq_theme', theme);
  }, [theme]);

  // Load real user data on mount
  useEffect(() => {
    getUserProfile().then((profile) => {
      setSettings((prev) => ({
        ...prev,
        username: profile.username || profile.name || 'Coder',
        email: profile.email || '',
        bio: profile.bio || '',
        level: profile.level || 1,
        xp: profile.xp || 0,
        notifications: profile.notifications || prev.notifications,
      }));
    });
  }, []);

  const handleSave = async () => {
    setSaving(true);
    setError('');
    try {
      if (activeTab === 'profile') {
        await updateProfile({
          username: settings.username,
          email: settings.email,
          bio: settings.bio,
        });
      } else if (activeTab === 'notifications') {
        await updateNotificationSettings(settings.notifications);
      }
      setSaved(true);
      setTimeout(() => setSaved(false), 3000);
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to save changes.');
    } finally {
      setSaving(false);
    }
  };

  const handleLogout = () => {
    localStorage.clear();
    navigate('/login');
  };

  const handleChangePassword = async () => {
    const currentPassword = window.prompt('Enter your current password:');
    if (!currentPassword) return;
    const newPassword = window.prompt('Enter your new password:');
    if (!newPassword) return;

    try {
      await changePassword({ currentPassword, newPassword });
      alert('Password changed successfully.');
    } catch (err) {
      alert(err.response?.data?.message || 'Failed to change password.');
    }
  };

  const handleExport = async () => {
    try {
      const blob = await exportUserData();
      const url = window.URL.createObjectURL(new Blob([blob]));
      const link = document.createElement('a');
      link.href = url;
      link.setAttribute('download', 'codequest-data.json');
      document.body.appendChild(link);
      link.click();
      link.remove();
    } catch (err) {
      alert('Failed to export data.');
    }
  };

  const handleDeleteAccount = async () => {
    const confirmed = window.confirm(
      'This will permanently delete your account and all progress. This cannot be undone. Continue?'
    );
    if (!confirmed) return;

    try {
      await deleteAccount();
      localStorage.clear();
      navigate('/signup');
    } catch (err) {
      alert('Failed to delete account.');
    }
  };

  const renderTabContent = () => {
    switch (activeTab) {
      case 'profile':
        return (
          <div className="settings-section">
            <div className="settings-avatar-section">
              <div className="settings-avatar">
                <div className="settings-avatar-image">
                  <span className="settings-avatar-emoji">🧙</span>
                </div>
                <button className="settings-avatar-btn">
                  <Camera size={16} />
                  Change Photo
                </button>
              </div>
              <div className="settings-avatar-info">
                <h3>{settings.username}</h3>
                <p className="settings-avatar-level">Level {settings.level} • {settings.xp} XP</p>
              </div>
            </div>

            <div className="settings-form-group">
              <label>Username</label>
              <input
                type="text"
                value={settings.username}
                onChange={(e) => setSettings({ ...settings, username: e.target.value })}
                className="settings-input"
              />
            </div>

            <div className="settings-form-group">
              <label>Email Address</label>
              <div className="settings-input-with-icon">
                <Mail size={18} className="settings-input-icon" />
                <input
                  type="email"
                  value={settings.email}
                  onChange={(e) => setSettings({ ...settings, email: e.target.value })}
                  className="settings-input"
                  style={{ paddingLeft: '42px' }}
                />
                <span className="settings-verified-badge">
                  <CheckCircle size={14} /> Verified
                </span>
              </div>
            </div>

            <div className="settings-form-group">
              <label>Bio</label>
              <textarea
                value={settings.bio}
                onChange={(e) => setSettings({ ...settings, bio: e.target.value })}
                className="settings-textarea"
                rows="3"
                placeholder="Tell us about yourself..."
              />
            </div>
          </div>
        );

      case 'notifications':
        return (
          <div className="settings-section">
            <div className="settings-notification-item">
              <div className="settings-notification-info">
                <Mail size={20} className="settings-notification-icon" />
                <div>
                  <h4>Email Notifications</h4>
                  <p>Receive updates via email</p>
                </div>
              </div>
              <label className="settings-toggle">
                <input
                  type="checkbox"
                  checked={settings.notifications.email}
                  onChange={() =>
                    setSettings({
                      ...settings,
                      notifications: {
                        ...settings.notifications,
                        email: !settings.notifications.email,
                      },
                    })
                  }
                />
                <span className="settings-toggle-slider"></span>
              </label>
            </div>

            <div className="settings-notification-item">
              <div className="settings-notification-info">
                <Smartphone size={20} className="settings-notification-icon" />
                <div>
                  <h4>Push Notifications</h4>
                  <p>Get real-time alerts on your device</p>
                </div>
              </div>
              <label className="settings-toggle">
                <input
                  type="checkbox"
                  checked={settings.notifications.push}
                  onChange={() =>
                    setSettings({
                      ...settings,
                      notifications: {
                        ...settings.notifications,
                        push: !settings.notifications.push,
                      },
                    })
                  }
                />
                <span className="settings-toggle-slider"></span>
              </label>
            </div>

            <div className="settings-notification-item">
              <div className="settings-notification-info">
                <Award size={20} className="settings-notification-icon" />
                <div>
                  <h4>Achievement Alerts</h4>
                  <p>Celebrate your milestones</p>
                </div>
              </div>
              <label className="settings-toggle">
                <input
                  type="checkbox"
                  checked={settings.notifications.achievements}
                  onChange={() =>
                    setSettings({
                      ...settings,
                      notifications: {
                        ...settings.notifications,
                        achievements: !settings.notifications.achievements,
                      },
                    })
                  }
                />
                <span className="settings-toggle-slider"></span>
              </label>
            </div>
          </div>
        );

      case 'appearance':
        return (
          <div className="settings-section">
            <div className="settings-theme-grid">
              <div
                className={`settings-theme-option ${theme === 'dark' ? 'active' : ''}`}
                onClick={() => setTheme('dark')}
              >
                <div className="settings-theme-preview dark-theme-preview">
                  <div className="settings-theme-preview-header"></div>
                  <div className="settings-theme-preview-content"></div>
                </div>
                <span>Dark</span>
                {theme === 'dark' && <CheckCircle size={16} className="settings-theme-check" />}
              </div>

              <div
                className={`settings-theme-option ${theme === 'light' ? 'active' : ''}`}
                onClick={() => setTheme('light')}
              >
                <div className="settings-theme-preview light-theme-preview">
                  <div className="settings-theme-preview-header"></div>
                  <div className="settings-theme-preview-content"></div>
                </div>
                <span>Light</span>
                {theme === 'light' && <CheckCircle size={16} className="settings-theme-check" />}
              </div>

              <div
                className={`settings-theme-option ${theme === 'system' ? 'active' : ''}`}
                onClick={() => setTheme('system')}
              >
                <div className="settings-theme-preview system-theme-preview">
                  <div className="settings-theme-preview-header"></div>
                  <div className="settings-theme-preview-content"></div>
                </div>
                <span>System</span>
                {theme === 'system' && <CheckCircle size={16} className="settings-theme-check" />}
              </div>
            </div>

            <div className="settings-form-group">
              <label>Accent Color</label>
              <div className="settings-color-options">
                <button className="settings-color-btn" style={{ background: '#8b5cf6' }}></button>
                <button className="settings-color-btn" style={{ background: '#ec4899' }}></button>
                <button className="settings-color-btn" style={{ background: '#35e0e0' }}></button>
                <button className="settings-color-btn" style={{ background: '#f5c451' }}></button>
                <button
                  className="settings-color-btn active"
                  style={{ background: 'linear-gradient(135deg, #8b5cf6, #ec4899)' }}
                ></button>
              </div>
            </div>
          </div>
        );

      case 'security':
        return (
          <div className="settings-section">
            <div className="settings-security-card">
              <Key size={24} className="settings-security-icon" />
              <div>
                <h4>Change Password</h4>
                <p>Update your password to keep your account secure</p>
                <button className="settings-security-btn" onClick={handleChangePassword}>
                  Change Password
                </button>
              </div>
            </div>

            <div className="settings-security-card">
              <Shield size={24} className="settings-security-icon" />
              <div>
                <h4>Two-Factor Authentication</h4>
                <p>Add an extra layer of security to your account</p>
                <button className="settings-security-btn" onClick={() => alert('2FA setup coming soon')}>
                  Enable 2FA
                </button>
              </div>
            </div>

            <div className="settings-security-card">
              <Lock size={24} className="settings-security-icon" />
              <div>
                <h4>Active Sessions</h4>
                <p>You're logged in on 2 devices</p>
                <button className="settings-security-btn" onClick={() => alert('Session management coming soon')}>
                  View Sessions
                </button>
              </div>
            </div>
          </div>
        );

      case 'data':
        return (
          <div className="settings-section">
            <div className="settings-data-card">
              <Download size={20} />
              <div>
                <h4>Export Data</h4>
                <p>Download all your progress, achievements, and certificates</p>
                <button className="settings-data-btn primary" onClick={handleExport}>
                  Export
                </button>
              </div>
            </div>

            <div className="settings-data-card danger">
              <Trash2 size={20} />
              <div>
                <h4>Delete Account</h4>
                <p>Permanently delete your account and all associated data</p>
                <button className="settings-data-btn danger" onClick={handleDeleteAccount}>
                  Delete Account
                </button>
              </div>
            </div>
          </div>
        );

      default:
        return null;
    }
  };

  return (
    <div className="settings-shell">
      <div className="settings-container">
        <div className="settings-header">
          <button className="settings-back-btn" onClick={() => navigate('/dashboard')}>
            <ArrowLeft size={20} />
          </button>
          <div>
            <h1 className="settings-title">Settings</h1>
            <p className="settings-subtitle">Manage your account preferences</p>
          </div>
          <button className="settings-save-btn" onClick={handleSave} disabled={saving}>
            {saved ? (
              <>
                <CheckCircle size={16} />
                Saved!
              </>
            ) : (
              <>
                <Save size={16} />
                {saving ? 'Saving...' : 'Save Changes'}
              </>
            )}
          </button>
        </div>

        {error && <p style={{ color: '#ec4899', marginBottom: '16px' }}>{error}</p>}

        <div className="settings-tabs">
          <button
            className={`settings-tab ${activeTab === 'profile' ? 'active' : ''}`}
            onClick={() => setActiveTab('profile')}
          >
            <User size={18} />
            Profile
          </button>
          <button
            className={`settings-tab ${activeTab === 'notifications' ? 'active' : ''}`}
            onClick={() => setActiveTab('notifications')}
          >
            <Bell size={18} />
            Notifications
          </button>
          <button
            className={`settings-tab ${activeTab === 'appearance' ? 'active' : ''}`}
            onClick={() => setActiveTab('appearance')}
          >
            <Palette size={18} />
            Appearance
          </button>
          <button
            className={`settings-tab ${activeTab === 'security' ? 'active' : ''}`}
            onClick={() => setActiveTab('security')}
          >
            <Shield size={18} />
            Security
          </button>
          <button
            className={`settings-tab ${activeTab === 'data' ? 'active' : ''}`}
            onClick={() => setActiveTab('data')}
          >
            <Globe size={18} />
            Data
          </button>
        </div>

        <div className="settings-content">{renderTabContent()}</div>

        <div className="settings-footer">
          <button className="settings-logout-btn" onClick={handleLogout}>
            <LogOut size={18} />
            Sign Out
          </button>
        </div>
      </div>
    </div>
  );
}