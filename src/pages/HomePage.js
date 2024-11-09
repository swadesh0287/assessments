// HomePage.js
import React, { useState } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { setSelectedContent } from '../redux/slices/contentSlice';
import {
  Box,
  Drawer,
  IconButton,
  Typography,
  BottomNavigation,
  BottomNavigationAction,
} from '@mui/material';
import WorkIcon from '@mui/icons-material/Work';
import AssessmentIcon from '@mui/icons-material/Assessment';
import MenuIcon from '@mui/icons-material/Menu';
import { useTheme } from '@mui/material/styles';
import useMediaQuery from '@mui/material/useMediaQuery';
import JobPostingsPage from './JobPostingsPage';
import CreateAssessmentPage from './CreateAssessmentPage';

function JobsContent() {
  return (
    <Box sx={{ textAlign: 'center' }}>
      <JobPostingsPage />
    </Box>
  );
}

function AssessmentContent() {
  return (
    <Box>
      <CreateAssessmentPage />
    </Box>
  );
}

function HomePage() {
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('sm'));
  const [isSidebarOpen, setSidebarOpen] = useState(false);
  const [bottomNavValue, setBottomNavValue] = useState(0);

  const selectedContent = useSelector((state) => state.content.selectedContent);
  const dispatch = useDispatch();

  const sidebarItems = [
    { icon: <WorkIcon />, label: 'Jobs', content: 'jobs' },
    { icon: <AssessmentIcon />, label: 'Assessment', content: 'assessment' },
  ];

  const handleContentChange = (content) => {
    dispatch(setSelectedContent(content));
  };

  const Sidebar = () => (
    <Drawer
      variant="permanent"
      sx={{
        display: { xs: 'none', sm: 'flex' },
        width: isSidebarOpen ? 240 : 70,
        flexShrink: 0,
        [`& .MuiDrawer-paper`]: {
          width: isSidebarOpen ? 240 : 70,
          boxSizing: 'border-box',
          background: 'linear-gradient(to bottom, #3a7bd5, #3a6073)',
          color: '#fff',
          borderRadius: '0 10px 10px 0',
          transition: 'width 0.3s ease',
          boxShadow: '0 0 15px rgba(0, 0, 0, 0.3)',
        },
      }}
    >
      <Box sx={{ display: 'flex', flexDirection: 'column', alignItems: 'center', mt: 2 }}>
        <IconButton
          onClick={() => setSidebarOpen(!isSidebarOpen)}
          sx={{ color: '#fff', mb: 3 }}
        >
          <MenuIcon />
        </IconButton>
        {sidebarItems.map((item, index) => (
          <IconButton
            key={index}
            onClick={() => handleContentChange(item.content)}
            sx={{
              display: 'flex',
              flexDirection: isSidebarOpen ? 'row' : 'column',
              alignItems: 'center',
              mt: 2,
              color: '#fff',
              width: '100%',
              borderRadius: 2,
              transition: 'background 0.3s, transform 0.3s',
              '&:hover': {
                backgroundColor: 'rgba(255, 255, 255, 0.1)',
                transform: 'scale(1.05)',
              },
            }}
          >
            {item.icon}
            {isSidebarOpen && (
              <Typography variant="body2" sx={{ ml: 1 }}>
                {item.label}
              </Typography>
            )}
          </IconButton>
        ))}
      </Box>
    </Drawer>
  );

  const BottomNavigationBar = () => (
    <BottomNavigation
      showLabels
      value={bottomNavValue}
      onChange={(event, newValue) => {
        setBottomNavValue(newValue);
        handleContentChange(sidebarItems[newValue].content);
      }}
      sx={{
        display: { xs: 'flex', sm: 'none' },
        position: 'fixed',
        bottom: 0,
        width: '100%',
        background: 'linear-gradient(to right, #3a7bd5, #3a6073)',
        boxShadow: '0 -2px 10px rgba(0, 0, 0, 0.3)',
      }}
    >
      {sidebarItems.map((item, index) => (
        <BottomNavigationAction
          key={index}
          label={item.label}
          icon={item.icon}
          sx={{
            color: '#fff',
            '&.Mui-selected': {
              color: '#ffcc00', // Change color on selection for emphasis
            },
          }}
        />
      ))}
    </BottomNavigation>
  );

  return (
    <Box sx={{ display: 'flex', minHeight: '100vh' }}>
      <Sidebar />

      <Box
        component="main"
        sx={{
          flexGrow: 1,
          padding: 5,
          display: 'flex',
          flexDirection: 'column',
          mt: isMobile ? 8 : 0,
          ml: isSidebarOpen ? 24 : 9,
        }}
      >
        {selectedContent === 'jobs' && <JobsContent />}
        {selectedContent === 'assessment' && <AssessmentContent />}
      </Box>

      {isMobile && <BottomNavigationBar />}
    </Box>
  );
}

export default HomePage;
