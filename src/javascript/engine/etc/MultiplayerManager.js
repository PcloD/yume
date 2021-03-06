/**
 * @file This prototype manages the characters of the other teammates.
 * 
 * @author Human Interactive
 */
"use strict";

var THREE = require( "three" );

var eventManager = require( "../messaging/EventManager" );
var TOPIC = require( "../messaging/Topic" );

var Teammate = require( "./Teammate" );
var world = require( "../core/World" );
var logger = require( "../core/Logger" );

var self;
/**
 * Creates a multiplayer manager instance.
 * 
 * @constructor
 * 
 */
function MultiplayerManager() {

	Object.defineProperties( this, {
		_teammates : {
			value : [],
			configurable : false,
			enumerable : true,
			writable : false
		}
	} );

	self = this;
}

/**
 * Inits the multiplayer logic.
 */
MultiplayerManager.prototype.init = function() {

	eventManager.subscribe( TOPIC.MULTIPLAYER.UPDATE, this._onUpdate );
	eventManager.subscribe( TOPIC.MULTIPLAYER.STATUS, this._onStatus );
};

/**
 * This method is used update the world information of other teammates.
 * 
 * @param {string} message - The message topic of the subscription.
 * @param {object} data - The data of the message.
 */
MultiplayerManager.prototype._onUpdate = ( function() {

	var position = new THREE.Vector3();
	var quaternion = new THREE.Quaternion();

	return function( message, data ) {

		// get correct teammate
		var teammate = self._getTeammate( data.clientId );

		// process position and orientation
		position.set( data.player.position.x, data.player.position.y, data.player.position.z );
		quaternion.set( data.player.quaternion._x, data.player.quaternion._y, data.player.quaternion._z, data.player.quaternion._w );

		// update teammate
		teammate.update( position, quaternion );
	};

} )();

/**
 * This method is used to update the status of other teammates.
 * 
 * @param {string} message - The message topic of the subscription.
 * @param {object} data - The data of the message.
 */
MultiplayerManager.prototype._onStatus = function( message, data ) {

	var teammate = null;

	if ( data.online === true )
	{
		// create mesh for teammate
		var mesh = new THREE.Mesh( new THREE.BoxGeometry( 4, 4, 4 ),  new THREE.MeshBasicMaterial( {color : "#ff0000"} ) );
		
		// create new teammate
		teammate = new Teammate( data.clientId, mesh );

		// add teammate
		self._addTeammate( teammate );

		// logging
		logger.log( "INFO: MultiplayerManager: Teammate with ID %i online.", data.clientId );

	}
	else
	{
		// get the teammate by its id
		teammate = self._getTeammate( data.clientId );

		// remove teammate
		self._removeTeammate( teammate );

		// logging
		logger.log( "INFO: MultiplayerManager: Teammate with ID %i offline.", data.clientId );

	}
};

/**
 * Adds a teammate object.
 * 
 * @param {Teammate} teammate - The teammate object to be added.
 */
MultiplayerManager.prototype._addTeammate = function( teammate ) {

	// add to internal array
	this._teammates.push( teammate );

	// add to world
	world.addObject3D( teammate.object3D );
};

/**
 * Removes a teammate.
 * 
 * @param {Teammate} teammate - The teammate object to be removed.
 */
MultiplayerManager.prototype._removeTeammate = function( teammate ) {

	// remove from array
	var index = this._teammates.indexOf( teammate );
	this._teammates.splice( index, 1 );

	// remove from world
	world.removeObject3D( teammate.object3D );
};

/**
 * Gets a teammate of the internal array.
 * 
 * @param {number} id - The id of the teammate.
 * 
 * @returns {Teammate} The teammate.
 */
MultiplayerManager.prototype._getTeammate = function( id ) {

	var teammate = null;

	for ( var index = 0; index < this._teammates.length; index++ )
	{
		if ( this._teammates[ index ].multiplayerId === id )
		{
			teammate = this._teammates[ index ];

			break;
		}
	}

	if ( teammate === null )
	{
		throw "ERROR: MultiplayerManager: Teammate with ID " + id + " not existing.";
	}
	else
	{
		return teammate;
	}
};

module.exports = new MultiplayerManager();