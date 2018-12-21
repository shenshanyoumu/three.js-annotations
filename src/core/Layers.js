/**
 * @author mrdoob / http://mrdoob.com/
 */
// 图层对象
function Layers() {

	this.mask = 1 | 0;

}

Object.assign( Layers.prototype, {

	set: function ( channel ) {

		this.mask = 1 << channel | 0;

	},

	enable: function ( channel ) {

		this.mask |= 1 << channel | 0;

	},

	// 交换层
	toggle: function ( channel ) {

		this.mask ^= 1 << channel | 0;

	},

	disable: function ( channel ) {

		this.mask &= ~ ( 1 << channel | 0 );

	},

	test: function ( layers ) {

		return ( this.mask & layers.mask ) !== 0;

	}

} );


export { Layers };
