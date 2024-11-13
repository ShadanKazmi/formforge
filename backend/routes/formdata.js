const { Router } = require('express');
const Form = require('../model/form');
const Response = require('../model/response')
const router = Router();
const User = require('../model/user');


router.get('/:formId', async (req, res) => {
    const { formId } = req.params;

    try {
        const form = await Form.findById(formId).populate('userId', 'name email');
        if (!form) {
            return res.status(404).json({ message: 'Form not found' });
        }

        return res.json(form);
    }
    catch (error) {
        res.status(500).json({ message: 'Error retrieving form data', error: error.message });
    }
})

router.get('/userForm/:userId', async (req, res) => {

    const {userId} = req.params;

    try {
        const forms = await Form.find({userId});
        if (!forms || forms.length === 0) {
            return res.status(404).json({ message: 'No forms found' });
        }

        return res.json(forms);
    }
    catch (error) {
        console.error("Error details:", error);
        res.status(500).json({ message: 'Error retrieving form data', error: error.message });
    }
})

router.post('/:userId', async (req, res) => {
    const { title, fields } = req.body;
    const {userId} = req.params;

    if (!title || !fields) {
        return res.status(400).json({ message: 'Title and fields are required' });
    }

    try {

        const formData = { title, fields, userId };
        const newForm = new Form(formData);
        const savedForm = await newForm.save();

        await User.findByIdAndUpdate(userId, {
            $push: { userForms: savedForm._id }
        });
        
        res.json(savedForm);
    } catch (error) {
        res.status(500).json({ message: 'Error saving form data', error: error.message });
    }
});


// router.post('/:formId/save', async (req, res) => {
//     const { formId } = req.params;
//     const {email, answers} = req.body;

//     if (!answers || !Array.isArray(answers)) {
//         return res.status(400).json({ message: 'Answers are required and should be an array' });
//     }


//     try {
//         const form = await Form.findById(formId);
//         if (!form) {
//             return res.status(404).json({ message: 'Form not found' });
//         }

//         const newResponse = new Response({
//             formId,
//             email,
//             answers,
//         });
//         const savedResponse = await newResponse.save();

//         res.json({ message: 'Response submitted successfully', response: savedResponse });

        
//     } catch (error) {
//         console.error("Error details:", error);
//         res.status(500).json({ message: 'Error submitting response', error: error.message });
//     }

// })

router.post('/:formId/save', async (req, res) => {
    const { formId } = req.params;
    const { email, answers } = req.body;

    if (!answers || !Array.isArray(answers)) {
        return res.status(400).json({ message: 'Answers are required and should be an array' });
    }

    try {
        // Find the form to get the field labels and verify existence
        const form = await Form.findById(formId);
        if (!form) {
            return res.status(404).json({ message: 'Form not found' });
        }

        const formAnswers = answers.map((answer) => {
            const field = form.fields.find((f) => f._id.toString() === answer.fieldId);
            if (field) {
                return {
                    ...answer,
                    label: answer.label || field.label,
                    options: answer.options || field.options || []
                };
            }
            return answer;
        });

        const invalidAnswers = formAnswers.some((answer) => !answer.label);
        if (invalidAnswers) {
            return res.status(400).json({ message: 'All answers must have a valid label' });
        }

        const newResponse = new Response({
            formId,
            email,
            answers: formAnswers,
        });
        const savedResponse = await newResponse.save();

        res.json({ message: 'Response submitted successfully', response: savedResponse });


    } catch (error) {
        console.error("Error details:", error);
        res.status(500).json({ message: 'Error submitting response', error: error.message });
    }
});




router.get('/:formId/responses', async (req, res) => {
    const { formId } = req.params;
  
    try {
      const form = await Form.findById(formId);
      if (!form) {
        return res.status(404).json({ message: 'Form not found' });
      }
  
      const responses = await Response.find({ formId });
  
      const formResponses = responses.map(response => {
        const formAnswers = response.answers.map(answer => {
          const field = form.fields.find(f => f._id.toString() === answer.fieldId.toString());
          return {
            ...answer.toObject(),
            label: field ? field.label : 'Unknown Field',
            options: field ? field.options : []
          };
        });
        
        return {
          ...response.toObject(),
          answers: formAnswers
        };
      });
  
      res.json(formResponses);
    } catch (error) {
      res.status(500).json({ message: 'Error retrieving responses', error: error.message });
    }
  });

router.put('/:formId', async (req, res) => {
    const { formId } = req.params;
    const { title, fields } = req.body;

    if (!title || !fields) {
        return res.status(400).json({ message: 'Title and fields are required' });
    }

    try {
        const form = await Form.findById(formId);
        if (!form) {
            return res.status(404).json({ message: 'Form not found' });
        }

        form.title = title;
        form.fields = fields;

        const updatedForm = await form.save();

        res.json({ message: 'Form updated successfully', form: updatedForm });
    } catch (error) {
        console.error("Error details:", error);
        res.status(500).json({ message: 'Error updating form', error: error.message });
    }
});



module.exports = router;