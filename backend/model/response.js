const {Schema, model} = require('mongoose');

const responseSchema = new Schema ({
        formId : {
            type: Schema.Types.ObjectId,
            ref: 'form',
            required: true
        },
        email: {
            type: String,
            required: true,
        },
        answers: [{
            fieldId: {
                type: Schema.Types.ObjectId,
                required: true
            },
            label: {               // Add label field
                type: String,
                required: true
            },
            options: [{            // Add options field
                type: String
            }],
            answer: {
                type: Schema.Types.Mixed,
                required: true
            }
        }],
        submittedAt: { type: Date, default: Date.now },
    }
)


const Response = model('response', responseSchema);

module.exports = Response;