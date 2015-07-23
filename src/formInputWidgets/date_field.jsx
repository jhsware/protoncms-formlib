'use strict';
/*

    To use this input widget adapter you need to register it with your
    adapter registry.

*/
var createAdapter = require('component-registry').createAdapter;

var IDateField = require('isomorphic-schema').interfaces.IDateField;
var IInputFieldWidget = require('protoncms-core').interfaces.IInputFieldWidget;

var Input = require('react-bootstrap').Input;

var DateInputAdapter = createAdapter({
    implements: IInputFieldWidget,
    adapts: IDateField,
    
    inputType: 'text',
    ReactComponent: Input,
    didUpdate: function (fieldKey, e, onChange) {
        var value = this.context.fromString(e.target.value);
        onChange(fieldKey, value);
    }
});

module.exports.DateInputAdapter = DateInputAdapter;