import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Navbar from './Navbar';
import LoginForm from './Login';
import RegisterForm from './Register';

function App() {
  return (
    <Router>
      <Navbar />
      <Routes>
        <Route path="/login" element={<LoginForm />} />
        <Route path="/register" element={<RegisterForm />} />
        <Route path="/" element={<h1>Welcome to Community Portal</h1>} />
      </Routes>
    </Router>
  );
}

export default App;

