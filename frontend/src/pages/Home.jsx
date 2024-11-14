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
import ContactMailIcon from '@mui/icons-material/ContactMail';
import EventIcon from '@mui/icons-material/Event';
import CelebrationIcon from '@mui/icons-material/Celebration';
import FormatListBulletedIcon from '@mui/icons-material/FormatListBulleted';
import CheckCircleIcon from '@mui/icons-material/CheckCircle';
import PollIcon from '@mui/icons-material/Poll';
import FeedbackIcon from '@mui/icons-material/Feedback';
import WorkIcon from '@mui/icons-material/Work';

const prebuiltForms = [
  {
    title: 'Blank Form',
    iconType: 'blank',
    fields: [],
  },
  {
    title: 'Contact Info',
    iconType: 'contact',
    fields: [
      { id: 1, label: 'Name', type: 'text', options: [] },
      { id: 2, label: 'Email', type: 'text', options: [] },
      { id: 3, label: 'Phone Number', type: 'number', options: [] },
    ],
  },
  {
    title: 'Invite for Party',
    iconType: 'party',
    fields: [
      { id: 1, label: 'Name', type: 'text', options: [] },
      { id: 2, label: 'Will you attend?', type: 'radio', options: ['Yes', 'No', 'Maybe'] },
      { id: 3, label: 'Number of Guests', type: 'number', options: [] },
    ],
  },
  {
    title: 'Registration for Event',
    iconType: 'event',
    fields: [
      { id: 1, label: 'Full Name', type: 'text', options: [] },
      { id: 2, label: 'Email Address', type: 'text', options: [] },
      { id: 3, label: 'Contact Number', type: 'number', options: [] },
      { id: 4, label: 'Select Session', type: 'dropdown', options: ['Morning', 'Afternoon', 'Evening'] },
    ],
  },
  {
    title: 'RSVP',
    iconType: 'rsvp',
    fields: [
      { id: 1, label: 'Name', type: 'text', options: [] },
      { id: 2, label: 'Are you attending?', type: 'radio', options: ['Yes', 'No'] },
    ],
  },
  {
    title: 'Survey Form',
    iconType: 'survey',
    fields: [
      { id: 1, label: 'Age Group', type: 'dropdown', options: ['18-25', '26-35', '36-45', '46+'] },
      { id: 2, label: 'How satisfied are you with our service?', type: 'radio', options: ['Very Satisfied', 'Satisfied', 'Neutral', 'Dissatisfied'] },
      { id: 3, label: 'Comments', type: 'text', options: [] },
    ],
  },
  {
    title: 'Feedback Form',
    iconType: 'feedback',
    fields: [
      { id: 1, label: 'Name', type: 'text', options: [] },
      { id: 2, label: 'Feedback Type', type: 'dropdown', options: ['Positive', 'Negative', 'Neutral'] },
      { id: 3, label: 'Comments', type: 'text', options: [] },
    ],
  },
  {
    title: 'Job Application',
    iconType: 'job',
    fields: [
      { id: 1, label: 'Full Name', type: 'text', options: [] },
      { id: 2, label: 'Position Applied For', type: 'text', options: [] },
      { id: 3, label: 'Experience (in years)', type: 'number', options: [] },
      { id: 4, label: 'Upload Resume', type: 'file', options: [] },
    ],
  },
];

const iconMap = {
  blank: <FormatListBulletedIcon fontSize="large" />,
  contact: <ContactMailIcon fontSize="large" />,
  party: <CelebrationIcon fontSize="large" />,
  event: <EventIcon fontSize="large" />,
  rsvp: <CheckCircleIcon fontSize="large" />,
  survey: <PollIcon fontSize="large" />,  
  feedback: <FeedbackIcon fontSize="large" />,  
  job: <WorkIcon fontSize="large" />, 
};

const Home = () => {
  const [forms, setForms] = useState([]);
  const navigate = useNavigate();
  const userId = Cookies.get('userId');

  useEffect(() => {
    if (userId) {
      const fetchForms = async () => {
        try {
          const response = await axios.get(`https://form-app-9b6v.onrender.com/form/userForm/${userId}`);
          setForms(response.data);
        } catch (error) {
          console.error('Error fetching forms:', error);
        }
      };
      fetchForms();
    }
  }, [userId]);

  const openForm = (id) => {
    navigate(`/your-form/${id}`);
  };

  const goToCreateForm = (prebuiltForm) => {
    navigate('/create-form', { state: { existingFormData: prebuiltForm } });
  };

  const handleLoginPrompt = () => {
    navigate('/auth');
  };

  return (
    <div style={{ padding: '30px', display:'flex', flexDirection:'column' }}>
      <Typography variant="h5" style={{ marginTop: '40px', marginBottom: '20px' }}>
        Create A New Form
      </Typography>
      <Grid container spacing={2}>
        {prebuiltForms.map((form, index) => (
          <Grid item xs={12} sm={6} md={4} lg={3} key={index}>
            <Card
              onClick={() => goToCreateForm(form)}
              sx={{
                cursor: 'pointer',
                padding: 1,
                textAlign: 'center',
                backgroundColor: '#f3f4f6',
                transition: 'transform 0.2s',
                '&:hover': {
                  transform: 'scale(1.05)',
                  boxShadow: 4,
                },
              }}
            >
              <CardContent>
                <div style={{ fontSize: '2rem', color: '#3f51b5' }}>{iconMap[form.iconType]}</div>
                <Typography variant="h5" component="div" mt={1}>
                  {form.title}
                </Typography>
              </CardContent>
            </Card>
          </Grid>
        ))}
      </Grid>

      <Typography variant="h5" style={{ marginTop: '40px', marginBottom: '20px' }}>
        Your Forms
      </Typography>

      {userId ? (
        <Grid container spacing={2}>
          {forms.map((form) => (
            <Grid item xs={12} sm={6} md={3} key={form._id} onClick={() => openForm(form._id)}>
              <Card sx={{
                cursor: 'pointer',
                padding: 1,
                backgroundColor: '#f3f4f6',
                transition: 'transform 0.2s',
                '&:hover': {
                  transform: 'scale(1.05)',
                  boxShadow: 4,
                },
              }}>
                <CardContent>
                  <Typography variant="h6">{form.title}</Typography>
                  <Typography variant="body2" color="text.secondary">
                    Number of fields: {form.fields.length}
                  </Typography>
                </CardContent>
              </Card>
            </Grid>
          ))}
        </Grid>
      ) : (
        <Typography variant="body1" style={{ color: '#ff1744', textAlign: 'center', marginTop: '20px' }}>
          Please log in to save and manage your forms.
        </Typography>
      )}

      <IconButton
        color="primary"
        aria-label="create form"
        onClick={() => userId ? goToCreateForm({ title: '', fields: [] }) : handleLoginPrompt()}
        sx={{
          position: 'fixed',
          bottom: '20px',
          right: '20px',
          backgroundColor: '#3f51b5',
          color: 'white',
          borderRadius: '50%',
          boxShadow: 3,
          padding: 1.5,
          '&:hover': {
            backgroundColor: '#303f9f',
          },
        }}
      >
        <AddIcon fontSize="large" />
      </IconButton>
    </div>
  );
};

export default Home;
