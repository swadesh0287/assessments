import React, { useState, useEffect } from 'react';
import { Link, useParams,useNavigate  } from 'react-router-dom';
import { Table, TableBody, TableCell, TableContainer, TableHead, TableRow, Paper, Button, MenuItem, Select, FormControl, InputLabel, Box, Grid, Typography, Dialog, DialogActions, DialogContent, DialogTitle } from '@mui/material';
import axios from 'axios';
import '@fontsource/poppins'; 
import { Edit as EditIcon } from '@mui/icons-material';

function CandidateTrackingPage() {
  const { jobId } = useParams();
  const navigate = useNavigate();

  const [candidates, setCandidates] = useState([]);
  const [loading, setLoading] = useState(true); 
  const [error, setError] = useState('');  

  const [openDialog, setOpenDialog] = useState(false);
  const [selectedCandidate, setSelectedCandidate] = useState(null);
  const [newStatus, setNewStatus] = useState('');

  useEffect(() => {
    const fetchCandidates = async () => {
      try {
        const response = await axios.get(`https://assessments-tau.vercel.app//applicants?jobId=${jobId}`);
        setCandidates(response.data);
        setLoading(false);
      } catch (err) {
        setError('Failed to fetch candidates');
        setLoading(false);
      }
    };

    fetchCandidates();
  }, [jobId]);

  const handleStatusChange = (id, newStatus) => {
    const updatedCandidates = candidates.map(candidate =>
      candidate.id === id ? { ...candidate, status: newStatus } : candidate
    );
    setCandidates(updatedCandidates);
  };

  const handleOpenDialog = (candidate) => {
    setSelectedCandidate(candidate);
    setNewStatus(candidate.status); 
    setOpenDialog(true);
  };

  const handleCloseDialog = () => {
    setOpenDialog(false);
  };

  const handleSaveStatus = () => {
    if (selectedCandidate) {
      handleStatusChange(selectedCandidate.id, newStatus);
      setOpenDialog(false);
    }
  };

  if (loading) return <Typography>Loading...</Typography>;
  if (error) return <Typography color="error">{error}</Typography>;

  return (
    <>
    <Typography
  variant="h4"
  sx={{
    textAlign: 'center',
    marginBottom: 2,
    fontWeight: '600',
    fontSize: { xs: '1.5rem', sm: '2rem', md: '2.5rem' }, 
    color: '#34495e', 
    textTransform: 'uppercase', 
    letterSpacing: 2,
    textShadow: '2px 2px 6px rgba(0, 0, 0, 0.1)', 
    fontFamily: '"Poppins", sans-serif', 
  }}
>
        Candidate Tracking for Job {jobId}
      </Typography>
    
    
    <Box sx={{ padding: 2, display: 'flex', justifyContent: 'center' }}>

      <Grid container spacing={2}>
        <Grid item xs={12}>
          <TableContainer component={Paper} sx={{ width: '80%', margin: '0 auto' }}>
            <Table>
              <TableHead sx={{ backgroundColor: '#1976d2' }}>
                <TableRow>
                  <TableCell sx={{ color: 'white' }}>Candidate Name</TableCell>
                  <TableCell sx={{ color: 'white' }}>Resume</TableCell>
                  <TableCell sx={{ color: 'white' }}>Application Date</TableCell>
                  <TableCell sx={{ color: 'white' }}>Status</TableCell>
                  <TableCell sx={{ color: 'white' }}>Actions</TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {candidates.map((candidate) => (
                  <TableRow key={candidate.id} sx={{ '&:hover': { backgroundColor: '#f5f5f5' } }}>
                    <TableCell>
                      <Link to={`/job/${jobId}/candidate/${candidate.id}`} style={{ textDecoration: 'none' }}>
                        {candidate.name}
                      </Link>
                    </TableCell>
                    <TableCell>
                    <Link
                href={candidate.resumeLink}
                target="_blank"
                rel="noopener noreferrer"
                sx={{ fontWeight: 'bold', display: 'block', marginBottom: 1 }}
              >
                View Resume
              </Link>
                    </TableCell>
                    <TableCell>{candidate.date}</TableCell>
                    <TableCell>{candidate.status}</TableCell>
                    <TableCell>
  <Button
    onClick={() => handleOpenDialog(candidate)}
    variant="outlined"
    color="primary"
    sx={{
      minWidth: '0', 
      padding: '6px',
      borderRadius: '50%',
    }}
  >
    <EditIcon />
  </Button>
</TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </TableContainer>
        </Grid>
      </Grid>

      {/* Dialog to update status */}
      <Dialog open={openDialog} onClose={handleCloseDialog}>
        <DialogTitle>Update Status</DialogTitle>
        <DialogContent>
          <FormControl fullWidth variant="outlined">
            <InputLabel>Status</InputLabel>
            <Select
              value={newStatus}
              onChange={(e) => setNewStatus(e.target.value)}
              label="Status"
            >
              <MenuItem value="Under Review">Under Review</MenuItem>
              <MenuItem value="Interview Scheduled">Interview Scheduled</MenuItem>
              <MenuItem value="Hired">Hired</MenuItem>
              <MenuItem value="Rejected">Rejected</MenuItem>
            </Select>
          </FormControl>
        </DialogContent>
        <DialogActions>
          <Button onClick={handleCloseDialog} color="primary">
            Cancel
          </Button>
          <Button onClick={handleSaveStatus} color="primary">
            Save
          </Button>
        </DialogActions>
      </Dialog>

      
    </Box>
    <Button
  variant="contained"
  color="primary"
  onClick={() => navigate(`/jobs`)}
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
  Back to Jobs
</Button>

    </>
  );
}

export default CandidateTrackingPage;
