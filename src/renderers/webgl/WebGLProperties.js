/**
 * @author fordacious / fordacious.github.io
 */

function WebGLProperties() {
	// WeakMap是ES6的语言特征，普通的Map键值对不会自动被GC
	// 而WeakMap的键值对可以被GC
	var properties = new WeakMap();

	function get( object ) {

		var map = properties.get( object );

		if ( map === undefined ) {

			map = {};
			properties.set( object, map );

		}

		return map;

	}

	function remove( object ) {

		properties.delete( object );

	}

	function update( object, key, value ) {

		properties.get( object )[ key ] = value;

	}

	function dispose() {

		properties = new WeakMap();

	}

	return {
		get: get,
		remove: remove,
		update: update,
		dispose: dispose
	};

}


export { WebGLProperties };
