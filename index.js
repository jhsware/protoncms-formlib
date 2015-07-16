'use strict';

module.exports.form_field_widgets = require('./src/formInputWidgets');
module.exports.registerAllWidgets = require('./src/registerAllWidgets');
module.exports.AutoForm = require('./src/AutoForm');
module.exports.CustomInputWidget = require('./src/CustomInputWidget');
module.exports.mixins = {
    FieldValidationMixin: require('./src/mixins/FieldValidationMixin')
};