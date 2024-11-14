import React, { useEffect, useState } from 'react';
import NavBar from '../components/NavBar';
import Card from '@mui/material/Card';
import CardContent from '@mui/material/CardContent';
import Typography from '@mui/material/Typography';
import Grid from '@mui/material/Grid';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import IconButton from '@mui/material/IconButton';
import AddIcon from '@mui/icons-material/Add';
import Cookies from 'js-cookie';

const prebuiltForms = [
  {
    title: 'Blank Form',
    fields: [],
  },
  {
    title: 'Contact Info',
    fields: [
      { id: 1, label: 'Name', type: 'text', options: [] },
      { id: 2, label: 'Email', type: 'text', options: [] },
      { id: 3, label: 'Phone Number', type: 'number', options: [] },
    ],
  },
  {
    title: 'Invite for Party',
    fields: [
      { id: 1, label: 'Name', type: 'text', options: [] },
      { id: 2, label: 'Will you attend?', type: 'radio', options: ['Yes', 'No', 'Maybe'] },
      { id: 3, label: 'Number of Guests', type: 'number', options: [] },
    ],
  },
  {
    title: 'Registration for Event',
    fields: [
      { id: 1, label: 'Full Name', type: 'text', options: [] },
      { id: 2, label: 'Email Address', type: 'text', options: [] },
      { id: 3, label: 'Contact Number', type: 'number', options: [] },
      { id: 4, label: 'Select Session', type: 'dropdown', options: ['Morning', 'Afternoon', 'Evening'] },
    ],
  },
  {
    title: 'RSVP',
    fields: [
      { id: 1, label: 'Name', type: 'text', options: [] },
      { id: 2, label: 'Are you attending?', type: 'radio', options: ['Yes', 'No'] },
    ],
  },
];

const Home = () => {
  const [forms, setForms] = useState([]);
  const navigate = useNavigate();
  const userId = Cookies.get('userId');

  useEffect(() => {
    const fetchForms = async () => {
      try {
        const response = await axios.get(`https://form-app-9b6v.onrender.com/form/userForm/${userId}`);
        setForms(response.data);
      } catch (error) {
        console.error('Error fetching forms:', error);
      }
    };
    fetchForms();
  }, []);

  const openForm = (id) => {
    navigate(`/your-form/${id}`);
  };

  const goToCreateForm = (prebuiltForm) => {
    navigate('/create-form', { state: { existingFormData: prebuiltForm } });
  };

  return (
    <>
      <div style={{ padding: '20px' }}>
        <Grid container spacing={2} justifyContent="center">
          {prebuiltForms.map((form, index) => (
            <Grid item xs={12} sm={6} md={4} lg={2} key={index} onClick={() => goToCreateForm(form)}>
              <Card sx={{ cursor: 'pointer' }}>
                <CardContent>
                  <Typography variant="h6" align="center">{form.title}</Typography>
                </CardContent>
              </Card>
            </Grid>
          ))}
        </Grid>

        <Typography variant="h5" style={{ marginTop: '40px', marginBottom: '20px' }}>
          Your Forms
        </Typography>

        <Grid container spacing={2}>
          {forms.map((form) => (
            <Grid item xs={12} sm={6} md={4} key={form._id} onClick={() => openForm(form._id)}>
              <Card>
                <CardContent>
                  <Typography variant="h6">{form.title}</Typography>
                  <Typography variant="body2">Number of fields: {form.fields.length}</Typography>
                </CardContent>
              </Card>
            </Grid>
          ))}
        </Grid>

        <IconButton
          color="primary"
          aria-label="create form"
          onClick={() => goToCreateForm({ title: '', fields: [] })}
          sx={{
            position: 'fixed',
            bottom: '20px',
            right: '20px',
            backgroundColor: 'primary.main',
            color: 'white',
            borderRadius: '50%',
            boxShadow: 3,
            padding: 1.5,
          }}
        >
          <AddIcon />
        </IconButton>
      </div>
    </>
  );
};

export default Home;
