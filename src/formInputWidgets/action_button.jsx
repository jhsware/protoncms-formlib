'use strict';
/*

    To use this input widget adapter you need to register it with your
    adapter registry.

*/

var React = require('react');
var ReactTransitionGroup = require('react-addons-transition-group');
var ReactDOM = require('react-dom');

var $ = require('jquery');

var createUtility = require('component-registry').createUtility;
var IActionButtonWidget = require('protoncms-core').interfaces.IActionButtonWidget;

var Button = require('react-bootstrap').Button;

var Spinner = React.createClass({
    
    componentWillEnter: function (done) {
        var $el = $(ReactDOM.findDOMNode(this.refs['this']));
        $el.addClass('animate-in');
        setTimeout(function () {
            $el.addClass('icon-spinner-visible'); 
            done();
        }, 0)
    },
    
    componentDidEnter: function () {
        // We don't need to do any cleanup, when hiding the modal we want it to animate
    },
    
    componentWillLeave: function (done) {
        var $el = $(ReactDOM.findDOMNode(this.refs['this']));
        $el.on( 'transitionend', function() {
            $el.off( 'transitionend');
            done();
        });
        $el.removeClass('animate-in');
        $el.addClass('animate-out');
        setTimeout(function () {
            $el.removeClass('icon-spinner-visible');
        }, 0);
    },
    
    componentDidLeave: function () {
        // We don't need to do any cleanup, the class is removed when the element is destroyed
    },
    
    componentDidMount: function () {
        this.spinningTimer = setInterval(this.spinTick, 40);
    },
    
    componentWillUnmount: function () {
        clearInterval(this.spinningTimer);
    },
    
    getInitialState: function () {
        return {
            rotation: 0
        }
    },
    
    spinTick: function () {
        this.setState({
            rotation: (this.state.rotation + 9) % 360
        })
    },
    
    render: function () {
        return (
            <span style={{transform: "rotate(" + this.state.rotation + "deg)"}} ref="this" className="icon-spinner icon-fmtk_logo_complete" />
        )        
    }
});

var ActionButton = React.createClass({
    
    render: function () {
        return (
            <Button {...this.props}>
                <ReactTransitionGroup>
                    {this.props.showSpinner && <Spinner key="icon-spinner" />}
                </ReactTransitionGroup>
                {this.props.children}
            </Button>
        )
    }
});

var ActionButtonUtility = createUtility({
    implements: IActionButtonWidget,
    
    ReactComponent: ActionButton
});

module.exports.ActionButtonUtility = ActionButtonUtility;
