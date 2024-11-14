import React, { useEffect, useState } from 'react';
import { Box, Typography, TextField, Checkbox, Radio, Select, MenuItem, FormControl, InputLabel, Button } from '@mui/material';
import NavBar from '../components/NavBar';
import { useParams } from 'react-router-dom';
import axios from 'axios';

const Form = () => {
  const { formid } = useParams();
  const [form, setForm] = useState(null);
  const [responses, setResponses] = useState({});
  const [email, setEmail] = useState('');
  const [emailError, setEmailError] = useState(false);

  useEffect(() => {
    const fetchForm = async () => {
      try {
        const res = await axios.get(`https://form-app-9b6v.onrender.com/form/${formid}`);
        setForm(res.data);
      } catch (error) {
        console.error('Error fetching form:', error);
      }
    };
    fetchForm();
  }, [formid]);

  const handleFieldChange = (fieldId, value) => {
    setResponses(prev => ({ ...prev, [fieldId]: value }));
  };

  const handleSubmit = async () => {
    if (!email) {
      setEmailError(true);
      return;
    }

    try {
      const answerData = Object.keys(responses).map(fieldId => ({
        fieldId,
        answer: responses[fieldId],
      }));
      await axios.post(`https://form-app-9b6v.onrender.com/form/${formid}/save`, 
        { email: email, answers: answerData },
        { headers: { 'Content-Type': 'application/json' } }
      );
      alert('Form submitted successfully!');
    } catch (error) {
      console.error('Error submitting form:', error);
      alert('Error submitting form. Please try again.');
    }
  };

  if (!form || !form.fields || form.fields.length === 0) {
    return <Typography variant="h6" align="center">No form data available</Typography>;
  }

  return (
    <Box sx={{
      maxWidth: 600,
      margin: 'auto',
      padding: 3,
      boxShadow: 4,
      borderRadius: 3,
      backgroundColor: '#fff',
      border: '1px solid #ddd'
    }}>
      <Typography variant="h4" gutterBottom align="center" sx={{ color: 'black', fontWeight: 'bold' }}>
        {form.title || 'Untitled Form'}
      </Typography>

      <TextField
        variant="outlined"
        fullWidth
        label="Email"
        value={email}
        onChange={(e) => setEmail(e.target.value)}
        error={emailError}
        helperText={emailError ? 'Email is required' : ''}
        sx={{
          marginBottom: 3,
          backgroundColor: '#f7f7f7',
          borderRadius: 1,
          '& .MuiOutlinedInput-root': {
            '& fieldset': { borderColor: '#1976d2' },
            '&:hover fieldset': { borderColor: '#1976d2' },
            '&.Mui-focused fieldset': { borderColor: '#1976d2' },
          },
        }}
      />

      {form.fields.map((field) => (
        <Box key={field._id} sx={{ marginBottom: 3 }}>
          <Typography variant="h6" sx={{ marginBottom: 1, color: '#333', fontWeight: 'bold' }}>
            {field.label}
          </Typography>

          {field.type === 'text' && (
            <TextField
              variant="outlined"
              fullWidth
              placeholder="Your answer"
              onChange={(e) => handleFieldChange(field._id, e.target.value)}
              sx={{
                '& .MuiOutlinedInput-root': {
                  '& fieldset': { borderColor: '#1976d2' },
                  '&:hover fieldset': { borderColor: '#1976d2' },
                  '&.Mui-focused fieldset': { borderColor: '#1976d2' },
                },
              }}
            />
          )}

          {field.type === 'number' && (
            <TextField
              variant="outlined"
              fullWidth
              type="number"
              placeholder="Enter a number"
              onChange={(e) => handleFieldChange(field._id, e.target.value)}
              sx={{
                '& .MuiOutlinedInput-root': {
                  '& fieldset': { borderColor: '#1976d2' },
                  '&:hover fieldset': { borderColor: '#1976d2' },
                  '&.Mui-focused fieldset': { borderColor: '#1976d2' },
                },
              }}
            />
          )}

          {field.type === 'checkbox' && (
            <Box>
              {field.options.map((option, index) => (
                <Box key={index} sx={{ display: 'flex', alignItems: 'center' }}>
                  <Checkbox
                    onChange={(e) =>
                      handleFieldChange(field._id, {
                        ...responses[field._id],
                        [option]: e.target.checked,
                      })
                    }
                  />
                  <Typography sx={{ color: '#333' }}>{option}</Typography>
                </Box>
              ))}
            </Box>
          )}

          {field.type === 'radio' && (
            <Box>
              {field.options.map((option, index) => (
                <Box key={index} sx={{ display: 'flex', alignItems: 'center' }}>
                  <Radio
                    onChange={() => handleFieldChange(field._id, option)}
                    checked={responses[field._id] === option}
                  />
                  <Typography sx={{ color: '#333' }}>{option}</Typography>
                </Box>
              ))}
            </Box>
          )}

          {field.type === 'dropdown' && (
            <FormControl fullWidth variant="outlined" sx={{ marginBottom: 3 }}>
              <InputLabel>{field.label}</InputLabel>
              <Select
                value={responses[field._id] || ''}
                onChange={(e) => handleFieldChange(field._id, e.target.value)}
                sx={{
                  '& .MuiOutlinedInput-root': {
                    '& fieldset': { borderColor: '#1976d2' },
                    '&:hover fieldset': { borderColor: '#1976d2' },
                    '&.Mui-focused fieldset': { borderColor: '#1976d2' },
                  },
                }}
              >
                {field.options.map((option, index) => (
                  <MenuItem key={index} value={option}>
                    {option}
                  </MenuItem>
                ))}
              </Select>
            </FormControl>
          )}
        </Box>
      ))}

      <Button
        variant="contained"
        color="primary"
        fullWidth
        onClick={handleSubmit}
        sx={{
          marginTop: 3,
          padding: '12px',
          fontWeight: 'bold',
          backgroundColor: '#1976d2',
          '&:hover': { backgroundColor: '#1565c0' },
        }}
      >
        Submit
      </Button>
    </Box>
  );
};

export default Form;
