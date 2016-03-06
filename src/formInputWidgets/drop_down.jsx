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
        var value = (this.context.placeholder == e.target.value ? undefined : this.context.fromString(e.target.value));
        onChange(fieldKey, value);
    },
    getOptionsEls: function (value) {
        var outpEls = this.context.options.map(function (option, keyIndex) {
            // Make sure the correct option is marked as selected...
            if (value === option.name) {
                var selected = {
                    selected: true
                }
            } else {
                var selected = {};
            }
            
            
            return (
                <option key={'option-' + keyIndex} value={option.name} {...selected}>{option.title}</option>
            )
        });
        
        // ...and if nothing is selected, select placeholder
        if (!value) {
            var selected = {
                selected: true
            }
        } else {
            var selected = {};
        }
        outpEls.unshift(
            <option key='option-placeholder' value={undefined} {...selected}>{this.context.placeholder}</option>
        );
        return outpEls;
    }
});

module.exports.DropDownAdapter = DropDownAdapter;