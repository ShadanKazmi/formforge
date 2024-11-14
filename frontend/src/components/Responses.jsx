import React, { useEffect, useState } from 'react';
import { Box, Typography, List, Divider, Paper, Grid } from '@mui/material';
import axios from 'axios';
import { useParams } from 'react-router-dom';

const Responses = () => {
  const { formid } = useParams();
  const [responses, setResponses] = useState([]);

  useEffect(() => {
    const fetchResponses = async () => {
      try {
        const res = await axios.get(`https://form-app-9b6v.onrender.com/form/${formid}/responses`);
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
    <Box sx={{ maxWidth: 900, margin: 'auto', mt: 5, p: 3 }}>
      <Typography
        variant="h4"
        align="center"
        gutterBottom
        sx={{ fontWeight: 'bold', color: 'black', mb: 4 }}
      >
        Form Responses
      </Typography>

      <Grid container spacing={3}>
        {responses.map((response, index) => (
          <Grid item xs={12} sm={6} md={12} key={index}>
            <Paper
              sx={{
                p: 3,
                boxShadow: 3,
                borderRadius: 2,
                backgroundColor: '#f5f5f5',
                borderLeft: `5px solid #1976d2`,
              }}
            >
              <Typography
                variant="h6"
                sx={{ mb: 1, color: 'black', fontWeight: 'bold' }}
              >
                Submitted by: <span style={{ fontWeight: 500 }}>{response.email}</span>
              </Typography>
              <Typography variant="body2" color="textSecondary" sx={{ mb: 2 }}>
                Submitted on: {new Date(response.submittedAt).toLocaleString()}
              </Typography>

              <Divider sx={{ my: 2 }} />

              {response.answers.map((answer, idx) => (
                <Box key={idx} sx={{ mb: 2 }}>
                  <Typography variant="subtitle1" sx={{ fontWeight: 'bold', color: '#1976d2' }}>
                    {answer.label}:
                  </Typography>

                  {answer.options && answer.options.length > 0 && (
                    <Typography variant="body2" color="textSecondary" sx={{ mb: 1 }}>
                      {answer.options.join(' | ')}
                    </Typography>
                  )}

                  <Box
                    sx={{
                      p: 2,
                      backgroundColor: '#e3f2fd',
                      borderRadius: 1,
                      color: 'text.primary',
                      fontWeight: '500',
                    }}
                  >
                    {typeof answer.answer === 'object' && !Array.isArray(answer.answer) && answer.answer !== null ? (
                      <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 1 }}>
                        <Typography variant="body2" sx={{ fontWeight: 'bold' }}>
                          Selected options:
                        </Typography>
                        {Object.keys(answer.answer)
                          .filter((key) => answer.answer[key])
                          .map((key) => (
                            <Box
                              key={key}
                              sx={{
                                backgroundColor: '#bbdefb',
                                p: 1,
                                borderRadius: 2,
                                boxShadow: 1,
                                color: '#1976d2',
                                fontSize: '0.875rem',
                              }}
                            >
                              {key}
                            </Box>
                          ))}
                      </Box>
                    ) : (
                      <Typography variant="body1">{answer.answer}</Typography>
                    )}
                  </Box>
                </Box>
              ))}
            </Paper>
          </Grid>
        ))}
      </Grid>
    </Box>
  );
};

export default Responses;
