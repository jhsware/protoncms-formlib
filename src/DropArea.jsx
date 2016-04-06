'use strict';
var registry = require('protoncms-core').registry;
var React = require('react');

var createUtility = require('component-registry').createUtility;

var IDropArea = require('protoncms-core').IDropArea;

var DropAreaOverlay = React.createClass({
    render: function() {
        return (
            <div className="DropArea-Overlay">
                <div className="DropArea-OverlayText" >
                    Drop here!
                </div>
            </div>
        )
    }
})

var DropArea = React.createClass({
    getInitialState: function(){
        return {
            inDragCount: 0
        }
    },

    didDragEnter: function(e){
        e.preventDefault()
        this.setState({
            inDragCount: (this.state.inDragCount + 1)
        })
    },

    didDragLeave: function(e) {
        this.setState({
            inDragCount: (this.state.inDragCount - 1)
        })
    },

    didDrop: function(e) {
        e.preventDefault()

        this.setState({
            inDragCount: 0
        });

        var files = e.dataTransfer.files;
        this.props.onDrop(files);
    },

    didDragOver: function(e){
        e.preventDefault();
    },
    
    didClick: function (e) {
        this.props.onClick && this.props.onClick(e);
    },
    
    render: function() {
        var classes = ["DropArea"];
        if (this.state.inDragCount > 0) {
            classes.push("DropArea--dragging")
        }
        if (this.props.className) {
            classes.push(this.props.className)
        };
        
        return (
            <div className={classes.join(' ')} ref="area" 
                onDragEnter={this.didDragEnter}
                onDragLeave={this.didDragLeave}
                onDragOver={this.didDragOver}
                onDrop={this.didDrop}
                onClick={this.didClick} >
                {this.props.children}
                {this.state.inDragCount > 0 && <DropAreaOverlay />}
            </div>
        )
    }
});
    
var IDropArea = require('protoncms-core').interfaces.IDropArea;

var DropAreaUtility = createUtility({
    implements: IDropArea,

    /*
       TO OVERRIDE: specialise this by creating named utilities. When using, we
       first look for a named utility and if we don't find it we look for the
       unnamed utility.
    */
    
    ReactComponent: DropArea
});

registry.registerUtility(DropAreaUtility)

/*
Suggested styling:

@keyframes anim-DropArea-OverlayFade {
  from {opacity: 0}
  to {opacity: 1}
}

.DropArea {
  width: 100%
  height: 100%
}

.DropArea-Overlay{
  position: absolute
  top: 0
  left: 0
  right: 0
  bottom: 0
  background-color: rgba(0,0,0,0.8)
  opacity: 1
  animation: anim-DropArea-OverlayFade .3s

  .DropArea-OverlayText{
    width: 300px
    height: 200px
    border-radius: 12px
    line-height: 200px
    text-align: center
    position: absolute
    top: 50%
    left: 50%
    transform: translate(-50%, -50%)
    border: dashed 1px white
    color: white
    font-size: 2rem
  }
}

*/