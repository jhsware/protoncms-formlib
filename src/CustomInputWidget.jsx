'use strict';
var React = require('react');

/* 

    Pass this dummy element to AutoForm to define a custom input widget for a specific attribute

    Custom widget will be called like this:

    <CustomWidget 
        name={fieldKey}             // the property name being rendered
        context={context[fieldKey]} // the value of the property
        onChange={this.didUpdate}   // the onChange event, should be called like this: this.props.onChange(name, newValue)
        fieldValidator={schemaField}   // The validator for this property
    />

*/

var CustomInputWidget = React.createClass({
    
    propTypes: {
        property: React.PropTypes.string.isRequired,
        widget: React.PropTypes.func.isRequired
        // context: -- any type of input data
    },
    
    render: function() {}
})

module.exports = CustomInputWidget;
