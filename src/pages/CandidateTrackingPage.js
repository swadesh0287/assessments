import React, { useState, useEffect } from 'react';
import { Link, useParams } from 'react-router-dom';
import { Table, TableBody, TableCell, TableContainer, TableHead, TableRow, Paper, Button, MenuItem, Select, FormControl, InputLabel, Box, Grid, Typography, Dialog, DialogActions, DialogContent, DialogTitle } from '@mui/material';
import axios from 'axios';

function CandidateTrackingPage() {
  const { jobId } = useParams();

  // State to store the candidates data
  const [candidates, setCandidates] = useState([]);
  const [loading, setLoading] = useState(true);  // To show loading state
  const [error, setError] = useState('');  // To store error message if fetching fails

  // State for dialog box visibility and selected candidate's information
  const [openDialog, setOpenDialog] = useState(false);
  const [selectedCandidate, setSelectedCandidate] = useState(null);
  const [newStatus, setNewStatus] = useState('');

  // Fetch candidates data from the API
  useEffect(() => {
    const fetchCandidates = async () => {
      try {
        const response = await axios.get(`http://localhost:5000/applicants?jobId=${jobId}`);
        setCandidates(response.data);
        setLoading(false);
      } catch (err) {
        setError('Failed to fetch candidates');
        setLoading(false);
      }
    };

    fetchCandidates();
  }, [jobId]);

  // Function to handle status change
  const handleStatusChange = (id, newStatus) => {
    const updatedCandidates = candidates.map(candidate =>
      candidate.id === id ? { ...candidate, status: newStatus } : candidate
    );
    setCandidates(updatedCandidates);
  };

  // Open the dialog with selected candidate
  const handleOpenDialog = (candidate) => {
    setSelectedCandidate(candidate);
    setNewStatus(candidate.status); // Set current status as default
    setOpenDialog(true);
  };

  // Close the dialog
  const handleCloseDialog = () => {
    setOpenDialog(false);
  };

  // Save the new status for the selected candidate
  const handleSaveStatus = () => {
    if (selectedCandidate) {
      handleStatusChange(selectedCandidate.id, newStatus);
      setOpenDialog(false);
    }
  };

  if (loading) return <Typography>Loading...</Typography>;
  if (error) return <Typography color="error">{error}</Typography>;

  return (
    <Box sx={{ padding: 2 }}>
      <Typography variant="h5" gutterBottom>
        Candidate Tracking for Job {jobId}
      </Typography>
      
      <Grid container spacing={2}>
        <Grid item xs={12}>
          <TableContainer component={Paper}>
            <Table>
              <TableHead>
                <TableRow>
                  <TableCell>Candidate Name</TableCell>
                  <TableCell>Resume</TableCell>
                  <TableCell>Application Date</TableCell>
                  <TableCell>Status</TableCell>
                  <TableCell>Actions</TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {candidates.map((candidate) => (
                  <TableRow key={candidate.id}>
                    <TableCell>
                      <Link to={`/job/${jobId}/candidate/${candidate.id}`} style={{ textDecoration: 'none' }}>
                        {candidate.name}
                      </Link>
                    </TableCell>
                    <TableCell>
                      <a href={candidate.resumeLink} target="_blank" rel="noopener noreferrer">
                        View Resume
                      </a>
                    </TableCell>
                    <TableCell>{candidate.date}</TableCell>
                    <TableCell>{candidate.status}</TableCell>
                    <TableCell>
                      <Button
                        onClick={() => handleOpenDialog(candidate)}
                        variant="outlined"
                        color="primary"
                      >
                        Update Status
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
  );
}

export default CandidateTrackingPage;
