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
    return <CircularProgress />;
  }

  if (error) {
    return <Typography variant="h6" color="error">{`Error: ${error}`}</Typography>;
  }

  if (!candidate) {
    return <Typography variant="h6" color="error">Candidate not found</Typography>;
  }

  return (
    <Box sx={{ padding: { xs: 2, sm: 3, md: 4 }, maxWidth: '900px', margin: 'auto' }}>
      <Paper sx={{ padding: { xs: 2, sm: 3 }, borderRadius: 2 }}>
        <Typography variant="h5" sx={{ fontSize: { xs: '1.5rem', sm: '2rem' } }}>
          {candidate.name}
        </Typography>
        <Typography variant="body1" sx={{ marginTop: 1 }}>
          Email: {candidate.email}
        </Typography>
        <Typography variant="body1" sx={{ marginTop: 1 }}>
          Phone: {candidate.phone}
        </Typography>
        <Typography variant="body1" sx={{ marginTop: 1 }}>
          Skills: {candidate.skills}
        </Typography>
        <Typography variant="body1" sx={{ marginTop: 1 }}>
          Experience: {candidate.experience}
        </Typography>

        <Box sx={{ marginTop: 2 }}>
          <Typography variant="h6">Resume</Typography>
          <Link href={candidate.resumeUrl} target="_blank" rel="noopener noreferrer" sx={{ fontWeight: 'bold' }}>
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
            fullWidth
            SelectProps={{
              native: true,
            }}
            sx={{
              marginTop: 1,
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
          <Button variant="contained" color="primary" onClick={handleSaveStatus} fullWidth sx={{ padding: '10px' }}>
            Save Status
          </Button>
        </Box>
      </Paper>

      <Button sx={{ marginTop: 2, display: 'block', width: '100%' }} variant="outlined" onClick={() => navigate(`/job/${jobId}/candidates`)}>
        Back to Candidates
      </Button>
    </Box>
  );
}

export default CandidateDetailPage;
