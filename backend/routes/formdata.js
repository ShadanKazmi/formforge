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

router.get('/', async (req, res) => {

    try {
        const forms = await Form.find();
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


router.post('/', async (req, res) => {
    const { title, fields } = req.body;

    if (!title || !fields) {
        return res.status(400).json({ message: 'Title and fields are required' });
    }

    try {
        const formData = { title, fields };

        if (req.user) {
            formData.userId = req.user._id;
        }

        const newForm = new Form(formData);
        const savedForm = await newForm.save();

        if (req.user) {
            await User.findByIdAndUpdate(req.user._id, { $push: { userForms: savedForm._id } });
        }

        res.json(savedForm);
    } catch (error) {
        res.status(500).json({ message: 'Error saving form data', error: error.message });
    }
});


router.post('/:formId/save', async (req, res) => {
    const { formId } = req.params;
    const { answers } = req.body;

    if (!answers || !Array.isArray(answers)) {
        return res.status(400).json({ message: 'Answers are required and should be an array' });
    }


    try {
        const form = await Form.findById(formId);
        if (!form) {
            return res.status(404).json({ message: 'Form not found' });
        }

        const newResponse = new Response({
            formId,
            answers,
        });
        const savedResponse = await newResponse.save();

        res.json({ message: 'Response submitted successfully', response: savedResponse });

        
    } catch (error) {
        console.error("Error details:", error);
        res.status(500).json({ message: 'Error submitting response', error: error.message });
    }

})

router.get('/:formId/responses', async (req, res) => {
    const { formId } = req.params;
  
    try {
      const form = await Form.findById(formId);
      if (!form) {
        return res.status(404).json({ message: 'Form not found' });
      }
  
      const responses = await Response.find({ formId });
      res.json({ formId, responses });
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