import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { Paper, Typography, Button, Box, Link, CircularProgress } from '@mui/material';
import { useTheme } from '@mui/material/styles';

function CandidateDetailPage() {
  const { jobId, candidateId } = useParams();
  const navigate = useNavigate();
  const theme = useTheme();

  const [candidate, setCandidate] = useState(null); // Initially null while data is being fetched
  const [loading, setLoading] = useState(true); // Loading state
  const [error, setError] = useState(null); // Error state to handle any fetch errors

  useEffect(() => {
    const fetchCandidateData = async () => {
      try {
        setLoading(true);
        const response = await fetch(`http://localhost:5000/candidates/${candidateId}`);
        if (!response.ok) {
          throw new Error('Failed to fetch candidate data');
        }
        const data = await response.json();
        setCandidate(data);
      } catch (error) {
        setError(error.message);
      } finally {
        setLoading(false);
      }
    };

    fetchCandidateData();
  }, [candidateId]); // Fetch data when candidateId changes

  if (loading) {
    return <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '100vh' }}><CircularProgress /></Box>;
  }

  if (error) {
    return <Typography variant="h6" color="error" sx={{ textAlign: 'center', paddingTop: 4 }}>{`Error: ${error}`}</Typography>;
  }

  if (!candidate) {
    return <Typography variant="h6" color="error" sx={{ textAlign: 'center', paddingTop: 4 }}>Candidate not found</Typography>;
  }

  // Helper function to determine if the resume is a PDF or image
  const isPdf = (url) => url && url.endsWith('.pdf');
  const isImage = (url) => url && (url.endsWith('.jpg') || url.endsWith('.jpeg') || url.endsWith('.png') || url.endsWith('.gif'));

  const downloadResume = () => {
    const link = document.createElement('a');
    link.href = candidate.resumeLink;
    link.download = candidate.resumeLink.split('/').pop(); // Use the file name from the URL
    link.click();
  };

  return (
    <Box
      sx={{
        padding: { xs: 2, sm: 3, md: 4 },
        maxWidth: { xs: '100%', sm: '50%', md: '30%' }, // Responsive max width
        width: '100%',
        margin: 'auto',
        boxSizing: 'border-box', // Ensures padding doesn’t affect the overall width
      }}
    >
      <Paper sx={{ padding: { xs: 2, sm: 3 }, borderRadius: 2, boxShadow: 3 }}>
        <Typography variant="h5" sx={{ fontSize: { xs: '1.5rem', sm: '2rem' }, fontWeight: 'bold' }}>
          {candidate.name}
        </Typography>
        <Typography variant="body1" sx={{ marginTop: 1 }}>
          <strong>Email:</strong> {candidate.email}
        </Typography>
        <Typography variant="body1" sx={{ marginTop: 1 }}>
          <strong>Phone:</strong> {candidate.phone}
        </Typography>
        <Typography variant="body1" sx={{ marginTop: 1 }}>
          <strong>Skills:</strong> {candidate.skills}
        </Typography>
        <Typography variant="body1" sx={{ marginTop: 1 }}>
          <strong>Experience:</strong> {candidate.experience}
        </Typography>

        <Box sx={{ marginTop: 2 }}>
          <Typography variant="h6">Resume</Typography>
          {isPdf(candidate.resumeUrl) ? (
            <Box sx={{ marginTop: 1 }}>
              <iframe
                src={candidate.resumeUrl}
                width="100%"
                height="600"
                title="Resume Preview"
                style={{ border: 'none' }}
              />
            </Box>
          ) : isImage(candidate.resumeUrl) ? (
            <Box sx={{ marginTop: 1 }}>
              <img
                src={candidate.resumeUrl}
                alt="Resume Preview"
                width="100%"
                style={{ borderRadius: '8px', boxShadow: '0 4px 10px rgba(0, 0, 0, 0.15)' }}
              />
            </Box>
          ) : (
            <Box sx={{ marginTop: 1 }}>
              <Link
                href={candidate.resumeLink}
                target="_blank"
                rel="noopener noreferrer"
                sx={{ fontWeight: 'bold', display: 'block', marginBottom: 1 }}
              >
                View Resume
              </Link>
              <Button
                variant="contained"
                color="primary"
                onClick={downloadResume}
                sx={{ fontWeight: 'bold' }}
              >
                Download Resume
              </Button>
            </Box>
          )}
        </Box>
      </Paper>

      <Button
        variant="contained"
        color="primary"
        onClick={() => navigate(`/candidates/${jobId}`)}
        sx={{
          position: 'fixed',
          bottom: '20px', // Distance from the bottom of the viewport
          left: '50%',
          transform: 'translateX(-50%)', // Centers the button horizontally
          borderRadius: '12px',
          padding: '10px 20px',
          fontWeight: 'bold',
          boxShadow: '0 4px 10px rgba(0, 0, 0, 0.15)',
          transition: 'all 0.3s ease',
          '&:hover': {
            backgroundColor: 'primary.main',
            boxShadow: '0 6px 15px rgba(0, 0, 0, 0.2)',
            transform: 'scale(1.05)',
          },
        }}
      >
        Back to Candidates
      </Button>
    </Box>
  );
}

export default CandidateDetailPage;
