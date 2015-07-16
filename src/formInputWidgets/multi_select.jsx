'use strict';
/*

    To use this input widget adapter you need to register it with your
    adapter registry.

*/
var React = require('react');
var createAdapter = require('component-registry').createAdapter;

var IMultiSelectField = require('isomorphic-schema').interfaces.IMultiSelectField;
var IInputFieldWidget = require('protoncms-core').interfaces.IInputFieldWidget;

var Input = require('react-bootstrap').Input;


var MultiSelectAdapter = createAdapter({
    implements: IInputFieldWidget,
    adapts: IMultiSelectField,

    inputType: 'select',
    getAttributes: function () {
        return {
            multiple: true,
            size: this.context.options.length
        }
    },
    ReactComponent: Input,
    didUpdate: function (fieldKey, e, onChange) {
        var selectedOptions = e.target.selectedOptions;
        var value = [];
        for (var i = 0, imax = selectedOptions.length; i < imax; i++) {
            var tmp = this.context.valueType.fromString(selectedOptions[i].value);
            value.push(tmp)
        }
        if (value.length == 0) {
            value = undefined;
        };
        onChange(fieldKey, value);
    },
    getOptionsEls: function () {
        var outpEls = this.context.options.map(function (option, keyIndex) {
            return (
                <option key={'option-' + keyIndex} value={option.name}>{option.title}</option>
            )
        });
        return outpEls;
    }
});

module.exports.MultiSelectAdapter = MultiSelectAdapter;