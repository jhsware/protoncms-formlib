'use strict';
require('./dist/AutoForm');
require('./dist/ActionBarWidget');
require('./dist/MessagePopupWidget');
require('./dist/DropArea');

module.exports.form_field_widgets = require('./dist/formInputWidgets');
module.exports.registerAllWidgets = require('./dist/registerAllWidgets');
module.exports.CustomInputWidget = require('./dist/CustomInputWidget');
module.exports.mixins = {
    FieldValidationMixin: require('./dist/mixins/FieldValidationMixin')
};