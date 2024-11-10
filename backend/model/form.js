const {Schema, model} = require('mongoose');

const formSchema = new Schema(
    {
        title: { 
            type: String, 
            required: true
         },
         fields: [
            {
              label: { 
                type: String, 
                required: true
              },
              type: { 
                type: String, 
                required: true, 
                enum: ['text', 'number', 'checkbox', 'radio', 'dropdown']
              },
              options: [
                {
                  type: String
                }
              ],
              required: { 
                type: Boolean, 
                default: false 
              }
            }
          ],
          userId: { 
            type: Schema.Types.ObjectId, 
            ref: 'user', 
          },
    },

        {timestamps: true}
)

const Form = model('form', formSchema);

module.exports = Form;