import { useState } from 'react'
import './App.css'
import Login from './pages/Login'
import Home from './pages/Home'
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import MeetingSlots from './pages/MeetingSlots'
import Calendar from './pages/Calendar'

function App() {
  const [count, setCount] = useState(0)

  return (
    <BrowserRouter>
        <Routes>
          <Route path="/" element={<Login />} />
          <Route path="/home" element={<Home />} />
          <Route path="/home/meetingslots" element={<MeetingSlots />} />
          <Route path="/home/calendar" element={<Calendar />} />
          <Route path="#" element={<Navigate to="/" replace />} />
        </Routes>
    </BrowserRouter>
  )
}

export default App;



