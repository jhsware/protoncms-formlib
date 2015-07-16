This registers form widgets with the component registry. Allows auto form generation and lookup of input widgets.

How to use:

    var IAutoFormWidget = require('protoncms-core').interfaces.IAutoFormWidget;
    
    var FormWidget = registry.getAdapter(context, IAutoFormWidget).ReactComponent;
    
    var CustomInputWidget = require('protoncms-formlib').CustomInputWidget;
    
    var context = [the object to render];
    
    <FormWidget 
        name="context"                      // The form name
        context={context}                   // The object to render 
        onChange={this.didUpdate}           // didUpdate: funciton (name, context) -- name is the name you gave this form, context the updated value you passed
        formSchema={context._implements[0].schema} 
        
        onlyFields={['property', ...]}      // Optional, if you only want to render specific fields
        excludeFields={['property', ...]}   // Optional, if you want to exclude specific fields from rendering
        >
        
        // To customize form input fields use one CustomInputWidget for each property you want to customize
        <CustomInputWidget property="theProperty"       // Use custom widget for this property
                           widget={CustomWidget}        // This is the widget to be used
                           onChange={this.didUpdate}    // Function to call on changes
                           options={{...}} />           // Options to pass to the custom widget
        
    </FormWidget>