import { AppBar, Container, Toolbar, Typography, Button, Box, Menu, MenuItem, IconButton } from '@mui/material';
import React, { useContext, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { authContext } from '../api/authContext';

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
    <AppBar position="static">
      <Container maxWidth="xl">
        <Toolbar disableGutters>
          <Typography
            variant="h6"
            noWrap
            component="div"
            sx={{ mr: 2, display: { xs: 'none', md: 'flex' } }}
          >
            {title || 'Formable'}
          </Typography>

          <Box sx={{ flexGrow: 1, display: 'flex', justifyContent: 'flex-end' }}>
            {userState && user ? (
              <>
                <Button color="inherit" onClick={() => navigate('/your-forms')}>
                  Your Forms
                </Button>

                <Button
                  color="inherit"
                  onClick={handleMenuOpen}
                  sx={{ textTransform: 'none' }}
                >
                  {user.firstName}
                </Button>

                <Menu
                  anchorEl={anchorEl}
                  open={Boolean(anchorEl)}
                  onClose={handleMenuClose}
                >
                  <MenuItem onClick={handleLogout}>Logout</MenuItem>
                </Menu>
              </>
            ) : (
              <Button color="inherit" onClick={handleSignIn}>
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