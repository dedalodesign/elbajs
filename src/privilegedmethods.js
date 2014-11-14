/* 
====================================================
EVERYTHING STARTS HERE
Privileged because they can access private functions
====================================================*/

this.init = function(){

	var self = this;

	/**
	 * Store the slides into self.base.slides array
	 */
	_createSlideArray(self.base,self.options);

	/**
	 * Wrap the carousel into the elba-wrapper class div
	 */
	_setupWrapper(self.base);

	/**
	 * Clone head and tail of the gallery to make the sliding show circular
	 */
	_cloneHeadAndTail(self.base);

	//Find the gallery container to adapt the size to
	self.base.container = getContainer(self.base.el, self.options.container);
	
	//We move the first slide to the right because of the head clone
	if(self.base.count > 1){
		self.base.el.style.left = (- getContainerWidth(self.base.container)) + 'px';
	}

	//Setting up the navigation arrows
    if(self.options.navigation){
    	_setupNavigation(self.base,'left');
		_setupNavigation(self.base,'right');

		//Attach events to the navigation arrows
		self.base.navigation.left.addEventListener('click', function(ev) { 
			ev.preventDefault();
			self.goTo('left');
			if(self.options.slideshow){
				self.startSlideshow();
			}
			}, false);

		self.base.navigation.right.addEventListener('click', function(ev) { 
			ev.preventDefault();
			self.goTo('right');
			if(self.options.slideshow){
				self.startSlideshow();
			}
			}, false);
    }

    //Setting up the dots
    if(self.options.dots){
    	_setupDots(self.base, self.options.dotsContainer);

    	classie.add(self.base.navigation.dots[self.base.pointer], 'active-dot');

    	var dotHandler = function(i){

    		return function(){
    			var index = self.base.navigation.dots[i].getAttribute('data-target');

    			if(parseInt(index) === self.base.pointer){
					return false;
				}else{
					self.goTo(index);
					}
	    		if(self.options.slideshow){
					self.startSlideshow();
				}

				return false;
    		};	
    	};

    	//Binding the click event to the dots
    	for(var i = 1; i < self.base.slides.length - 1; i++){
				self.base.navigation.dots[i].setAttribute('data-target', i);
				self.base.navigation.dots[i].addEventListener('click', dotHandler(i), false);
			}
    }

    //Set the width of each slide
    _setSlidesWidth(self.base);

	//Set images' src
	_setSource(self.base, self.options);

	//Starting lazy load 
	_lazyLoadImages(self.base, self.options);

	
	//Bind resize event
	window.addEventListener('resize', function(){
		_resizeHandler(self.base, self.options);
	},false);

	if(!!self.options.slideshow){

		// Set the name of the hidden property and the change event for visibility
		var hidden, visibilityChange; 
		if (typeof document.hidden !== 'undefined') { // Opera 12.10 and Firefox 18 and later support 
		  hidden = 'hidden';
		  visibilityChange = 'visibilitychange';
		} else if (typeof document.mozHidden !== 'undefined') {
		  hidden = 'mozHidden';
		  visibilityChange = 'mozvisibilitychange';
		} else if (typeof document.msHidden !== 'undefined') {
		  hidden =' msHidden';
		  visibilityChange = 'msvisibilitychange';
		} else if (typeof document.webkitHidden !== 'undefined') {
		  hidden = 'webkitHidden';
		  visibilityChange = 'webkitvisibilitychange';
		}

		if (typeof document[hidden] !== 'undefined') {
			// If the page is hidden, pause the slideshow;
			// if the page is shown, play the slideshow
			var handleVisibilityChange = function() {
			  if (document[hidden]) {
			    self.clearSlideshow();
			  } else {
			    self.startSlideshow();
			  }
			};

			// Handle page visibility change   
  			document.addEventListener(visibilityChange, handleVisibilityChange, false);
		}

		//We start the slideshow
		self.startSlideshow();
	}
};


/**
* Manages which direction and which picture to slide to
* @param {String} || {Number} accepts 'right','left'
* or the numerical index of the slide
*/
this.goTo = function(direction){
	var self = this;

	if(!self.base.animated){
		if(typeof direction === 'string' && isNaN(direction)){
		var count = self.base.slides.length;
		if(direction === 'right'){
			if(self.base.pointer + 1 >= count){
				return false;
			}
			self.base.directionHint = 'right';
			self.base.pointer++;
			_lazyLoadImages(self.base, self.options);
			animate(self.base, self.options,'right');
		}else{
			if(self.base.pointer - 1 < 0 ){
				return false;
			}
			self.base.directionHint = 'left';
			self.base.pointer--;
			_lazyLoadImages(self.base, self.options);
			animate(self.base, self.options,'left');
			}
		}else if(!isNaN(direction)){
			var oldPointer = self.base.pointer;
			self.base.pointer = parseInt(direction);
			if(self.base.pointer > oldPointer){
				self.base.directionHint = 'right';
				_lazyLoadImages(self.base, self.options);
				animate(self.base, self.options, 'right');
			}else{
				self.base.directionHint = 'left';
				_lazyLoadImages(self.base, self.options);
				animate(self.base, self.options, 'left');
			}	
		}

		if(!!self.options.dots){
	        _updateDots(self.base);
	    }
	}
	
};

