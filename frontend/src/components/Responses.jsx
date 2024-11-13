import React, { useEffect, useState } from 'react';
import { Box, Typography, List, ListItem, Divider, Paper } from '@mui/material';
import axios from 'axios';
import { useParams } from 'react-router-dom';

const Responses = () => {
  const { formid } = useParams();
  const [responses, setResponses] = useState([]);

  useEffect(() => {
    const fetchResponses = async () => {
      try {
        const res = await axios.get(`http://localhost:8000/form/${formid}/responses`);
        setResponses(res.data);
      } catch (error) {
        console.error('Error fetching responses:', error);
      }
    };
    fetchResponses();
  }, [formid]);

  if (!responses.length) {
    return (
      <Typography variant="h6" align="center" color="textSecondary" sx={{ mt: 5 }}>
        No responses available
      </Typography>
    );
  }

  return (
    <Box sx={{ maxWidth: 800, margin: 'auto', mt: 5, p: 2 }}>
      <Typography variant="h4" align="center" gutterBottom sx={{ fontWeight: 'bold', mb: 3 }}>
        Form Responses
      </Typography>
      <List>
        {responses.map((response, index) => (
          <Paper key={index} sx={{ mb: 3, p: 2, boxShadow: 2 }}>
            <Typography variant="h6" sx={{ mb: 1, color: 'primary.main' }}>
              Submitted by: <span style={{ fontWeight: 500 }}>{response.email}</span>
            </Typography>
            <Typography variant="body2" color="textSecondary" sx={{ mb: 2 }}>
              Submitted on: {new Date(response.submittedAt).toLocaleString()}
            </Typography>
            <Divider sx={{ my: 2 }} />
            {response.answers.map((answer, idx) => (
              <Box key={idx} sx={{ mb: 1 }}>
                <Typography variant="subtitle1" sx={{ fontWeight: 'bold' }}>
                  {answer.label}:
                </Typography>
                {answer.options && answer.options.length > 0 && (
                  <Typography variant="body2" color="textSecondary" sx={{ ml: 2, mb: 1 }}>
                    {answer.options.join(' | ')}
                  </Typography>
                )}
                <Typography variant="body1" sx={{ ml: 2, color: 'text.primary', backgroundColor: '#f9f9f9', p: 1, borderRadius: 1 }}>
                  {answer.answer}
                </Typography>
              </Box>
            ))}
          </Paper>
        ))}
      </List>
    </Box>
  );
};

export default Responses;
