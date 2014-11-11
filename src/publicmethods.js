/* public functions
*************************************/


//Closing Elba constructor
}


/* Extending Elba constructor
************************************/
Elba.prototype.defaults = {
	selector : '.elba',
	separator : '|',
	breakpoints : false,
	successClass : 'elba-loaded',
	errorClass : 'elba-error',
	container : 'elba-wrapper',
	src : 'data-src',
	error : false,
	success : false,
	duration : 1000,
	easing: 'easeInOutCubic',
	navigation : true,
	dots: true,
	dotsContainer: false, 
	slideshow : 5000
};

Elba.prototype.init = function(_base,_options){

	var self = this;

	//self.slides = ELBA.getSlides();
	self.slides = _base.slides;
	console.log(self.slides);

	self.container = getContainer(_base.el, _options.container);

	self.setSlidesWidth();

	if(self.slides.length > 1){
		self.pointer 		= 1;
		self.loaderPointer   = 1;
		self.el.style.left = (- self.getContainerWidth()) + 'px';

		//Bind navigation events
		if(self.options.navigation){
		bindEvent(ELBA.getLeftNav(), 'click', function(ev) { 
			ev.preventDefault();
			self.goTo('left');
			if(self.options.slideshow){
				self.startSlideshow();
			}
			});

		bindEvent(ELBA.getRightNav(), 'click', function(ev) { 
			ev.preventDefault();
			self.goTo('right');
			if(self.options.slideshow){
				self.startSlideshow();
			}
			});
		}
		
		if(self.options.dots){
			self.dots = ELBA.getDots();

			classie.add(self.dots[self.pointer], 'active-dot');

			for(var i = 1; i < self.slides.length - 1; i++){
				self.dots[i].setAttribute('data-target', i);
				bindEvent(self.dots[i], 'click', function(ev){
					ev.preventDefault();
					self.dotTo(this.getAttribute('data-target'));
					if(self.options.slideshow){
						self.startSlideshow();
					}
				});
			}

		}
	}

	//Set images' src
	self.setSource();

	//Starting lazy load 
	loadLazyImage.call(self);

	//Bind resize event
	bindEvent(window, 'resize', resizeHandler.setScope(self));

	if(self.options.slideshow){
		self.startSlideshow();
	}
};

Elba.prototype.getContainerWidth = function(){
	var self = this;
	return getContainerWidth(self.container);
};

Elba.prototype.getContainerHeight = function(){
	var self = this;
	return getContainerHeight(self.container);
};		

Elba.prototype.setSlidesWidth = function(){
	var self = this;
	var containerWidth = self.getContainerWidth();
	var carouselWidth = 0;

	self.slides.forEach(function(el){
		carouselWidth += containerWidth;
		el.style.width = containerWidth + 'px';
	});

	self.el.style.width = carouselWidth + 'px';
};

Elba.prototype.setSource = function(){
	var self = this;
	self.source = 0;
	var mediaQueryMin = 0;
	var screenWidth = self.getContainerWidth();
	//handle multi-served image src
	each(self.options.breakpoints, function(object){
		if(object.width <= screenWidth && Math.abs(screenWidth - object.width) < Math.abs(screenWidth - mediaQueryMin)){
			mediaQueryMin = object.width;
			self.source = object.src;
			return true;
		}
	});
};

Elba.prototype.goTo = function(direction){
	var self = this;
	if(typeof direction === 'string' && isNaN(direction)){
		var count = self.slides.length;
		if(direction === 'right'){
			if(self.pointer + 1 >= count){
				return false;
			}
			self.pointer++;
			animate.call(self, 'right');
		}else{
			if(self.pointer - 1 < 0 ){
				return false;
			}
			self.pointer--;
			animate.call(self, 'left');
		}
	}else if(!isNaN(direction)){
		var oldPointer = self.pointer;
		self.pointer = parseInt(direction);
		if(self.pointer > oldPointer){
			animate.call(self, 'right');
		}else{
			animate.call(self, 'left');
		}	
	}else{
		self.el.style.left = intVal(self.getLeftOffset()) + 'px';
	}	
};

Elba.prototype.dotTo = function(index){
	var self = this;

	if(parseInt(index) === self.pointer){
		return false;
	}else{
		self.goTo(index);
	}

};

Elba.prototype.updateDots = function(){
	var self = this;

	self.dots.forEach(function(el){
		classie.remove(el,'active-dot');
	});

	var index;

	if(self.pointer === self.slides.length - 1){
		index = 1;
	}else if(self.pointer === 0){
		index = self.slides.length - 2;
	}else{
		index = self.pointer;
	}

	classie.add(self.dots[index],'active-dot');

};

Elba.prototype.getLeftOffset = function(){
	var self = this;	
	return - (self.getContainerWidth() * self.pointer);
};

Elba.prototype.setImageSize = function(elbaIsland){
	var self = this;

	var imgRatio = elbaIsland.naturalHeight / elbaIsland.naturalWidth;
	
    var containerWidth = self.getContainerWidth();
    var containerHeight = self.getContainerHeight();
    var containerRatio = containerHeight / containerWidth;

    var newHeight, newWidth;

    if (containerRatio >= imgRatio){
    	elbaIsland.height = newHeight = Math.ceil(containerHeight);
    	elbaIsland.width = newWidth = Math.ceil(containerHeight / imgRatio);
    }else{
    	elbaIsland.height = newHeight = Math.ceil(containerWidth * imgRatio);
    	elbaIsland.width = newWidth = Math.ceil(containerWidth);
    }

    var centerX = (containerWidth - newWidth) / 2;
	var centerY = (containerHeight - newHeight) / 2;

	elbaIsland.style.left = Math.ceil(centerX) + 'px';
	elbaIsland.style.top = Math.ceil(centerY) + 'px';
};

Elba.prototype.startSlideshow = function(){
	var self = this;
	if(self.slides.length > 1){
		if(self.slideshow){
		clearInterval(self.slideshow);
	}	
	self.slideshow = setInterval(function(){
		if(classie.has(self.slides[self.pointer + 1],'elba-loaded')){
			self.goTo('right');
		}
	},self.options.slideshow);

	}
};

Elba.prototype.clearSlideshow = function(){
	var self = this;	
	if(self.slideshow){
		clearInterval(self.slideshow);
	}
};


