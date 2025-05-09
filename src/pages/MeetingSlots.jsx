import React, { useState, useEffect, useRef } from 'react';
import axios from 'axios';
import { Link, useNavigate } from 'react-router-dom';
import Layout from '../components/Layout';
import { motion, AnimatePresence } from 'framer-motion';
import * as FiIcons from 'react-icons/fi'; // Import all icons as FiIcons
import '../App.css';

export default function MeetingSlots() {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isSettingsOpen, setIsSettingsOpen] = useState(false);
  const [isDarkMode, setIsDarkMode] = useState(false);
  const [day, setDay] = useState('');
  const [startTime, setStartTime] = useState('');
  const [endTime, setEndTime] = useState('');
  const [availableFaculty, setAvailableFaculty] = useState([]);
  const [busyFaculty, setBusyFaculty] = useState([]);
  const [error, setError] = useState('');
  const menuRef = useRef(null);
  const settingsMenuRef = useRef(null);
  const navigate = useNavigate();

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

  const handleSearch = async () => {
    if (!day || !startTime || !endTime) {
      setError('All fields are required.');
      return;
    }

    setError('');
    try {
      const response = await axios.get('http://127.0.0.1:8000/api/get_faculty_availability/', {
        params: { day, start_time: startTime, end_time: endTime },
      });
      setAvailableFaculty(response.data.available_faculty);
      setBusyFaculty(response.data.busy_faculty);
    } catch (err) {
      setError('Failed to fetch data. Please try again.');
    }
  };

  return (
    <Layout>
      <div className="meeting-slots-page">
        <div id="top-bar">
          <header>
            <button className="Menu-icon" onClick={() => setIsMenuOpen(!isMenuOpen)}>
              ☰
            </button>
            <div className="logo"></div>
            <button
              className="settings-icon"
              onClick={() => setIsSettingsOpen(!isSettingsOpen)}
            >
              <FiIcons.FiSettings size={24} /> {/* Updated to use FiSettings */}
            </button>
          </header>

          {/* Settings Menu */}
          <AnimatePresence>
            {isSettingsOpen && (
              <>
                <motion.div
                  initial={{ x: '100%' }}
                  animate={{ x: 0 }}
                  exit={{ x: '100%' }}
                  transition={{ type: 'spring', stiffness: 300, damping: 30 }}
                  className="settings-sidebar" 
                >
                  <h2 className="text-2xl font-bold mb-4">Settings</h2>
                  <ul>
                    <li>
                      <button onClick={toggleDarkMode}>
                        {isDarkMode ? 'Light Mode' : 'Dark Mode'} 
                      </button>
                    </li>
                    <li className="mb-2">
                      <Link to="/">
                        <h3>
                          <FiIcons.FiLogOut size={24} /> {/* Updated to use FiLogOut */}
                          Logout
                        </h3>
                      </Link>
                    </li>
                  </ul>
                </motion.div>
                <div className="fixed inset-0 bg-black opacity-20 z-40" />
              </>
            )}
          </AnimatePresence>

          {/* Sidebar Menu */}
          <AnimatePresence>
            {isMenuOpen && (
              <>
                <motion.div
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
                          <FiIcons.FiHome size={24} /> {/* Updated to use FiHome */}
                          Home
                        </h3>
                      </Link>
                    </li>
                    <li className="mb-2">
                      <Link to="/home/meetingslots" onClick={() => setIsMenuOpen(false)}>
                        <h3>
                          <FiIcons.FiClock size={24} /> {/* Updated to use FiClock */}
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
                <div className="fixed inset-0 bg-black opacity-20 z-40" />
              </>
            )}
          </AnimatePresence>

          {/* Main Content */}
          <div className="meeting-slots-container">
            <h1 className="text-center text-3xl font-bold mb-6">Meeting Slots</h1>
            <div className="filter-container">
              <div className="input-row">
                <label htmlFor="day">Day:</label>
                <select
                  id="day"
                  type="text"
                  value={day}
                  onChange={(e) => setDay(e.target.value)}
                  placeholder="Select a day"
                >
                  <option value="">Select a day</option>
                  {['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday'].map((day) => (
                    <option key={day} value={day}>
                      {day}
                    </option>
                  ))}
                </select>
              </div>
              <div className="input-row">
                <label htmlFor="start-time">Start Time:</label>
                <select
                  id="start-time"
                  type="time"
                  value={startTime}
                  onChange={(e) => setStartTime(e.target.value)}
                >
                  <option value="">Select a start time</option>
                  {['08:00', '09:00', '10:00', '11:00', '12:00', '13:00', '14:00', '15:00', '16:00'].map((time) => {
                    return (
                      <option key={time} value={time}>
                        {time}
                      </option>
                    );
                  })}
                </select>
              </div>
              <div className="input-row">
                <label htmlFor="end-time">End Time:</label>
                <select
                  id="end-time"
                  type="time"
                  value={endTime}
                  onChange={(e) => setEndTime(e.target.value)}
                >
                  <option value="">Select an end time</option>
                  {['09:00', '10:00', '11:00', '12:00', '13:00', '14:00', '15:00', '16:00', '17:00'].map((time) => {
                    return (
                      <option key={time} value={time}>
                        {time}
                      </option>
                    );
                  })}
                </select>
              </div>
              <button className="search-button" onClick={handleSearch}>
                Search
              </button>
            </div>
            {error && <p className="text-red-500 text-center mt-4">{error}</p>}
            <div className="results-container">
              <div className="results-section">
                <h2>Available Faculty</h2>
                <ul>
                  {availableFaculty.length > 0 ? (
                    availableFaculty.map((faculty, index) =>{if(localStorage.getItem('username')!=faculty){
                      return <li key={index}>{faculty[0]}{faculty[1]}</li>
                    }})
                  ) : (
                    <p>No available faculty found.</p>
                  )}
                </ul>
              </div>
              <div className="results-section">
                <h2>Busy Faculty</h2>
                <ul>
                  {busyFaculty.length > 0 ? (
                    busyFaculty.map((faculty, index) => {if(localStorage.getItem('username')!=faculty){
                      return <li key={index}>{faculty[0]}{faculty[1]}</li>
                    }})
                  ) : (
                    <p>No busy faculty found.</p>
                  )}
                </ul>
              </div>
            </div>
          </div>
        </div>
      </div>
    </Layout>
  );
}