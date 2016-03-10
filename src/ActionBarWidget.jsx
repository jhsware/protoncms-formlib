'use strict';
var registry = require('protoncms-core').registry;
var React = require('react/addons');
var ReactTransitionGroup = React.addons.TransitionGroup;
var $ = require('jquery');

var createUtility = require('component-registry').createUtility;

var IActionBarWidget = require('protoncms-core').interfaces.IActionBarWidget;
var IMessagePopupWidget = require('protoncms-core').interfaces.IMessagePopupWidget;

var ActionBar = React.createClass({
    
    contextTypes: {
        onShownMessage: React.PropTypes.func // call this when message has been displayed
    },
    
    getInitialState: function () {
        var state = {
            hideMessage: false, 
            stickToBottom: false,
            width: 0                // We need to specify width for position: fixed element, it isn't affected by parent width 
        };
        return state;
    },
    
    componentWillReceiveProps: function (nextProps) {
        if (nextProps.message && typeof nextProps.message.timeout !== 'undefined') {
            // This message should hide itself after passed nr of ms
            setTimeout(function () {
                this.setState({
                    hideMessage: true
                });
            }.bind(this), nextProps.message.timeout)
        };
        
        if (nextProps.message && nextProps.message.force) {
            // This makes sure new messages are shown once if marked with force, but
            // on subsequent redraws it will keep its state set by ActionBar
            this.setState({
                hideMessage: false
            });
            this.context.onShownMessage();
        };
    },
    
    doHideMessage: function (e) {
        e.preventDefault();
        this.setState({
            hideMessage: true
        })
    },
    
    onScroll: function () {
        // Don't do this more than once per animation frame
        if (this.scrollAnimationFrame) { return; }
        
        // Ok so we haven't done this since last frame... let's go
        this.scrollAnimationFrame = window.requestAnimationFrame(function() {
            var $el = $(this.refs['theBar'].getDOMNode());
            var barBottom = $el.offset().top + $el.outerHeight();

            var stickToBottom = (barBottom - window.scrollY) > window.innerHeight;
            var width = $el.outerWidth();
        
            // Avoid doing this too many times
            if (this.state.stickToBottom !== stickToBottom || width !== this.state.width) {
                this.setState({
                    stickToBottom: stickToBottom,
                    width: width
                });
            };
            delete this.scrollAnimationFrame;
        }.bind(this));
    },
        
    componentDidMount: function () {
        // Allow setting prop NotSticky to avoid the sticky behaviour
        if (!this.props.NotSticky) {
            $(window).on('scroll', this.onScroll);
            $(window).on('resize', this.onScroll);
            this.onScroll();            
        }
    },
    
    componentWillUnmount: function () {
        $(window).off('scroll', this.onScroll);
        $(window).off('resize', this.onScroll);
    },
    
    renderStickyBar: function () {
        var cx = React.addons.classSet;
        
        var stickyActionBarCls = {
            "form-actionbar": true,
            stickToBottom: true,
            hidden: !this.state.stickToBottom
        };
        
        var MessagePopup = registry.getUtility(IMessagePopupWidget).ReactComponent;
        
        return (
            <div className={cx(stickyActionBarCls)} style={{width: this.state.width}}>

                <div className="form-actionbar-actions">
                    {this.props.children}
                </div>
                <ReactTransitionGroup>
                    {!this.state.hideMessage && this.props.message && 
                        <MessagePopup key="popup-sticky" 
                            bsStyle={this.props.message.type}
                            message={this.props.message.message}
                            onHide={this.doHideMessage} />}
                </ReactTransitionGroup>
                <div className="clearfix" />
            </div>
        )  
    },
        
    render: function() {
        
        var MessagePopup = registry.getUtility(IMessagePopupWidget).ReactComponent;
        
        return (
            <div className="form-actionbar-container">
                <div ref="theBar" className="form-actionbar flowWithText" >
                
                    <div className="form-actionbar-actions">
                        {this.props.children}
                    </div>
                    
                    <ReactTransitionGroup>
                        {!this.state.hideMessage && this.props.message && 
                            <MessagePopup key="popup-inline" 
                                bsStyle={this.props.message.type} 
                                message={this.props.message.message}
                                onHide={this.doHideMessage} />}
                    </ReactTransitionGroup>
                    <div className="clearfix" />
                </div>
                
                {!this.props.NotSticky && this.renderStickyBar()}
                
            </div>
        );
    }
});

var ActionBarUtility = createUtility({
    implements: IActionBarWidget,

    /*
       TO OVERRIDE: specialise this by creating named utilities. When using, we
       first look for a named utility and if we don't find it we look for the
       unnamed utility.
    */
    
    ReactComponent: ActionBar
});

registry.registerUtility(ActionBarUtility)


