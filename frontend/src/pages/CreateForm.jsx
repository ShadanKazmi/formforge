import React, { useContext, useState, useEffect } from 'react';
import {
  Box,
  Paper,
  TextField,
  IconButton,
  Button,
  MenuItem,
  Checkbox,
  Radio,
  Select,
} from '@mui/material';
import AddCircleIcon from '@mui/icons-material/AddCircle';
import DeleteIcon from '@mui/icons-material/Delete';
import { useLocation, useNavigate } from 'react-router-dom';
import axios from 'axios';
import { authContext } from '../api/authContext';
import Cookies from 'js-cookie';

const fieldTypes = [
  { label: 'Text Response', value: 'text' },
  { label: 'Number', value: 'number' },
  { label: 'Checkbox', value: 'checkbox' },
  { label: 'Choice', value: 'radio' },
  { label: 'Dropdown', value: 'dropdown' },
];

const CreateForm = ({ existingFormData: propExistingFormData  }) => {
  const { userState } = useContext(authContext);
  const navigate = useNavigate();
  const location = useLocation();
  const locationExistingFormData = location.state?.existingFormData;
  const existingFormData = locationExistingFormData || propExistingFormData;
  const [fields, setFields] = useState(existingFormData?.fields || []);
  const [title, setTitle] = useState(existingFormData?.title || '');
  const [draggedFieldIndex, setDraggedFieldIndex] = useState(null);
  const userId = Cookies.get('userId');


  useEffect(() => {
    if (existingFormData) {
      setTitle(existingFormData.title);
      setFields(existingFormData.fields);
    }
  }, [existingFormData]);

  const addField = () => {
    setFields([
      ...fields,
      { id: Date.now(), label: '', type: 'text', value: '', options: [] },
    ]);
  };

  const handleLabelChange = (index, event) => {
    const updatedFields = [...fields];
    updatedFields[index].label = event.target.value;
    setFields(updatedFields);
  };

  const handleTypeChange = (index, event) => {
    const updatedFields = [...fields];
    updatedFields[index].type = event.target.value;
    setFields(updatedFields);
  };

  const handleOptionChange = (fieldIndex, optionIndex, event) => {
    const updatedFields = [...fields];
    updatedFields[fieldIndex].options[optionIndex] = event.target.value;
    setFields(updatedFields);
  };

  const addOption = (index) => {
    const updatedFields = [...fields];
    updatedFields[index].options = [...(updatedFields[index].options || []), ''];
    setFields(updatedFields);
  };

  const removeField = (index) => {
    setFields(fields.filter((_, i) => i !== index));
  };

  const saveForm = async () => {
    const formData = {
      title,
      fields,
    };

    if (userState && userState.user) {
      formData.userId = userState.user._id;
    }

    try {
      if (existingFormData) {
        const response = await axios.put(`https://form-app-9b6v.onrender.com/form/${existingFormData._id}`, formData);
        console.log('Form updated:', response.data);
        alert('Form updated successfully!');
      } else {
        const response = await axios.post(`https://form-app-9b6v.onrender.com/form/${userId}`, formData);
        console.log('Form saved:', response.data);
        navigate(`/form/${response.data._id}`);
      }
    } catch (error) {
      console.error('Error saving form:', error);
    }
  };

  const handleDragStart = (index) => {
    setDraggedFieldIndex(index);
  };

  const handleDragOver = (index) => {
    if (draggedFieldIndex === index) return;
    const reorderedFields = [...fields];
    const draggedField = reorderedFields.splice(draggedFieldIndex, 1)[0];
    reorderedFields.splice(index, 0, draggedField);
    setDraggedFieldIndex(index);
    setFields(reorderedFields);
  };

  const handleDragEnd = () => {
    setDraggedFieldIndex(null);
  };

  return (
    <>
      <Paper elevation={3} sx={{ padding: 3, maxWidth: 600, margin: 'auto', mt: 5 }}>
        <TextField
          label="Add Title"
          variant="outlined"
          fullWidth
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          sx={{ mb: 3 }}
        />

        {fields.map((field, index) => (
          <Box
            key={field.id}
            sx={{ display: 'flex', flexDirection: 'column', mb: 2, cursor: 'move' }}
            draggable
            onDragStart={() => handleDragStart(index)}
            onDragOver={(e) => {
              e.preventDefault();
              handleDragOver(index);
            }}
            onDragEnd={handleDragEnd}
          >
            <Box sx={{ display: 'flex', alignItems: 'center', mb: 1 }}>
              <TextField
                label="Form Question"
                variant="outlined"
                size="small"
                sx={{ mr: 2, flex: 1 }}
                value={field.label}
                onChange={(e) => handleLabelChange(index, e)}
              />
              <TextField
                label="Type"
                variant="outlined"
                select
                size="small"
                sx={{ mr: 2, minWidth: 120 }}
                value={field.type}
                onChange={(e) => handleTypeChange(index, e)}
              >
                {fieldTypes.map((option) => (
                  <MenuItem key={option.value} value={option.value}>
                    {option.label}
                  </MenuItem>
                ))}
              </TextField>
              <IconButton color="error" onClick={() => removeField(index)}>
                <DeleteIcon />
              </IconButton>
            </Box>

            {field.type === 'text' && (
              <TextField
                placeholder="User response here"
                variant="outlined"
                size="small"
                disabled
                fullWidth
              />
            )}

            {field.type === 'number' && (
              <TextField
                placeholder="Enter a number"
                type="number"
                variant="outlined"
                size="small"
                disabled
                fullWidth
              />
            )}

            {(field.type === 'checkbox' || field.type === 'radio' || field.type === 'dropdown') && (
              <>
                {field.options.map((option, optionIndex) => (
                  <Box key={optionIndex} sx={{ display: 'flex', alignItems: 'center', mb: 1 }}>
                    {field.type === 'checkbox' && <Checkbox disabled />}
                    {field.type === 'radio' && <Radio disabled />}
                    {field.type === 'dropdown' && (
                      <Select disabled displayEmpty value="">
                        <MenuItem>{option}</MenuItem>
                      </Select>
                    )}
                    <TextField
                      placeholder={`Option ${optionIndex + 1}`}
                      variant="outlined"
                      size="small"
                      value={option}
                      onChange={(e) => handleOptionChange(index, optionIndex, e)}
                      sx={{ ml: 1, flex: 1 }}
                    />
                  </Box>
                ))}
                <Button onClick={() => addOption(index)} startIcon={<AddCircleIcon />}>
                  Add Option
                </Button>
              </>
            )}
          </Box>
        ))}
      </Paper>

      <Box sx={{ display: 'flex', justifyContent: 'center', mt: 3 }}>
        <Button variant="outlined" startIcon={<AddCircleIcon />} onClick={addField}>
          Add Field
        </Button>
        <Button variant="outlined" color="primary" onClick={saveForm}>
          {existingFormData ? 'Update Form' : 'Save Form'}
        </Button>
      </Box>
    </>
  );
};

export default CreateForm;
