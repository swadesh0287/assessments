import React from 'react';
import { useNavigate } from 'react-router-dom';
import { Grid, Card, CardContent, Typography, Box, CardActionArea, IconButton } from '@mui/material';
import WorkIcon from '@mui/icons-material/Work';
import AssessmentIcon from '@mui/icons-material/Assessment';

function HomePage() {
  const navigate = useNavigate();

  const navigateTo = (page) => {
    navigate(`/${page}`);
  };

  return (
    <Box 
      sx={{
        minHeight: '100vh',       // Full screen height
        padding: 5,
        background: 'linear-gradient(to bottom, #e0f7fa, #e8f5e9)',  // Background color or gradient
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'center',
      }}
    >
      <Typography
        variant="h3"
        gutterBottom
        align="center"
        sx={{
          color: '#0d47a1',
          fontSize: { xs: '2.2rem', sm: '2.8rem', md: '3.5rem' },
          fontWeight: 'bold',
          mb: 5,
          textShadow: '1px 1px 8px rgba(0,0,0,0.3)',
        }}
      >
        Welcome to the Hiring Platform
      </Typography>
      <Grid container spacing={4} justifyContent="center">
        {/* Jobs Card */}
        <Grid item xs={12} sm={6} md={4}>
          <Card
            sx={{
              borderRadius: 4,
              boxShadow: 5,
              background: 'linear-gradient(135deg, #64b5f6, #42a5f5)',
              color: 'white',
              '&:hover': {
                boxShadow: '0px 8px 20px rgba(0, 0, 0, 0.3)',
                transform: 'scale(1.05)',
                transition: 'all 0.3s ease',
              },
              cursor: 'pointer',
            }}
            onClick={() => navigateTo('jobs')}
          >
            <CardActionArea>
              <CardContent sx={{ textAlign: 'center' }}>
                <IconButton sx={{ fontSize: { xs: 40, sm: 50 }, color: 'white' }}>
                  <WorkIcon />
                </IconButton>
                <Typography
                  variant="h5"
                  component="h2"
                  gutterBottom
                  sx={{
                    fontWeight: 'bold',
                    fontSize: { xs: '1.6rem', sm: '2rem' },
                  }}
                >
                  Jobs
                </Typography>
                <Typography variant="body2" sx={{ fontSize: { xs: '1rem', sm: '1.1rem' }, opacity: 0.8 }}>
                  Manage job listings
                </Typography>
              </CardContent>
            </CardActionArea>
          </Card>
        </Grid>

        {/* Assessment Card */}
        <Grid item xs={12} sm={6} md={4}>
          <Card
            sx={{
              borderRadius: 4,
              boxShadow: 5,
              background: 'linear-gradient(135deg, #81c784, #66bb6a)',
              color: 'white',
              '&:hover': {
                boxShadow: '0px 8px 20px rgba(0, 0, 0, 0.3)',
                transform: 'scale(1.05)',
                transition: 'all 0.3s ease',
              },
              cursor: 'pointer',
            }}
            onClick={() => navigateTo('assessment')}
          >
            <CardActionArea>
              <CardContent sx={{ textAlign: 'center' }}>
                <IconButton sx={{ fontSize: { xs: 40, sm: 50 }, color: 'white' }}>
                  <AssessmentIcon />
                </IconButton>
                <Typography
                  variant="h5"
                  component="h2"
                  gutterBottom
                  sx={{
                    fontWeight: 'bold',
                    fontSize: { xs: '1.6rem', sm: '2rem' },
                  }}
                >
                  Assessment
                </Typography>
                <Typography variant="body2" sx={{ fontSize: { xs: '1rem', sm: '1.1rem' }, opacity: 0.8 }}>
                  Manage all assessments for jobs
                </Typography>
              </CardContent>
            </CardActionArea>
          </Card>
        </Grid>
      </Grid>
    </Box>
  );
}

export default HomePage;
