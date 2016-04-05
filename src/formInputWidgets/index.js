'use strict';

module.exports.adapters = {
    // Render text input fields
    TextInputAdapter: require('./base_fields').TextInputAdapter,
    IntegerInputAdapter: require('./base_fields').IntegerInputAdapter,
    DecimalInputAdapter: require('./base_fields').DecimalInputAdapter,
    EmailInputAdapter: require('./email_field').EmailInputAdapter,
    PasswordInputAdapter: require('./password_field').PasswordInputAdapter,
    
    // Render checkbox
    CheckboxInputAdapter: require('./base_fields').CheckboxInputAdapter,
    
    // Render text area
    TextAreaInputAdapter: require('./text_area_field').TextAreaInputAdapter,
    //CreditCardField: require('./credit_card_field'),
    
    //SelectButtonGroup: require('./select_button_group'),
    DropDownAdapter: require('./drop_down').DropDownAdapter,
    MultiSelectAdapter: require('./multi_select').MultiSelectAdapter,
    DateField: require('./date_field').DateInputAdapter,
    //SocialImageSelector: require('./social_image_selector'),
        
    ListInputAdapter: require('./list_field'),
    
    ObjectInputAdapter: require('./object_field').ObjectInputAdapter,
        
    //FieldError: require('./field_error'),
    //InvariantErrors: require('./invariant_errors'),
    
    //CrossfadeContainer: require('./crossfade_container')
}

module.exports.utilities = {
    ActionButtonUtility: require('./action_button').ActionButtonUtility
}