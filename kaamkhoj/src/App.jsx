import React from 'react';
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import Home from './components/Home';
import JobLists from './components/Jobs/JobLists';
import JobDetails from './components/Jobs/JobDetails';
import Header from './components/Header';
import Footer from './components/Footer';

function App() {
  return (
    <>
      <Router>
        <Header />
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/jobs" element={<JobLists />} />
          <Route path="/jobs/:value" element={<JobDetails />} />
        </Routes>
        <Footer />
      </Router>
    </>
  );
}

export default App;
