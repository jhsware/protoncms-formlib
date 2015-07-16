'use strict';
/*

    To use this input widget adapter you need to register it with your
    adapter registry.

*/
var createAdapter = require('component-registry').createAdapter;

var ITextField = require('isomorphic-schema').interfaces.ITextField;
var IInputFieldWidget = require('protoncms-core').interfaces.IInputFieldWidget;

var Input = require('react-bootstrap').Input;

var TextInputAdapter = createAdapter({
    implements: IInputFieldWidget,
    adapts: ITextField,
    
    inputType: 'text',
    ReactComponent: Input,
    didUpdate: function (fieldKey, e, onChange) {
        var value = this.context.fromString(e.target.value);
        onChange(fieldKey, value);
    }
});

module.exports.TextInputAdapter = TextInputAdapter;

var IIntegerField = require('isomorphic-schema').interfaces.IIntegerField;

var IntegerInputAdapter = createAdapter({
    implements: IInputFieldWidget,
    adapts: IIntegerField,
    
    inputType: 'text',
    ReactComponent: Input,
    didUpdate: function (fieldKey, e, onChange) {
        var value = this.context.fromString(e.target.value);
        onChange(fieldKey, value);
    }
});

module.exports.IntegerInputAdapter = IntegerInputAdapter;

var IDecimalField = require('isomorphic-schema').interfaces.IDecimalField;

var DecimalInputAdapter = createAdapter({
    implements: IInputFieldWidget,
    adapts: IDecimalField,
    
    inputType: 'text',
    ReactComponent: Input,
    didUpdate: function (fieldKey, e, onChange) {
        var value = this.context.fromString(e.target.value);
        onChange(fieldKey, value);
    }
});

module.exports.DecimalInputAdapter = DecimalInputAdapter;

var IBoolField = require('isomorphic-schema').interfaces.IBoolField;

var CheckboxInputAdapter = createAdapter({
    implements: IInputFieldWidget,
    adapts: IBoolField,
    
    inputType: 'checkbox',
    ReactComponent: Input,
    didUpdate: function (fieldKey, e, onChange) {
        var value = e.target.checked;
        onChange(fieldKey, value);
    }
});

module.exports.CheckboxInputAdapter = CheckboxInputAdapter;