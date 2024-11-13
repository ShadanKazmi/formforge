import React, { useState, useContext } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import { authContext } from '../api/authContext';
import {
  TextField,
  Button,
  Typography,
  Container,
  Box,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  FormHelperText,
} from '@mui/material';

const AuthPage = () => {
  const navigate = useNavigate();
  const { login, setUserState, userState } = useContext(authContext);

  const [isSignup, setIsSignup] = useState(true);
  const [signUpForm, setSignUpForm] = useState({
    firstName: '',
    lastName: '',
    gender: '',
    email: '',
    password: '',
  });
  const [loginForm, setLoginForm] = useState({
    email: '',
    password: '',
  });
  const [error, setError] = useState('');

  const handleSignUpChange = (e) => {
    const { name, value } = e.target;
    setSignUpForm({ ...signUpForm, [name]: value });
  };

  const handleLoginChange = (e) => {
    const { name, value } = e.target;
    setLoginForm({ ...loginForm, [name]: value });
  };

  const handleSignUpSubmit = async () => {
    try {
      const formData = new FormData();
      formData.append('firstName', signUpForm.firstName);
      formData.append('lastName', signUpForm.lastName);
      formData.append('gender', signUpForm.gender);
      formData.append('email', signUpForm.email);
      formData.append('password', signUpForm.password);

      const response = await axios.post('https://form-app-9b6v.onrender.com/auth/signup', formData, {
        headers: {
          'Content-Type': 'application/json',
        },
      });
      setUserState('Logged-In');
      if (userState === 'Logged-In') {
        navigate('/');
      }
    } catch (error) {
      console.error('Error signing up:', error);
      setError('Error signing up. Please try again.');
    }
  };

  const handleLoginSubmit = async () => {
    try {
      const response = await axios.post('https://form-app-9b6v.onrender.com/auth/login', loginForm);
      const loggedinToken = response.data.token;
      const userData = {
        userId: response.data.userId,
        firstName: response.data.firstName,
        lastName: response.data.lastName,
        email: response.data.email,
        gender: response.data.gender,
      };

      login(loggedinToken, userData);
      if (userState === 'Logged-In') {
        navigate('/');
      }
    } catch (error) {
      console.error('Error logging in:', error);
      setError('Error logging in. Please check your credentials.');
    }
  };

  const toggleForm = () => {
    setIsSignup(!isSignup);
    setSignUpForm({
      firstName: '',
      lastName: '',
      gender: '',
      email: '',
      password: '',
    });
    setLoginForm({
      email: '',
      password: '',
    });
    setError('');
  };

  return (
    <Container maxWidth="xs">
      <Box mt={5} p={3} boxShadow={3} bgcolor="white" borderRadius={4}>
        <Typography variant="h5" align="center" gutterBottom>
          {isSignup ? 'Sign Up' : 'Login'}
        </Typography>
        <Box component="form" onSubmit={(e) => e.preventDefault()}>
          {isSignup && (
            <>
              <TextField
                label="First Name"
                name="firstName"
                value={signUpForm.firstName}
                onChange={handleSignUpChange}
                fullWidth
                required
                margin="normal"
              />
              <TextField
                label="Last Name"
                name="lastName"
                value={signUpForm.lastName}
                onChange={handleSignUpChange}
                fullWidth
                required
                margin="normal"
              />
              <FormControl fullWidth required margin="normal">
                <InputLabel>Gender</InputLabel>
                <Select
                  name="gender"
                  value={signUpForm.gender}
                  onChange={handleSignUpChange}
                >
                  <MenuItem value="male">Male</MenuItem>
                  <MenuItem value="female">Female</MenuItem>
                  <MenuItem value="other">Other</MenuItem>
                </Select>
              </FormControl>
            </>
          )}
          <TextField
            label="Email"
            type="email"
            name="email"
            value={isSignup ? signUpForm.email : loginForm.email}
            onChange={isSignup ? handleSignUpChange : handleLoginChange}
            fullWidth
            required
            margin="normal"
          />
          <TextField
            label="Password"
            type="password"
            name="password"
            value={isSignup ? signUpForm.password : loginForm.password}
            onChange={isSignup ? handleSignUpChange : handleLoginChange}
            fullWidth
            required
            margin="normal"
          />
          {error && (
            <Typography color="error" variant="body2" align="center" gutterBottom>
              {error}
            </Typography>
          )}
          <Button
            variant="contained"
            color="primary"
            fullWidth
            onClick={isSignup ? handleSignUpSubmit : handleLoginSubmit}
            sx={{ mt: 2, mb: 1 }}
          >
            {isSignup ? 'Sign Up' : 'Login'}
          </Button>
        </Box>
        <Button onClick={toggleForm} color="secondary" fullWidth>
          {isSignup ? 'Already have an account? Login' : "Don't have an account? Sign Up"}
        </Button>
      </Box>
    </Container>
  );
};

export default AuthPage;
