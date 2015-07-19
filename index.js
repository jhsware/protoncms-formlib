'use strict';
require('./build/AutoForm');

module.exports.form_field_widgets = require('./build/formInputWidgets');
module.exports.registerAllWidgets = require('./build/registerAllWidgets');
module.exports.CustomInputWidget = require('./build/CustomInputWidget');
module.exports.mixins = {
    FieldValidationMixin: require('./build/mixins/FieldValidationMixin')
};