'use strict';
var registry = require('protoncms-core').registry;
var React = require('react');
var createAdapter = require('component-registry').createAdapter;

var IObjectPrototypeFactory = require('protoncms-core').interfaces.IObjectPrototypeFactory;
var IInputFieldWidget = require('protoncms-core').interfaces.IInputFieldWidget;
var IListField = require('isomorphic-schema').interfaces.IListField;

var FieldValidationMixin = require('../mixins/FieldValidationMixin');

var Button = require('react-bootstrap').Button;
/* TODO: Implement proper widget */

var ListInputAdapter = createAdapter({
    implements: IInputFieldWidget,
    adapts: IListField,
    
    inputType: 'custom',
    ReactComponent: React.createClass({
        
        mixins: [FieldValidationMixin],
        
        didChange: function (fieldKey, e) {
            this.props.onChange(this.props.value);
        },
        
        doAddItem: function (e) {
            var newObj = registry.getUtility(IObjectPrototypeFactory, this.props.fieldValidator.valueFieldType.objectFactoryName).getObject()
            this.props.value.push(newObj);
            this.props.onChange(this.props.value);
        },
        
        renderLabel: function () {
            if (this.props.label) {
                return (
                    <label className="control-label">
                        <span>{this.props.label}</span>
                    </label>
                )
            } else {
                return undefined
            }
        },
        
        doDeleteItem: function (index) {
            this.props.value.splice(index, 1);
            this.props.onChange(this.props.value);
        },
        
        renderRow: function (item, index) {
            
            var fieldValidator = this.props.fieldValidator.valueFieldType;
            var fieldValue = item;
            var fieldKey = index;
            
        
            // Validate input
            if (this.props.hasOwnProperty('DoNotValidate')) {
                var formErrors;
            } else {
                // Always skip invariants during form entry (we haven't filled out all the fields...)
                var tmpOpts = {
                    skipInvariants: true
                };
            
                // If we are only showing a limited set of fields, only validate them
                // TODO: Should we add selectedFields?
                //if (Array.isArray(this.props.onlyFields)) {
                //    tmpOpts['selectedFields'] = this.props.onlyFields.filter(function (fieldName) {
                //        return formSchema._fields.hasOwnProperty(fieldName);
                //    });
                //};
                // TODO: Do the same as with onlyFields if we have chosen to excludeFields
            
                // Now perform validation:
                var formErrors = fieldValidator.validate(fieldValue, tmpOpts);
        
                // Insert invariant errors for each field
                // TODO: Add server errors etc,
                //formErrors = formErrors || {};
                //formErrors.fieldErrors = formErrors.fieldErrors || {};
                //for (var key in this.props.invariantErrors) {
                //    var tmpErr = this.props.invariantErrors[key];
                //    for (var i in tmpErr.fields) {
                //        var fieldKey = tmpErr.fields[i];
                //        formErrors.fieldErrors[fieldKey] = {
                //            type: 'invariant_error',
                //            message: tmpErr.message
                //        };
                //    }
                //};            
            }
            
            var ia = registry.getAdapter(fieldValidator, IInputFieldWidget);
            var SubFormWidget = (ia.getReactComponent ? ia.getReactComponent() : ia.ReactComponent);
            
            // Some nice help for debugging...
            if (typeof SubFormWidget === "undefined") {
                console.error('[AUTOFORM] The widget for property was not found for:')
                console.error(fieldValidator);
            }
            
            // Some extra tag attributes passed from the adapter to react-bootstrap widgets 
            var tagAttributes;
            if (typeof ia.getAttributes !== "undefined") {
                tagAttributes = ia.getAttributes();
            }
            
            // Create help text and merge form error into help text USING MIXIN
            var fieldError = formErrors && formErrors.fieldErrors;                        
            var widgetValidationProps = this.getBootstrapValidationProps(fieldValidator, fieldValue, fieldError);
            
            if (ia.inputType === 'text') {
                fieldValue = fieldValidator.toFormattedString(fieldValue);
            }; 
            
            return (
                <div key={"row-" + index} className={(this.props.formRowClassName || "edit-form-row")}>
                    <div>
                        {"Item " + index}
                        
                        <div className="float-right">
                            <Button
                                bsStyle="danger"
                                onClick={function (e) {
                                    this.doDeleteItem(index)
                                }.bind(this)}>
                                Remove
                            </Button>
                        </div>
                    
                    </div>

                
                    <SubFormWidget
            
                        type={ia.inputType}
                        value={fieldValue}
                        fieldValidator={fieldValidator}
            
                        {...widgetValidationProps}
            
                        placeholder={fieldValidator.placeholder}
                        label={!this.props.hasOwnProperty('hideLabels') && fieldValidator.label}
                        addonAfter={fieldValidator.prefix}
                        addonBefore={fieldValidator.suffix}
                        hasFeedback
            
                        onKeyDown={function (e) {
                            // this.didKeyDown(fieldKey, e);
                        }.bind(this)}
            
                        onChange={function (e) {
                            ia.didUpdate(fieldKey, e, this.didChange);
                        }.bind(this)}
            
                        {...tagAttributes}>{ia.getOptionsEls && ia.getOptionsEls(fieldValue)}</SubFormWidget>
                            
                </div>
            )
        },
        
        renderInputWidget: function () {
            var rowEls = this.props.value.map(function (item, index) {
                return (
                    <div key={"row_" + index} className="">
                        { this.renderRow(item, index) }
                    </div>
                )
            }.bind(this))
            return (
                <div className="">
                    {rowEls}
                    <Button 
                        bsStyle="success"
                        onClick={this.doAddItem}>
                        + Lägg till
                    </Button>
                </div>
            )
        },
        
        render: function () {
            var cl = ["InputFieldWidget", "has-feedback", "form-group"];
            if (this.props.bsStyle) {
                cl.push("has-" + this.props.bsStyle);
            }
            
            return (
                <div className={cl.join(' ')} >
                    {this.renderLabel()}
                    
                    {this.renderInputWidget()}
                    
                    {this.props.help && <span className="help-block">{this.props.help}</span>}
                </div>
            );
        }
    }),
    didUpdate: function (fieldKey, e, onChange) {
        // var value = this.context.fromString(e.target.value);
        var value = e;
        onChange(fieldKey, value);
    }
});

module.exports = ListInputAdapter;
