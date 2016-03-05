var Utils = {

    extend: function(a, b) {
        for (var key in b) {
            if (b.hasOwnProperty(key)) {
                a[key] = b[key];
            }
        }
        return a;
    },

    /**
     * Determine if an element is in the viewport
     * @param {HTMLElement} el
     * @return {Boolean}
     */
    isElementInViewport: function(el) {
        var rect = el.getBoundingClientRect();

        return (
            rect.top >= 0 &&
            rect.top <= (window.innerHeight || document.documentElement.clientHeight) ||
            rect.bottom >= 0 &&
            rect.bottom <= (window.innerHeight || document.documentElement.clientHeight)
        );
    },

    makeArray: function(arrayLikeObject) {
        return Array.prototype.slice.call(arrayLikeObject);
    },

    getCloneNodes: function(nodes) {
        var tmp = [];

        if (!nodes) return tmp;

        for (var i = 0; i < nodes.length; i++) {
            var clone = nodes[i].cloneNode(true);
            tmp.push(clone);
        }
        return tmp;
    },

    removeChildren: function(el) {
        while (el.firstChild) {
            el.removeChild(el.firstChild);
        }
    },

    /**
     * http://stackoverflow.com/a/2117523
     *
     * Generate a random GUID that will be used as the key to retrieve
     * all the Slider instances inside the Instances object.
     * @return {String}
     */
    generateGUID: function() {
        return 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, function(c) {
            var r = Math.random() * 16 | 0,
                v = c == 'x' ? r : (r & 0x3 | 0x8);
            return v.toString(16);
        });
    },

    // https://davidwalsh.name/element-matches-selector
    selectorMatches: function(el, selector) {
        var p = Element.prototype;
        var f = p.matches || p.webkitMatchesSelector || p.mozMatchesSelector || p.msMatchesSelector || function(s) {
            return [].indexOf.call(document.querySelectorAll(s), this) !== -1;
        };
        return f.call(el, selector);
    },

    getNodeElementByIndex: function(elements, index) {
        return elements[index];
    },

    setListener: function(elm, events, callback) {
        var eventsArray = events.split(' '),
            i = eventsArray.length;

        while (i--) {
            elm.addEventListener(eventsArray[i], callback, false);
        }
    },

    /**
     * @param {Number} smallN
     * @param {Number} bigN
     * @return {Number}
     */
    getPercentageRatio: function(smallN, bigN) {
        var percentage = ((smallN / bigN)).toFixed(2);
        return percentage * 100;
    }
};
