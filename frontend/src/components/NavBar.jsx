import { AppBar, Container, Toolbar, Typography, Button, Box, Menu, MenuItem, IconButton } from '@mui/material';
import React, { useContext, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { authContext } from '../api/authContext';
import logo from '../assets/icon.png';

const NavBar = ({ title }) => {
  const { userState, user, logout } = useContext(authContext);
  const navigate = useNavigate();
  
  const [anchorEl, setAnchorEl] = useState(null);

  const handleSignIn = () => {
    navigate('/auth');
  };

  const handleMenuOpen = (event) => {
    setAnchorEl(event.currentTarget);
  };

  const handleMenuClose = () => {
    setAnchorEl(null);
  };

  const handleLogout = () => {
    logout();
    handleMenuClose();
  };

  return (
    <AppBar position="sticky" sx={{ background: 'linear-gradient(to right,  #0d47a1, #1976d2)', boxShadow: 3 }}>
      <Container maxWidth="xl">
        <Toolbar disableGutters>
          <IconButton edge="start" onClick={() => navigate('/')}>
            <img src={logo} alt="logo" style={{ width: '15rem', height:'100%'  }} />
          </IconButton>

          <Box sx={{ flexGrow: 1, display: 'flex', justifyContent: 'flex-end', alignItems: 'center' }}>
            <Typography variant="h6" sx={{ color: 'white', fontWeight: 'bold', letterSpacing: 1, marginRight: 2 }}>
              {title}
            </Typography>
            {userState && user ? (
              <>
                <Button 
                  color="inherit" 
                  sx={{
                    textTransform: 'none', 
                    fontWeight: '600', 
                    letterSpacing: '1px', 
                    padding: '8px 16px', 
                    borderRadius: '8px', 
                    '&:hover': { 
                      backgroundColor: '#1976d2', 
                      boxShadow: '0 4px 6px rgba(0, 0, 0, 0.2)',
                      transform: 'scale(1.05)',
                    }
                  }}
                  onClick={() => navigate('/')}
                >
                  Your Forms
                </Button>

                <Button
                  color="inherit"
                  onClick={handleMenuOpen}
                  sx={{
                    textTransform: 'none', 
                    fontWeight: '600', 
                    letterSpacing: '1px', 
                    padding: '8px 16px', 
                    borderRadius: '8px', 
                    display: 'flex', 
                    alignItems: 'center', 
                    '&:hover': { 
                      backgroundColor: '#1976d2', 
                      boxShadow: '0 4px 6px rgba(0, 0, 0, 0.2)', 
                      transform: 'scale(1.05)',
                    }
                  }}
                >
                  <Typography variant="body1" sx={{ color: 'white' }}>Hi {user.firstName}</Typography>
                </Button>

                <Menu
                  anchorEl={anchorEl}
                  open={Boolean(anchorEl)}
                  onClose={handleMenuClose}
                  MenuListProps={{ sx: { padding: 0 } }}
                >
                  <MenuItem onClick={handleLogout} sx={{ color: 'red', fontWeight: 'bold' }}>
                    Logout
                  </MenuItem>
                </Menu>
              </>
            ) : (
              <Button
                color="inherit"
                onClick={handleSignIn}
                sx={{
                  textTransform: 'none', 
                  fontWeight: '600', 
                  letterSpacing: '1px', 
                  padding: '8px 16px', 
                  borderRadius: '8px', 
                  '&:hover': { 
                    backgroundColor: '#1976d2', 
                    boxShadow: '0 4px 6px rgba(0, 0, 0, 0.2)', 
                    transform: 'scale(1.05)',
                  }
                }}
              >
                Sign In
              </Button>
            )}
          </Box>
        </Toolbar>
      </Container>
    </AppBar>
  );
};

export default NavBar;
