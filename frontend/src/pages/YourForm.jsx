// import { useEffect, useState } from 'react';
// import Form from '../pages/Form';
// import CreateForm from './CreateForm';
// import axios from 'axios';
// import { useParams } from 'react-router-dom';
// import NavBar from '../components/NavBar';
// import Button from '@mui/material/Button';
// import Box from '@mui/material/Box';

// const YourForm = () => {
//   const [isPreview, setIsPreview] = useState(true);
//   const { formid } = useParams();
//   const [existingFormData, setExistingFormData] = useState(null);

//   useEffect(() => {
//     const fetchForm = async () => {
//       try {
//         const res = await axios.get(`http://localhost:8000/form/${formid}`);
//         setExistingFormData(res.data);
//         console.log(res.data);
//       } catch (error) {
//         console.error('Error fetching form:', error);
//       }
//     };
//     fetchForm();
//   }, [formid]);

//   const togglePreview = () => {
//     setIsPreview(!isPreview);
//   };

//   return (
//     <>
//           <Box sx={{ display: 'flex', justifyContent: 'center', mb: 3 }}>

//       <Button
//         variant="contained"
//         color={isPreview ? 'primary' : 'secondary'}
//         onClick={togglePreview}
//         sx={{
//           mb: 3,
//           mt: 5,
//           px: 3,
//           py: 1,
//           fontSize: '1rem',
//           borderRadius: '8px',
//           transition: '0.3s',
//           ':hover': {
//             backgroundColor: isPreview ? 'secondary.main' : 'primary.main',
//           },
//         }}
//       >
//         {isPreview ? 'Edit Form' : 'Preview Form'}
//       </Button>
//       </Box>

//       {isPreview ? (
//         <Form />
//       ) : (
//         <CreateForm existingFormData={existingFormData} />
//       )}
//     </>
//   );
// };

// export default YourForm;

import { useEffect, useState } from 'react';
import Form from '../pages/Form';
import CreateForm from './CreateForm';
import axios from 'axios';
import { useParams } from 'react-router-dom';
import Button from '@mui/material/Button';
import Box from '@mui/material/Box';
import Responses from '../components/Responses';

const YourForm = () => {
  const [view, setView] = useState('preview'); // 'preview', 'edit', 'responses'
  const { formid } = useParams();
  const [existingFormData, setExistingFormData] = useState(null);

  useEffect(() => {
    const fetchForm = async () => {
      try {
        const res = await axios.get(`http://localhost:8000/form/${formid}`);
        setExistingFormData(res.data);
      } catch (error) {
        console.error('Error fetching form:', error);
      }
    };
    fetchForm();
  }, [formid]);

  const handleViewChange = (newView) => {
    setView(newView);
  };

  return (
    <>
      <Box sx={{ display: 'flex', justifyContent: 'center', mb: 3 }}>
        <Button
          variant="contained"
          color={view === 'preview' ? 'primary' : 'secondary'}
          onClick={() => handleViewChange('preview')}
          sx={{ mb: 3, mt: 5, mx: 1 }}
        >
          Preview Form
        </Button>
        <Button
          variant="contained"
          color={view === 'edit' ? 'primary' : 'secondary'}
          onClick={() => handleViewChange('edit')}
          sx={{ mb: 3, mt: 5, mx: 1 }}
        >
          Edit Form
        </Button>
        <Button
          variant="contained"
          color={view === 'responses' ? 'primary' : 'secondary'}
          onClick={() => handleViewChange('responses')}
          sx={{ mb: 3, mt: 5, mx: 1 }}
        >
          View Responses
        </Button>
      </Box>

      {view === 'preview' && <Form />}
      {view === 'edit' && <CreateForm existingFormData={existingFormData} />}
      {view === 'responses' && <Responses />}
    </>
  );
};

export default YourForm;
