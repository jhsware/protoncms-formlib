'use strict';
/*

    To use this input widget adapter you need to register it with your
    adapter registry.

*/
var createAdapter = require('component-registry').createAdapter;

var IObjectField = require('isomorphic-schema').interfaces.IObjectField;
var IInputFieldWidget = require('protoncms-core').interfaces.IInputFieldWidget;

var ObjectInputAdapter = createAdapter({
    implements: IInputFieldWidget,
    adapts: IObjectField,
    
    getReactComponent: function () {
        var ia = registry.getAdapter(this.context.interface, IInputFieldWidget);
        return (ia.getReactComponent ? ia.getReactComponent() : ia.ReactComponent);
    },
    didUpdate: function (fieldKey, e, onChange) {
        onChange(fieldKey, e);
    }
});

module.exports.ObjectInputAdapter = ObjectInputAdapter;