'use strict';
var React = require('react');
var createAdapter = require('component-registry').createAdapter;

var IObjectRelationField = require('isomorphic-schema').interfaces.IObjectRelationField;
var IInputFieldWidget = require('protoncms-core').interfaces.IInputFieldWidget;
var IInputRelationFieldWidget = require('protoncms-core').interfaces.IInputRelationFieldWidget;




var ObjectRelationInputAdapter = createAdapter({
    implements: IInputFieldWidget,
    adapts: IObjectRelationField,
    
    getReactComponent: function () {
        var ia = registry.getAdapter(this.context.interface, IInputRelationFieldWidget);
        return (ia.getReactComponent ? ia.getReactComponent() : ia.ReactComponent);
    },
    
    didUpdate: function (fieldKey, e, onChange) {
        onChange(fieldKey, e);
    }
});

module.exports.ObjectRelationInputAdapter = ObjectRelationInputAdapter;
