"use strict";
var registry = require('protoncms-core').registry;
var React = require('react')
var $ = require('jquery')

var createUtility = require('component-registry').createUtility;

var IMessagePopupWidget = require('protoncms-core').interfaces.IMessagePopupWidget

var MessagePopup = React.createClass({
    
    componentWillEnter: function (done) {
        var $el = $(this.refs['this'].getDOMNode());        
        $el.addClass('animate-in');
        setTimeout(function () {
            $el.addClass('form-actionbar-message-popup-visible');
            done();
        }, 0)
    },
    
    componentDidEnter: function () {
        // We don't need to do any cleanup, when hiding the modal we want it to animate
    },
    
    componentWillLeave: function (done) {
        var $el = $(this.refs['this'].getDOMNode());
        
        var finished = function () {
            $el.off( 'transitionend');
            clearTimeout(timeout);
            done();
        }
        $el.on( 'transitionend', finished);
        var timeout = setTimeout(finished, 400); // Setting a timeout because the transition doesn't fire when visibility hidden
        
        $el.removeClass('animate-in');
        $el.addClass('animate-out');
        setTimeout(function () {
            $el.removeClass('form-actionbar-message-popup-visible');
        }, 0);
    },
    
    componentDidLeave: function () {
        // We don't need to do any cleanup, the class is removed when the element is destroyed
    },
    
    componentDidMount: function () {
        /* This is just an extra activation because the sticky bar won't perform the animation
           if it isn't visible */
        var $el = $(this.refs['this'].getDOMNode());
        setTimeout(function () {
            $el.addClass('form-actionbar-message-popup-visible');
        }, 1500)
    },
        
    render: function () {
        // TODO: Form generation
        
        var cx = React.addons.classSet;
        
        var popupCls = {
            "form-actionbar-message-popup": true,
            "form-actionbar-message-popup-inline": this.props.hasOwnProperty('renderInline')
        };
        
        // Add custom class if passed
        if (this.props.className) {
            popupCls[this.props.className] = true;
        };
        
        
        if (this.props.bsStyle) {
            popupCls["has-" + this.props.bsStyle] = true;
        };
        
        return (
            <div ref="this" className={cx(popupCls)}>
                <div className="form-actionbar-message-popup-body">
                    {this.props.message}
                </div>
                    {!this.props.disableClose && <span className="form-actionbar-message-popup-hide icon-button_arrow_down" onClick={this.props.onHide} />}
            </div>
        );
    }
});

var MessagePopupUtility = createUtility({
    implements: IMessagePopupWidget,

    /*
       TO OVERRIDE: specialise this by creating named utilities. When using, we
       first look for a named utility and if we don't find it we look for the
       unnamed utility.
    */
    
    ReactComponent: MessagePopup
});

registry.registerUtility(MessagePopupUtility)