'use strict';
/*

    To use this input widget adapter you need to register it with your
    adapter registry.

*/
var createAdapter = require('component-registry').createAdapter;

var IEmailField = require('isomorphic-schema').interfaces.IEmailField;
var IInputFieldWidget = require('protoncms-core').interfaces.IInputFieldWidget;

var Input = require('react-bootstrap').Input;

var EmailInputAdapter = createAdapter({
    implements: IInputFieldWidget,
    adapts: IEmailField,
    
    inputType: 'text',
    ReactComponent: Input,
    didUpdate: function (fieldKey, e, onChange) {
        var value = this.context.fromString(e.target.value);
        onChange(fieldKey, value);
    }
});

module.exports.EmailInputAdapter = EmailInputAdapter;