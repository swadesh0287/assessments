import React, { useState, useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { Table, TableBody, TableCell, TableContainer, TableHead, TableRow, Paper, Button, TextField, Dialog, DialogActions, DialogContent, DialogTitle, Box, Typography } from '@mui/material';
import EditIcon from '@mui/icons-material/Edit';
import DeleteIcon from '@mui/icons-material/Delete';
import VisibilityIcon from '@mui/icons-material/Visibility';
import '@fontsource/poppins'; 
import { fetchJobs, addJob, updateJob, deleteJob } from '../redux/slices/jobSlice';

function JobPostingsPage() {
  const navigate = useNavigate();
  const location = useLocation();  
  const dispatch = useDispatch();
  const jobs = useSelector((state) => state.jobs.jobs);

  const [open, setOpen] = useState(false);
  const [editingJob, setEditingJob] = useState(null);
  const [newJob, setNewJob] = useState({ title: '', description: '', applicants: 0 });

  useEffect(() => {
    dispatch(fetchJobs());
  }, [dispatch]);

  const handleDeleteJob = (id) => {
    dispatch(deleteJob(id));
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
      dispatch(updateJob({ id: editingJob.id, updatedJob: newJob }));
    } else {
      dispatch(addJob(newJob));
    }
    setOpen(false);
  };

  return (
    <>
      <div style={{ marginBottom: '20px' }}>
        <Typography variant="h4" sx={{ textAlign: 'center', marginBottom: 2, fontWeight: '600', fontSize: { xs: '1.5rem', sm: '2rem', md: '2.5rem' }, color: '#34495e', textTransform: 'uppercase', letterSpacing: 2, textShadow: '2px 2px 6px rgba(0, 0, 0, 0.1)', fontFamily: '"Poppins", sans-serif' }}>
          JOBS LIST
        </Typography>
        <Box sx={{ width: '80%', margin: '0 auto' }}>
          <Button variant="contained" color="primary" onClick={() => handleOpen()} sx={{ margin: 2, borderRadius: '12px', padding: '10px 20px', fontWeight: 'bold', boxShadow: '0 4px 10px rgba(0, 0, 0, 0.15)', transition: 'all 0.3s ease', '&:hover': { backgroundColor: 'primary.main', boxShadow: '0 6px 15px rgba(0, 0, 0, 0.2)', transform: 'scale(1.05)' } }}>
            Add New Job
          </Button>
          {location.pathname !== '/' && (
            <Button variant="contained" color="primary" onClick={() => navigate(`/`)} sx={{ margin: 2, borderRadius: '12px', padding: '10px 20px', fontWeight: 'bold', boxShadow: '0 4px 10px rgba(0, 0, 0, 0.15)', transition: 'all 0.3s ease', '&:hover': { backgroundColor: 'primary.main', boxShadow: '0 6px 15px rgba(0, 0, 0, 0.2)', transform: 'scale(1.05)' } }}>
              Back to Home
            </Button>
          )}
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
                  <TableRow key={job.id} sx={{ '&:hover': { backgroundColor: '#f5f5f5' } }}>
                    <TableCell sx={{ textAlign: 'center' }}>{job.title}</TableCell>
                    <TableCell sx={{ textAlign: 'center' }}>{job.description}</TableCell>
                    <TableCell sx={{ textAlign: 'center' }}>{job.applicants}</TableCell>
                    <TableCell sx={{ display: 'flex', justifyContent: 'center' }}>
                      <Button variant="outlined" color="primary" onClick={() => handleOpen(job)} sx={{ marginRight: 1 }} startIcon={<EditIcon />} />
                      <Button variant="outlined" color="secondary" onClick={() => handleDeleteJob(job.id)} startIcon={<DeleteIcon />} />
                      <Link to={`/candidates/${job.id}`}><VisibilityIcon sx={{ color: '#3f51b5', cursor: 'pointer', marginLeft: 1 }} /></Link>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </TableContainer>
        </Box>
      </div>

      <Dialog open={open} onClose={handleClose}>
        <DialogTitle>{editingJob ? 'Edit Job' : 'Add Job'}</DialogTitle>
        <DialogContent>
          <TextField autoFocus margin="dense" label="Title" type="text" fullWidth variant="outlined" value={newJob.title} onChange={(e) => setNewJob({ ...newJob, title: e.target.value })} />
          <TextField margin="dense" label="Description" type="text" fullWidth multiline rows={4} variant="outlined" value={newJob.description} onChange={(e) => setNewJob({ ...newJob, description: e.target.value })} />
          <TextField margin="dense" label="Applicants" type="number" fullWidth variant="outlined" value={newJob.applicants} onChange={(e) => setNewJob({ ...newJob, applicants: Number(e.target.value) })} />
        </DialogContent>
        <DialogActions>
          <Button onClick={handleClose} color="primary">Cancel</Button>
          <Button onClick={handleSaveJob} color="primary">{editingJob ? 'Update' : 'Add'}</Button>
        </DialogActions>
      </Dialog>
    </>
  );
}

export default JobPostingsPage;
