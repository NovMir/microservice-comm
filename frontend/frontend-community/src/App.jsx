
// src/App.jsx
import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Header from './Header';
import Footer from './Footer';
import Home from './Home';
import PostsPage from './PostsPage';
import CreatePostPage from './CreatePostPage';
import HelpPage from './HelpPage';
import CreateHelpPage from './CreateHelpPage';
import PostDetail from './postdetail';
import HelpDetail from './helpdetail';
import './index.css';

function App() {
  return (
    <Router>
      <div className="app-container">
        <Header />
        <main className="main-content">
          <Routes>
            <Route path="/" element={<Home />} />
        <Route path="/posts" element={<PostsPage />} />
        <Route path="/posts/:id" element={<PostDetail />} />
         <Route path="/create-post" element={<CreatePostPage />} />
          <Route path="/help" element={<HelpPage />} />
           <Route path="/help/:id" element={<HelpDetail />} />
            <Route path="/create-help" element={<CreateHelpPage />} />
          </Routes>
        </main>
        <Footer />
      </div>
    </Router>
  );
}

export default App;