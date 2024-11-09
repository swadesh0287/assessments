import React, { useState, useEffect } from 'react';
import { Link,useNavigate  } from 'react-router-dom';
import { Table, TableBody, TableCell, TableContainer, TableHead, TableRow, Paper, Button, TextField, Dialog, DialogActions, DialogContent, DialogTitle, Grid, Box, Typography } from '@mui/material';
import axios from 'axios';
import EditIcon from '@mui/icons-material/Edit';
import DeleteIcon from '@mui/icons-material/Delete';
import VisibilityIcon from '@mui/icons-material/Visibility';
import '@fontsource/poppins'; 

function JobPostingsPage() {
  const navigate = useNavigate();
  const [jobs, setJobs] = useState([]);
  const [open, setOpen] = useState(false);
  const [editingJob, setEditingJob] = useState(null);
  const [newJob, setNewJob] = useState({ title: '', description: '', applicants: 0 });

  // Fetch jobs from API
  useEffect(() => {
    axios.get('http://localhost:5000/jobs')
      .then((response) => setJobs(response.data))
      .catch((error) => console.error('Error fetching jobs:', error));
  }, []);

  const handleDeleteJob = (id) => {
    axios.delete(`http://localhost:5000/jobs/${id}`)
      .then(() => {
        setJobs(jobs.filter((job) => job.id !== id));
      })
      .catch((error) => console.error('Error deleting job:', error));
  };

  const handleOpen = (job = null) => {
    if (job) {
      setEditingJob(job);
      setNewJob({ title: job.title, description: job.description, applicants: job.applicants });
    } else {
      setEditingJob(null);
      setNewJob({ title: '', description: '', applicants: 0 });
    }
    setOpen(true);
  };

  const handleClose = () => {
    setOpen(false);
  };

  const handleSaveJob = () => {
    if (editingJob) {
      axios.put(`http://localhost:5000/jobs/${editingJob.id}`, newJob)
        .then((response) => {
          setJobs(
            jobs.map((job) =>
              job.id === editingJob.id ? { ...job, ...newJob } : job
            )
          );
          setOpen(false);
        })
        .catch((error) => console.error('Error saving job:', error));
    } else {
      axios.post('http://localhost:5000/jobs', { ...newJob })
        .then((response) => {
          setJobs([...jobs, { ...newJob, id: response.data.id }]);
          setOpen(false);
        })
        .catch((error) => console.error('Error adding job:', error));
    }
  };

  return (
    <>
    <div>
       <Typography
  variant="h4"
  sx={{
    textAlign: 'center',
    marginBottom: 2,
    fontWeight: '600', // Medium-bold for a clean look
    fontSize: { xs: '1.5rem', sm: '2rem', md: '2.5rem' }, // Responsive font size
    color: '#34495e', // Slightly lighter dark color
    textTransform: 'uppercase', // Stronger look with uppercase
    letterSpacing: 2, // Spacing for a modern touch
    textShadow: '2px 2px 6px rgba(0, 0, 0, 0.1)', // Depth for text
    fontFamily: '"Poppins", sans-serif', // Modern font family
  }}
>
 JOBS LIST
</Typography>



      {/* Centered Table with 80% Width */}
      <Box sx={{ width: '80%', margin: '0 auto' }}>
      <Button
  variant="contained"
  color="primary"
  onClick={() => handleOpen()}
  sx={{
    margin: 2,
    
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
  Add New Job
</Button>
        <TableContainer component={Paper} sx={{ maxWidth: '100%', overflowX: 'auto' }}>
          <Table sx={{ minWidth: 650 }}>
            <TableHead>
              <TableRow>
                <TableCell sx={{ fontWeight: 'bold', backgroundColor: '#3f51b5', color: 'white', textAlign: 'center' }}>Job Title</TableCell>
                <TableCell sx={{ fontWeight: 'bold', backgroundColor: '#3f51b5', color: 'white', textAlign: 'center' }}>Description</TableCell>
                <TableCell sx={{ fontWeight: 'bold', backgroundColor: '#3f51b5', color: 'white', textAlign: 'center' }}>Applicants</TableCell>
                <TableCell sx={{ fontWeight: 'bold', backgroundColor: '#3f51b5', color: 'white', textAlign: 'center' }}>Actions</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {jobs.map((job) => (
                <TableRow
                  key={job.id}
                  sx={{
                    '&:hover': {
                      backgroundColor: '#f5f5f5',
                    },
                  }}
                >
                  <TableCell sx={{ textAlign: 'center' }}>{job.title}</TableCell>
                  <TableCell sx={{ textAlign: 'center' }}>{job.description}</TableCell>
                  <TableCell sx={{ textAlign: 'center' }}>{job.applicants}</TableCell>
                  <TableCell sx={{ display: 'flex', justifyContent: 'center' }}>
                    <Button
                      variant="outlined"
                      color="primary"
                      onClick={() => handleOpen(job)}
                      sx={{ marginRight: 1 }}
                      startIcon={<EditIcon />}
                    >
                      {/* Edit Icon */}
                    </Button>
                    <Button
                      variant="outlined"
                      color="secondary"
                      onClick={() => handleDeleteJob(job.id)}
                      sx={{ marginRight: 1 }}
                      startIcon={<DeleteIcon />}
                    >
                      {/* Delete Icon */}
                    </Button>
                    <Button
                      component={Link}
                      to={`/candidates/${job.id}`}
                      variant="outlined"
                      color="primary"
                      startIcon={<VisibilityIcon />}
                    >
                      {/* View Candidates Icon */}
                    </Button>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </TableContainer>
      </Box>

      {/* Add/Edit Job Modal */}
      <Dialog open={open} onClose={handleClose} fullWidth maxWidth="sm">
        <DialogTitle>{editingJob ? 'Edit Job' : 'Add New Job'}</DialogTitle>
        <DialogContent>
          <Grid container spacing={2}>
            <Grid item xs={12}>
              <TextField
                label="Job Title"
                fullWidth
                value={newJob.title}
                onChange={(e) => setNewJob({ ...newJob, title: e.target.value })}
                sx={{ marginBottom: 2 }}
              />
            </Grid>
            <Grid item xs={12}>
              <TextField
                label="Job Description"
                fullWidth
                value={newJob.description}
                onChange={(e) => setNewJob({ ...newJob, description: e.target.value })}
                sx={{ marginBottom: 2 }}
              />
            </Grid>
            <Grid item xs={12}>
              <TextField
                label="Number of Applicants"
                type="number"
                fullWidth
                value={newJob.applicants}
                onChange={(e) => setNewJob({ ...newJob, applicants: e.target.value })}
                sx={{ marginBottom: 2 }}
              />
            </Grid>
          </Grid>
        </DialogContent>
        <DialogActions>
          <Button onClick={handleClose} color="primary">
            Cancel
          </Button>
          <Button onClick={handleSaveJob} color="primary">
            Save
          </Button>
        </DialogActions>
      </Dialog>
      
    </div>
    
    <Button
  variant="contained"
  color="primary"
  onClick={() => navigate(`/`)}
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
  Back to Home
</Button>
    </>
  );
}

export default JobPostingsPage;
