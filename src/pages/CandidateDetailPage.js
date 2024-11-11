import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { Paper, Typography, Button, Box, Link, CircularProgress } from '@mui/material';

function CandidateDetailPage() {
  const { jobId, candidateId } = useParams();
  const navigate = useNavigate();

  const [candidate, setCandidate] = useState(null); 
  const [loading, setLoading] = useState(true); 
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchCandidateData = async () => {
      try {
        setLoading(true);
        const response = await fetch(`https://assessments-tau.vercel.app//candidates/${candidateId}`);
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
  }, [candidateId]); 
  if (loading) {
    return <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '100vh' }}><CircularProgress /></Box>;
  }

  if (error) {
    return <Typography variant="h6" color="error" sx={{ textAlign: 'center', paddingTop: 4 }}>{`Error: ${error}`}</Typography>;
  }

  if (!candidate) {
    return <Typography variant="h6" color="error" sx={{ textAlign: 'center', paddingTop: 4 }}>Candidate not found</Typography>;
  }

  const isPdf = (url) => url && url.endsWith('.pdf');
  const isImage = (url) => url && (url.endsWith('.jpg') || url.endsWith('.jpeg') || url.endsWith('.png') || url.endsWith('.gif'));

  const downloadResume = () => {
    const link = document.createElement('a');
    link.href = candidate.resumeLink;
    link.download = candidate.resumeLink.split('/').pop(); 
    link.click();
  };

  return (
    <Box
      sx={{
        padding: { xs: 2, sm: 3, md: 4 },
        maxWidth: { xs: '100%', sm: '50%', md: '30%' }, 
        width: '100%',
        margin: 'auto',
        boxSizing: 'border-box', 
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
          bottom: '20px', 
          left: '50%',
          transform: 'translateX(-50%)', 
          borderRadius: '12px',
          padding: '10px 20px',
          fontWeight: 'bold',
          boxShadow: '0 4px 10px rgba(0, 0, 0, 0.15)',
          transition: 'all 0.3s ease',
          '&:hover': {
            backgroundColor: 'primary.main',
            boxShadow: '0 6px 15px rgba(0, 0, 0, 0.2)',
           
          },
        }}
      >
        Back to Candidates
      </Button>
    </Box>
  );
}

export default CandidateDetailPage;
