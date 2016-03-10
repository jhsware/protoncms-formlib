'use strict';
require('./src/AutoForm');
require('./src/ActionBarWidget');
require('./src/MessagePopupWidget');
require('./src/DropArea');

module.exports.form_field_widgets = require('./src/formInputWidgets');
module.exports.registerAllWidgets = require('./src/registerAllWidgets');
module.exports.CustomInputWidget = require('./src/CustomInputWidget');
module.exports.mixins = {
    FieldValidationMixin: require('./src/mixins/FieldValidationMixin')
};