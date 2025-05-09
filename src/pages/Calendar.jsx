import React, { useState, useEffect, useRef } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import Layout from '../components/Layout';
import '../App.css'; // Import your CSS file for styles
import * as FiIcons from 'react-icons/fi';

export default function Calendar() {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isSettingsOpen, setIsSettingsOpen] = useState(false);
  const [isDarkMode, setIsDarkMode] = useState(false);
  const menuRef = useRef();
  const settingsMenuRef = useRef();
  const navigate = useNavigate();

  const days = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];
  const currentDate = new Date();
  const currentMonth = currentDate.toLocaleString('default', { month: 'long' });
  const currentYear = currentDate.getFullYear();

  // Get first day and number of days in month
  const firstDayOfMonth = new Date(currentYear, currentDate.getMonth(), 1).getDay();
  const daysInMonth = new Date(currentYear, currentDate.getMonth() + 1, 0).getDate();

  // Build calendar array with empty slots for alignment
  const calendarDays = Array.from({ length: firstDayOfMonth + daysInMonth }, (_, i) => {
    if (i < firstDayOfMonth) return null;
    return {
      day: i - firstDayOfMonth + 1,
      hasEvent: Math.random() > 0.7,
    };
  });

  // Load dark mode preference from localStorage
  useEffect(() => {
    const darkModePreference = localStorage.getItem('darkMode') === 'true';
    setIsDarkMode(darkModePreference);
    document.body.classList.toggle('dark-mode', darkModePreference);
  }, []);

  // Toggle dark mode
  const toggleDarkMode = () => {
    const newDarkModeState = !isDarkMode;
    setIsDarkMode(newDarkModeState);
    document.body.classList.toggle('dark-mode', newDarkModeState);
    localStorage.setItem('darkMode', newDarkModeState);
  };

  // Logout functionality
  const handleLogout = () => {
    localStorage.removeItem('username');
    navigate('/');
  };

  // Close menus when clicking outside
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (
        menuRef.current &&
        !menuRef.current.contains(event.target) &&
        settingsMenuRef.current &&
        !settingsMenuRef.current.contains(event.target)
      ) {
        setIsMenuOpen(false);
        setIsSettingsOpen(false);
      }
    };

    if (isMenuOpen || isSettingsOpen) {
      document.addEventListener('mousedown', handleClickOutside);
    } else {
      document.removeEventListener('mousedown', handleClickOutside);
    }

    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, [isMenuOpen, isSettingsOpen]);

  return (
    <Layout>
      <div id="top-bar">
        <header>
          <button
            className="Menu-icon"
            onClick={() => setIsMenuOpen(!isMenuOpen)}
          >
            ☰
          </button>
          <div className="logo"></div>
          <button
            className="settings-icon"
            onClick={() => setIsSettingsOpen(!isSettingsOpen)}
          >
            <FiIcons.FiSettings size={24} />
          </button>
        </header>

        {/* Settings Menu */}
        {isSettingsOpen && (
          <div ref={settingsMenuRef} className="settings-sidebar">
            <h2 className="text-2xl font-bold mb-4">Settings</h2>
            <ul>
              <li className="mb-2">
                <button onClick={toggleDarkMode}>
                  {isDarkMode ? 'Light Mode' : 'Dark Mode'}
                </button>
              </li>
              <li className="mb-2" onClick={handleLogout}>
                <Link to="/" onClick={() => setIsSettingsOpen(false)}>
                  <h3>
                    <FiIcons.FiLogOut size={24} />
                    Logout
                  </h3>
                </Link>
              </li>
            </ul>
          </div>
        )}

        {/* Sidebar Menu */}
        {isMenuOpen && (
          <div ref={menuRef} className="menu-sidebar">
            <h2 className="text-2xl font-bold mb-4">Menu</h2>
            <ul>
              <li className="mb-2">
                <Link to="/home" onClick={() => setIsMenuOpen(false)}>
                  <h3>
                    <FiIcons.FiHome size={24} />
                    Home
                  </h3>
                </Link>
              </li>
              <li className="mb-2">
                <Link to="/home/meetingslots" onClick={() => setIsMenuOpen(false)}>
                  <h3>
                    <FiIcons.FiClock size={24} />
                    Meeting Slots
                  </h3>
                </Link>
              </li>
              <li className="mb-2">
                <Link to="/home/calendar" onClick={() => setIsMenuOpen(false)}>
                  <h3>
                    <FiIcons.FiCalendar size={24} />
                    Calendar
                  </h3>
                </Link>
              </li>
            </ul>
          </div>
        )}

        {/* Calendar */}
        <div className="calendar-page">
          <div className="calendar-container">
            {/* Header */}
            <div className="calendar-header">
              <h1 className="calendar-title">{`${currentMonth} ${currentYear}`}</h1>
            </div>

            {/* Days Header */}
            <div className="calendar-grid">
              {days.map((day) => (
                <div key={day} className="calendar-day-header">
                  {day}
                </div>
              ))}
            </div>

            {/* Calendar Grid */}
            <div className="calendar-grid">
              {calendarDays.map((day, index) => (
                <div
                  key={index}
                  className={`calendar-date ${
                    day?.day === currentDate.getDate() ? 'current-date' : ''
                  }`}
                >
                  {day && (
                    <>
                      <span
                        className={`text-sm ${
                          day.day === currentDate.getDate()
                            ? 'font-bold text-blue-600'
                            : 'text-gray-900'
                        }`}
                      >
                        {day.day}
                      </span>
                      {day.hasEvent && <div className="event-indicator"></div>}
                    </>
                  )}
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </Layout>
  );
}