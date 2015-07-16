'use strict';

var FieldValidationMixin = {
    /*
        This mixin REQUIRES that you have a formStatus to work properly
        
        contextTypes: {
            formStatus: React.PropTypes.object
        },
    */
    
    getBootstrapValidationProps: function (fieldValidator, fieldValue, fieldError) {
        var outpProps = {
            bsStyle: undefined,
            help: fieldValidator.help || '',
        }
        var bsStyle; // Neutral if no error and not success
        if (fieldError) { // fieldError can be undefined and null (null comes from server?)
            outpProps.help += "(" + fieldError.message + ")";
            if (fieldError.type === 'required' && (this.context.formStatus && !this.context.formStatus.failedSubmit)) {
                // Required will only be rendered as an error if we have performed a failed submit
                outpProps.bsStyle = undefined;
            } else {
                outpProps.bsStyle = 'error';
            }
        } else {
            outpProps.bsStyle = (fieldValue !== null && typeof fieldValue !== undefined) && 'success'; // If value and no error then success
        }
        
        return outpProps;
    }
}

module.exports = FieldValidationMixin;