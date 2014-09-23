/* public functions
************************************/
Elba.prototype = {

	defaults : {
		selector : '.elba',
		separator : '|',
		breakpoints : false,
		successClass : 'elba-loaded',
		errorClass : 'elba-error',
		src : 'data-src',
		error : false,
		success : false
	},
	swipe : function(direction){
		var self = this, leftOffset;

		if(direction === 'right'){
			if(pointer + 1 >= count ){
				return false;
			}
			pointer++;
			leftOffset = intVal(self.el.style.left) - intVal(slides[pointer].offsetWidth);
			self.el.style.left = leftOffset + 'px'; 
		}else{
			if(pointer - 1 < 0 ){
				return false;
			}
			pointer--;
			leftOffset = intVal(self.el.style.left) + intVal(slides[pointer].offsetWidth);
			self.el.style.left = leftOffset + 'px'; 
		}
	}
};	