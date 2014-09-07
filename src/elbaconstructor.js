
//Elba constructor
function Elba( el, options ) {
		this.el = el;
		this.options = extend( this.defaults, options );
		//Init images container
		this.imgCarrier = [];
		this._init();
	}

//extends constructor
Elba.prototype = {

	defaults : {

	},

	_init : function(){
		var self = this, 
			imageList,
			imageArr;

		function pushImg(element, index, array){
			console.log(element);
			var src = element.getAttribute('data-src');
			self.imgCarrier.push( { index : index, img : src } );
			console.log( 'self.imgCarrier -> ' + self.imgCarrier );
		}	
	
		imageList = Array.prototype.slice.call( self.el.querySelectorAll( 'img' ) );

		imageList.forEach( pushImg );

	},

	_setup : function(){

	}