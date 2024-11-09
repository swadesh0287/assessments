import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { Paper, Typography, Button, TextField, Box, Link, CircularProgress } from '@mui/material';
import { useTheme } from '@mui/material/styles';

function CandidateDetailPage() {
  const { jobId, candidateId } = useParams();
  const navigate = useNavigate();
  const theme = useTheme();

  const [candidate, setCandidate] = useState(null); // Initially null while data is being fetched
  const [status, setStatus] = useState('');
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
        setStatus(data.status); // Set the initial status to the fetched candidate's status
      } catch (error) {
        setError(error.message);
      } finally {
        setLoading(false);
      }
    };

    fetchCandidateData();
  }, [candidateId]); // Fetch data when candidateId changes

  const handleStatusChange = (e) => {
    setStatus(e.target.value);
  };

  const handleSaveStatus = async () => {
    try {
      const response = await fetch(`http://localhost:5000/candidates/${candidateId}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ status }),
      });

      if (!response.ok) {
        throw new Error('Failed to update status');
      }

      console.log(`Updated Status for Candidate ${candidateId}: ${status}`);
    } catch (error) {
      console.error('Error updating status:', error);
    }
  };

  if (loading) {
    return <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '100vh' }}><CircularProgress /></Box>;
  }

  if (error) {
    return <Typography variant="h6" color="error" sx={{ textAlign: 'center', paddingTop: 4 }}>{`Error: ${error}`}</Typography>;
  }

  if (!candidate) {
    return <Typography variant="h6" color="error" sx={{ textAlign: 'center', paddingTop: 4 }}>Candidate not found</Typography>;
  }

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
          <Link href={candidate.resumeUrl} target="_blank" rel="noopener noreferrer" sx={{ fontWeight: 'bold', display: 'block', marginTop: 1 }}>
            Download Resume
          </Link>
        </Box>

        <Box sx={{ marginTop: 2 }}>
          <Typography variant="h6">Status</Typography>
          <TextField
  select
  value={status}
  onChange={handleStatusChange}
  label="Status"
  SelectProps={{
    native: true,
  }}
  sx={{
    marginTop: 1,
    width: { xs: '100%', sm: '70%', md: '70%' }, // Adjust width based on screen size
    '& .MuiInputBase-root': {
      padding: theme.spacing(1),
    },
  }}
>
  <option value="Under Review">Under Review</option>
  <option value="Interview Scheduled">Interview Scheduled</option>
  <option value="Hired">Hired</option>
  <option value="Rejected">Rejected</option>
</TextField>

        </Box>

        <Box sx={{ marginTop: 2 }}>
        <Button
  variant="contained"
  color="primary"
  onClick={handleSaveStatus}
  sx={{
    padding: '8px 16px', // Reduced padding for a smaller button
    fontSize: '1rem',
    width: { xs: '100%', sm: 'auto' }, // Full width on extra-small screens, auto width on larger screens
    display: 'block',
    margin: 'auto 0', // Centers the button
  }}
>
  Save Status
</Button>

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
