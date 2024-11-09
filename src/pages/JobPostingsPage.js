import React, { useState, useEffect } from 'react';
import { Table, TableBody, TableCell, TableContainer, TableHead, TableRow, Paper, Button, TextField, Dialog, DialogActions, DialogContent, DialogTitle, Grid } from '@mui/material';
import { Link } from 'react-router-dom';
import axios from 'axios';

function JobPostingsPage() {
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
    <div>
      <Button variant="contained" color="primary" onClick={() => handleOpen()} sx={{ margin: 2 }}>
        Add New Job
      </Button>

      {/* Responsive Table */}
      <TableContainer component={Paper} sx={{ maxWidth: '100%', overflowX: 'auto' }}>
        <Table>
          <TableHead>
            <TableRow>
              <TableCell>Job Title</TableCell>
              <TableCell>Description</TableCell>
              <TableCell>Applicants</TableCell>
              <TableCell>Actions</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {jobs.map((job) => (
              <TableRow key={job.id}>
                <TableCell>{job.title}</TableCell>
                <TableCell>{job.description}</TableCell>
                <TableCell>{job.applicants}</TableCell>
                <TableCell>
                  <Button
                    variant="outlined"
                    color="primary"
                    onClick={() => handleOpen(job)}
                    sx={{ marginRight: 1 }}
                  >
                    Edit
                  </Button>
                  <Button
                    variant="outlined"
                    color="secondary"
                    onClick={() => handleDeleteJob(job.id)}
                    sx={{ marginRight: 1 }}
                  >
                    Delete
                  </Button>
                  <Button
                    component={Link}
                    to={`/candidates/${job.id}`}
                    variant="outlined"
                    color="primary"
                  >
                    View Candidates
                  </Button>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </TableContainer>

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
  );
}

export default JobPostingsPage;
