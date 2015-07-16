'use strict';
var registry = require('protoncms-core').registry;
var React = require('react');
var createAdapter = require('component-registry').createAdapter;
var createUtility = require('component-registry').createUtility;

var _ = require('lodash');

var IProtonObject = require('protoncms-core').interfaces.IProtonObject;

var IInputFieldWidget = require('protoncms-core').interfaces.IInputFieldWidget;
var IAutoFormWidget = require('protoncms-core').interfaces.IAutoFormWidget;

var FieldValidationMixin = require('./mixins/FieldValidationMixin');

/*

    var IAutoFormWidget = require('protoncms-core').interfaces.IAutoFormWidget;

    var FormWidget = registry.getAdapter(context, IAutoFormWidget).ReactComponent;
    
    var context = [the object to render];
    
    <FormWidget 
        name="context"                      // The form name
        context={context}                   // The object to render 
        onChange={this.didUpdate}           // didUpdate: funciton (name, context) -- name is the name you gave this form, context the updated value you passed
        formSchema={context._implements[0].schema} 

        onlyFields={['property', ...]}      // Optional, if you only want to render specific fields
        excludeFields={['property', ...]}   // Optional, if you want to exclude specific fields from rendering
        />                    

*/

var FormGenerator = React.createClass({
    
    mixins: [FieldValidationMixin],
    
    contextTypes: {
        formStatus: React.PropTypes.object
    },
    
    didKeyDown: function (fieldName, e) {
        if (typeof this.props.onKeyDown === 'function') {
            this.props.onKeyDown(fieldName, e);
        }
    },
    
    didUpdate: function (name, value) {
        var context = this.props.context;
        
        if (typeof this.props.formSchema._fields[name] === 'undefined') {
            // TODO: How to handle items in an array?
            context[name] = value;
        } else {
            context[name] = this.props.formSchema._fields[name].fromString(value);
        }
        
                
        this.props.onChange(this.props.name, context);
    },

    render: function() {
        
        var context = this.props.context;
        var formSchema = this.props.formSchema;
        
        // Validate input
        var formErrors = formSchema.validate(context, {
            skipInvariants: true
        });
        
        // Insert invariant errors for each field
        formErrors = formErrors || {};
        formErrors.fieldErrors = formErrors.fieldErrors || {};
        for (var key in this.props.invariantErrors) {
            var tmpErr = this.props.invariantErrors[key];
            for (var i in tmpErr.fields) {
                var fieldKey = tmpErr.fields[i];
                formErrors.fieldErrors[fieldKey] = {
                    type: 'invariant_error',
                    message: tmpErr.message
                };
            }
        };
        
        // Merge form errors with serverErrors (the latter overwriting the former on conflict)
        if (this.props.serverErrors) {
            _.merge(formErrors.fieldErrors, this.props.serverErrors.fieldErrors);
        };
        
        var customWidgets = {}
        if (typeof this.props.children !== 'undefined') {
            var children = this.props.children;
            if (Array.isArray(children)) {
                children.map(function (widget) {
                    customWidgets[widget.props.property] = {
                        context: widget.props.context,
                        widget: widget.props.widget,
                        options: widget.props.options
                    };
                })
            } else if (children.props.hasOwnProperty('widget')) {
                customWidgets[children.props.property] = {
                    context: children.props.context,
                    widget: children.props.widget,
                    options: children.props.options
                };
            }
        };
        
        
        var schemaFields = formSchema._fields;
        
        var i = 0;
        var theFormEls = _.map(schemaFields, function (schemaField, fieldKey) {
            
            
            var fieldValidator = schemaFields[fieldKey];
            var fieldValue = context[fieldKey];
            
            if (customWidgets.hasOwnProperty(fieldKey)) {
                // So we passed a custom widget, in which case we use it!
                var CustomWidget = customWidgets[fieldKey].widget;
                
                // We can pass a custom context to the custom widget
                var widgetContext = customWidgets[fieldKey].context || fieldValue;
                
                // Pass the merged formErrors for this field (serverError / invariantError / fieldError in that precedence)
                var fieldError = formErrors && formErrors.fieldErrors && formErrors.fieldErrors[fieldKey];
                
                return (
                    <CustomWidget
                        
                        name={fieldKey} 
                        context={widgetContext} 
                        onChange={this.didUpdate} 
                        fieldValidator={fieldValidator}
                        serverErrors={fieldError}
                        {...customWidgets[fieldKey].options} />
                        
                )
            }
            
            // Didn't find a custom widget so we create the form automagically...
            
            if (this.props.onlyFields && _.indexOf(this.props.onlyFields, fieldKey) < 0) {
                // If we passed property onlyFields and it doesn't contain the fieldKey, skip it!
                return;
            }
            
            if (this.props.excludeFields && _.indexOf(this.props.excludeFields, fieldKey) >= 0) {
                // If we passed property excludeFields and it contains the fieldKey, skip it!
                return;
            }
            
            // Check field validation contraints to see if we should render this field
            var renderField = true;
            formSchema._validationConstraints.forEach(function (constraint) {
                renderField = renderField && constraint(context, fieldKey);
            });
            if (!renderField) {
                // We should skip this
                return;
            }
            
            // Get the general field input widget adapter
            var ia = registry.getAdapter(fieldValidator, IInputFieldWidget);
            var InputWidget = ia.ReactComponent;

            // Some nice help for debugging...
            if (typeof InputWidget === "undefined") {
                console.error('[AUTOFORM] The widget for property [' + fieldKey + '] was not found!')
            }
            
            // Some extra tag attributes passed from the adapter to react-bootstrap widgets 
            var tagAttributes;
            if (typeof ia.getAttributes !== "undefined") {
                tagAttributes = ia.getAttributes();
            }
            
            // Create help text and merge form error into help text USING MIXIN
            var fieldError = formErrors && formErrors.fieldErrors && formErrors.fieldErrors[fieldKey];                        
            var widgetValidationProps = this.getBootstrapValidationProps(fieldValidator, fieldValue, fieldError);
            
            // Don't show help message if hideHelpText attribute exists
            if (this.props.hasOwnProperty('hideHelpText') && (typeof this.props.hideHelpText === 'undefined' || this.props.hideHelpText)) {
                delete widgetValidationProps.help;
            }
            
            if (ia.inputType === 'text') {
                fieldValue = fieldValidator.toFormattedString(fieldValue);
            };
            
            return (
                <div key={"row-" + fieldKey} className={this.props.formRowClassName || "edit-form-row"}>
                    <InputWidget
                        
                        type={ia.inputType}
                        value={fieldValue}
                        
                        {...widgetValidationProps}
                        
                        placeholder={fieldValidator.placeholder}
                        label={!this.props.hasOwnProperty('hideLabels') && fieldValidator.label}
                        addonAfter={fieldValidator.prefix}
                        addonBefore={fieldValidator.suffix}
                        hasFeedback
                        
                        onKeyDown={function (e) {
                            this.didKeyDown(fieldKey, e);
                        }.bind(this)}
                        
                        onChange={function (e) {
                            ia.didUpdate(fieldKey, e, this.didUpdate);
                        }.bind(this)}
                        
                        {...tagAttributes}>{ia.getOptionsEls && ia.getOptionsEls()}</InputWidget>
                </div>
            )
        }, this); // << Binding FormGenerator to this in loop

        return (
            <div className={this.props.className || "edit-form"}>

                {theFormEls}

            </div>
        );
    }
});

var Adapter = createAdapter({
    implements: IAutoFormWidget,
    adapts: IProtonObject,
    
    ReactComponent: FormGenerator
});
registry.registerAdapter(Adapter);


var Utility = createUtility({
    implements: IAutoFormWidget,
    
    ReactComponent: FormGenerator
});
registry.registerUtility(Utility);