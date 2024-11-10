import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import HomePage from './pages/HomePage';
import NotFoundPage from './pages/NotFoundPage';
import JobPostingsPage from './pages/JobPostingsPage';
import CandidateTrackingPage from './pages/CandidateTrackingPage';
import CreateAssessmentPage from './pages/CreateAssessmentPage';
import CandidateDetailPage from './pages/CandidateDetailPage';


function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<HomePage />} />   
        <Route path="*" element={<NotFoundPage />} />  
        <Route path="/jobs" element={<JobPostingsPage />} />
        <Route path="/candidates/:jobId" element={<CandidateTrackingPage />} />
        <Route path="/job/:jobId/candidate/:candidateId" element={<CandidateDetailPage />} />
        <Route path="/assessment" element={<CreateAssessmentPage />} />
      </Routes>
    </Router>
  );
}

export default App;
