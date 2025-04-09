import React from 'react';

interface ThemeToggleProps {
  isDark: boolean;
  onToggle: () => void;
}

const ThemeToggle: React.FC<ThemeToggleProps> = ({ isDark, onToggle }) => {
  return (
    <div className="theme-toggle-container">
      <button
        className="theme-toggle"
        onClick={onToggle}
        aria-label={`Switch to ${isDark ? 'light' : 'dark'} theme`}
      >
        {isDark ? '☀️' : '🌙'}
      </button>
    </div>
  );
};

export default ThemeToggle; 