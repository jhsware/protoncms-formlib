'use strict';
var widgets = require('./formInputWidgets');
var registry = require('protoncms-core').registry;

// Registering adapters for form input widgets
module.exports = function () {
    for (var key in widgets.adapters) {
        try {
            registry.registerAdapter(widgets.adapters[key]);
        } catch (e) {
            console.error("Couldn't register: " + key);
            throw e;
        }
    
    }

    for (var key in widgets.utilities) {
        try {
            registry.registerUtility(widgets.utilities[key]);
        } catch (e) {
            console.error("Couldn't register: " + key);
            throw e;
        }
    
    }    
}
