'use strict';
var React = require('react');
var createAdapter = require('component-registry').createAdapter;

var IListField = require('isomorphic-schema').interfaces.IListField;
var IInputFieldWidget = require('protoncms-core').interfaces.IInputFieldWidget;
/* TODO: Implement proper widget */


var ListInputAdapter = createAdapter({
    implements: IInputFieldWidget,
    adapts: IListField,
    
    inputType: 'dummy',
    ReactComponent: (<div>This is a dummy field of type IListField</div>),
    didUpdate: function (fieldKey, e, onChange) {
        // var value = this.context.fromString(e.target.value);
        // onChange(fieldKey, value);
    }
});

module.exports = ListInputAdapter;
