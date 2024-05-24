const { body } = require('express-validator');

exports.incubatorValidationRules = () => {
    return [
        body('name').notEmpty().withMessage('Name is required'),
        body('location').notEmpty().withMessage('Location is required'),
    ];
};
