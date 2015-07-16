'use strict';
/*

    To use this input widget adapter you need to register it with your
    adapter registry.

*/
var createAdapter = require('component-registry').createAdapter;

var IPasswordField = require('isomorphic-schema').interfaces.IPasswordField;
var IInputFieldWidget = require('protoncms-core').interfaces.IInputFieldWidget;

var Input = require('react-bootstrap').Input;

var PasswordInputAdapter = createAdapter({
    implements: IInputFieldWidget,
    adapts: IPasswordField,
    
    inputType: 'password',
    ReactComponent: Input,
    didUpdate: function (fieldKey, e, onChange) {
        var value = this.context.fromString(e.target.value);
        onChange(fieldKey, value);
    }
});

module.exports.PasswordInputAdapter = PasswordInputAdapter;