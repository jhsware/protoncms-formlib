'use strict';
/*

    To use this input widget adapter you need to register it with your
    adapter registry.

*/
var React = require('react');
var createAdapter = require('component-registry').createAdapter;

var ISelectField = require('isomorphic-schema').interfaces.ISelectField;
var IInputFieldWidget = require('protoncms-core').interfaces.IInputFieldWidget;

var Input = require('react-bootstrap').Input;


var DropDownAdapter = createAdapter({
    implements: IInputFieldWidget,
    adapts: ISelectField,

    inputType: 'select',
    ReactComponent: Input,
    didUpdate: function (fieldKey, e, onChange) {
        var value = this.context.fromString(e.target.value);
        onChange(fieldKey, value);
    },
    getOptionsEls: function () {
        var outpEls = this.context.options.map(function (option, keyIndex) {
            return (
                <option key={'option-' + keyIndex} value={option.name}>{option.title}</option>
            )
        });
        outpEls.unshift(
            <option key='option-placeholder' value={undefined}>{this.context.placeholder}</option>
        );
        return outpEls;
    }
});

module.exports.DropDownAdapter = DropDownAdapter;