/**
 * @file Prototype for ui-element modal dialog.
 * 
 * @author Human Interactive
 */
"use strict";

var UiElement = require( "./UiElement" );

var self;
/**
 * Creates the modal label.
 * 
 * @constructor
 * @augments UiElement
 */
function ModalDialog() {

	UiElement.call( this );

	Object.defineProperties( this, {
		_$overlay : {
			value : false,
			configurable : false,
			enumerable : false,
			writable : true
		},
		_$close : {
			value : false,
			configurable : false,
			enumerable : false,
			writable : true
		},
		_$headline : {
			value : false,
			configurable : false,
			enumerable : false,
			writable : true
		},
		_$button : {
			value : false,
			configurable : false,
			enumerable : false,
			writable : true
		},
		_$content : {
			value : false,
			configurable : false,
			enumerable : false,
			writable : true
		},
		isActive : {
			value : false,
			configurable : false,
			enumerable : true,
			writable : true
		}
	} );

	self = this;
}

ModalDialog.prototype = Object.create( UiElement.prototype );
ModalDialog.prototype.constructor = ModalDialog;

/**
 * Initializes the control.
 */
ModalDialog.prototype.init = function() {

	this._$root = global.document.querySelector( "#modal-dialog" );
	this._$overlay = global.document.querySelector( ".md-overlay" );
	this._$close = this._$root.querySelector( ".md-close" );
	this._$headline = this._$root.querySelector( "h2" );
	this._$button = this._$root.querySelector( ".btn" );
	this._$content = this._$root.querySelector( ".md-text" );

	this._$close.addEventListener( "click", this._onClose );
	this._$overlay.addEventListener( "click", this._onClose );
};

/**
 * Shows the modal dialog.
 * 
 * @param {object} textKeys - The texts to display.
 */
ModalDialog.prototype.show = function( textKeys ) {
	
	// show modal
	this._$root.classList.add( "md-show" );

	// set texts
	this._$headline.textContent = this._textManager.get( textKeys.headline );
	this._$button.textContent = this._textManager.get( textKeys.button );
	this._$content.innerHTML = this._textManager.get( textKeys.content );

	// release pointer lock
	global.document.dispatchEvent( new global.Event( "releasePointer" ) );
	
	// set active flag
	this.isActive = true;
};

/**
 * Hides the modal dialog.
 */
ModalDialog.prototype.hide = function() {

	// hide modal
	this._$root.classList.remove( "md-show" );

	// lock pointer
	global.document.dispatchEvent( new global.Event( "lockPointer" ) );
	
	// set active flag
	this.isActive = false;
};

/**
 * This method handles event for closing the element.
 * 
 * @param {object} event - Default event object.
 */
ModalDialog.prototype._onClose = function( event ) {

	event.stopPropagation();
	self.hide();
};

module.exports = new ModalDialog();