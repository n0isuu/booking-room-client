// App.jsx
import { Routes, Route } from 'react-router-dom';
import Home from './pages/Home.jsx';
import About from './pages/About.jsx';
import NotFound from './pages/NotFound.jsx';
import Booking from './pages/Booking.jsx';
import Admin from './pages/Admin.jsx';
import Success from './pages/Success.jsx';
import { Button, CustomProvider, Container } from 'rsuite';
import 'rsuite/dist/rsuite.min.css';

export default function App() {
  return (
    <Routes>
      <Route path="/" element={<Home />} />
      <Route path="/about" element={<About />} />
      <Route path="/booking" element={<Booking />} />
      <Route path="/admin" element={<Admin />} />
      <Route path="/success" element={<Success />} />
      <Route path="*" element={<NotFound />} />
    </Routes>
  );
}
