import React, { useEffect, useState, useRef } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import Layout from '../components/Layout';
import { motion, AnimatePresence } from 'framer-motion';
import '../App.css';
import * as FiIcons from 'react-icons/fi'; // Import all icons as FiIcons

export default function Home() {
  const [timetable, setTimetable] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState('');
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isSettingsOpen, setIsSettingsOpen] = useState(false);
  const [isDarkMode, setIsDarkMode] = useState(false); // State for dark mode
  const menuRef = useRef();
  const settingsMenuRef = useRef();
  const navigate = useNavigate();

  // Load dark mode preference from localStorage
  useEffect(() => {
    const darkModePreference = localStorage.getItem('darkMode') === 'true';
    setIsDarkMode(darkModePreference);
    document.body.classList.toggle('dark-mode', darkModePreference);
  }, []);

  useEffect(() => {
    const fetchUserTimetable = async () => {
      try {
        const response = await fetch(
          `http://127.0.0.1:8000/api/get_timetable?username=` +
            localStorage.getItem('username'),
          {
            method: 'GET',
            headers: {
              'Content-Type': 'application/json',
            },
          }
        );

        if (!response.ok) {
          const errorData = await response.json();
          console.error('API Error:', errorData);
          throw new Error(errorData.error || 'Failed to fetch timetable.');
        }

        const data = await response.json();
        console.log('Timetable data:', data);
        setTimetable(data);
      } catch (error) {
        console.error('Error fetching timetable:', error);
        setError(
          error.message || 'An error occurred while fetching the timetable.'
        );
      } finally {
        setIsLoading(false);
      }
    };
    fetchUserTimetable();
  }, []);

  // Toggle dark mode
  const toggleDarkMode = () => {
    const newDarkModeState = !isDarkMode;
    setIsDarkMode(newDarkModeState);
    document.body.classList.toggle('dark-mode', newDarkModeState);
    localStorage.setItem('darkMode', newDarkModeState); // Save preference to localStorage
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
      <div id="home-page">{/* Home page wrapper */}
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
              <FiIcons.FiSettings size={24} /> {/* Corrected reference */}
            </button>
          </header>

          {/* Settings Menu */}
          <AnimatePresence>
            {isSettingsOpen && (
              <>
                <motion.div
                  ref={settingsMenuRef}
                  initial={{ x: '100%' }}
                  animate={{ x: 0 }}
                  exit={{ x: '100%' }}
                  transition={{ type: 'spring', stiffness: 300, damping: 30 }}
                  className="settings-sidebar"
                >
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
                          <FiIcons.FiLogOut size={24} /> {/* Corrected reference */}
                          Logout
                        </h3>
                      </Link>
                    </li>
                  </ul>
                </motion.div>

                {/* Overlay */}
                <div className="fixed inset-0 bg-black opacity-20 z-40" />
              </>
            )}
          </AnimatePresence>

          {/* Sidebar Menu */}
          <AnimatePresence>
            {isMenuOpen && (
              <>
                <motion.div
                  ref={menuRef}
                  initial={{ x: '-100%' }}
                  animate={{ x: 0 }}
                  exit={{ x: '-100%' }}
                  transition={{ type: 'spring', stiffness: 300, damping: 30 }}
                  className="menu-sidebar"
                >
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
                      <Link
                        to="/home/meetingslots"
                        onClick={() => setIsMenuOpen(false)}
                      >
                        <h3>
                        <FiIcons.FiClock size={24} />
                        Meeting Slots
                        </h3>
                      </Link>
                    </li>
                    <li className="mb-2">
                      <Link
                        to="/home/calendar"
                        onClick={() => setIsMenuOpen(false)}
                      >
                        <h3>
                          <FiIcons.FiCalendar size={24} />
                          Calendar
                        </h3>
                      </Link>
                    </li>
                  </ul>
                </motion.div>

                {/* Overlay */}
                <div className="fixed inset-0 bg-black opacity-20 z-40" />
              </>
            )}
          </AnimatePresence>

          {/* Main Content */}
          <div className="tables-container">
            <main className="main-content timetable-section">
              <h2>Your Timetable</h2>
              {isLoading ? (
                <p>Loading timetable...</p>
              ) : error ? (
                <p className="error-message">{error}</p>
              ) : timetable.length > 0 ? (
                <table className="timetable-table">
                  <thead>
                    <tr>
                      <th>No.</th>
                      <th>Day</th>
                      <th>Time</th>
                      <th>Class</th>
                    </tr>
                  </thead>
                  <tbody>
                    {timetable.map((entry, index) => (
                      <tr key={index}>
                        <td>{index + 1}</td>
                        <td>{entry.day || '-'}</td>
                        <td>
                          {entry.start_time || '-'} - {entry.end_time || '-'}
                        </td>
                        <td>{entry.class_room || '-'}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              ) : (
                <p>No timetable available.</p>
              )}
            </main>
          </div>
        </div>
      </div>
    </Layout>
  );
}