'use strict';
/*

    To use this input widget adapter you need to register it with your
    adapter registry.

*/
var createAdapter = require('component-registry').createAdapter;

var ITextAreaField = require('isomorphic-schema').interfaces.ITextAreaField;
var IInputFieldWidget = require('protoncms-core').interfaces.IInputFieldWidget;

var Input = require('react-bootstrap').Input;

var TextAreaInputAdapter = createAdapter({
    implements: IInputFieldWidget,
    adapts: ITextAreaField,
    
    inputType: 'textarea',
    ReactComponent: Input,
    didUpdate: function (fieldKey, e, onChange) {
        var value = this.context.fromString(e.target.value);
        onChange(fieldKey, value);
    }
});

module.exports.TextAreaInputAdapter = TextAreaInputAdapter;