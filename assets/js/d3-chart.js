var data = [8131];
var goal = 85000;
var view = document.querySelector(".graph > div > div").getBoundingClientRect();
var width = view.width;
var barHeight = width / 20;
var x = d3.scale.linear()
.range([0, width])
.domain([0, goal]);
var goal_x = d3.scale.linear()
.range([0, goal]);
var chart = d3.select(".chart")
.attr("width", width)
.attr("height", width/9);

var bar = chart.selectAll("g")
.data(data)
.enter().append("g");
// .attr("transform", function(data, i) { return "translate(0," + i * barHeight + 5 + ")";});


var goal_rect;
var goal_text;
var raised_rect;
var raised_text;

goal_rect = bar.append("rect")
.attr("width", 0)
.attr("height", barHeight - 1)
.attr("class", "goal")
.transition()
.duration(1000)
.attr("width", width)
.each("end", function() {
    goal_text = bar.append("text")
    .attr("x", width-5)
    .attr("y", barHeight)
    .attr("dy", '1em')
    .attr("class", "goal")
    .text("$" + goal + " goal")
    .transition()
    .style("opacity", 1)
    .each("end", function() {
        raised_rect = bar.append("rect")
        .attr("width", 0)
        .attr("height", barHeight - 1)
        .attr("class", "raised")
        .transition()
        .duration(1000)
        .attr("width", function(data) { return x(data); })
        .each("end", function() {
            raised_text = bar.append("text")
            .attr("x", 5
            // function(data) { return x(data); }
            )
            .attr("class", "raised")
            .attr("y", barHeight)
            .attr("dy", '1em')
            .text("$" + data + " raised")
            .transition()
            .style("opacity", 1);
        })
    })
});
 d3.select(".goal").on("click", function() {
     $('html, body').animate({
    scrollTop: $(".why").offset().top
}, 1000);
 });




function type(d) {
    d.value = +d.value; // coerce to number
    return d;
}
window.addEventListener('load', function() {
    var menu = document.querySelector('.graph div');
    var menuPosition = menu.getBoundingClientRect();
    var spaceToTop = menuPosition.top;
    var placeholder = document.createElement('div');
    placeholder.style.width = menuPosition.width + 'px';
    placeholder.style.height = menuPosition.height + 'px';
    $(this).scrollTop(0);
    menu.style.position = 'static';
    var absolutePosition = menu.getBoundingClientRect().top;
    // menu.style.position = 'absolute';
    // menu.style.top = absolutePosition + 'px';

    var stickyMover = (window.matchMedia("only screen and (max-device-width: 736px)").matches ?
        function() {
            menu.style.position = 'relative';
            menu.style.top = '0px';
            menu.parentNode.removeChild(placeholder);
            
        } :
        function() {
            menu.style.position = 'static';
            menu.style.top = 0 + 'px';
            menu.parentNode.removeChild(placeholder);
            
        });

    window.addEventListener('scroll', function() {
        var yOffset = window.pageYOffset;
        // console.log(menu.style.position);
        
        if (yOffset >= absolutePosition && menu.style.position !== 'fixed') {
            menu.style.position = 'fixed';
            menu.style.top = 0;
            menu.parentNode.insertBefore(placeholder, menu);
            topHit();
        } else if (yOffset < absolutePosition && menu.style.position == 'fixed') {
            // stickyMover();
            menu.style.position = 'static';
            menu.style.top = 0 + 'px';
            
            menu.parentNode.removeChild(placeholder);
            topSplit();
        }
    });
});

var topHit = function() {
    d3.selectAll('text').transition().style("opacity", 0);
    // goal_text
    // .transition()
    // .style("opacity", 0);
    // // raised_text.style("opacity", 0);
    //
    // raised_text
    // .transition()
    // .style("opacity", 0);
    // raised_text.style("opacity", 0);
}
var topSplit = function() {
    // console.log(goal_text);
    d3.selectAll('text').transition().style("opacity", 1);
    // raised_text.transition().style("opacity", 1);
}
//======================================================
// //https://github.com/iamdustan/smoothscroll/blob/master/src/smoothscroll.js
// (function(w, d, undefined) {
//   'use strict';
//
//   /*
//    * aliases
//    * w: window global object
//    * d: document
//    * undefined: undefined
//    */
//
//   // polyfill
//   function polyfill() {
//     // return when scrollBehavior interface is supported
//     if ('scrollBehavior' in d.documentElement.style) {
//       return;
//     }
//
//     /*
//      * globals
//      */
//     var Element = w.HTMLElement || w.Element;
//     var SCROLL_TIME = 468;
//
//     /*
//      * object gathering original scroll methods
//      */
//     var original = {
//       scroll: w.scroll || w.scrollTo,
//       scrollBy: w.scrollBy,
//       elScroll: Element.prototype.scroll || scrollElement,
//       scrollIntoView: Element.prototype.scrollIntoView
//     };
//
//     /*
//      * define timing method
//      */
//     var now = w.performance && w.performance.now
//       ? w.performance.now.bind(w.performance) : Date.now;
//
//     /**
//      * changes scroll position inside an element
//      * @method scrollElement
//      * @param {Number} x
//      * @param {Number} y
//      */
//     function scrollElement(x, y) {
//       this.scrollLeft = x;
//       this.scrollTop = y;
//     }
//
//     /**
//      * returns result of applying ease math function to a number
//      * @method ease
//      * @param {Number} k
//      * @returns {Number}
//      */
//     function ease(k) {
//       return 0.5 * (1 - Math.cos(Math.PI * k));
//     }
//
//     /**
//      * indicates if a smooth behavior should be applied
//      * @method shouldBailOut
//      * @param {Number|Object} x
//      * @returns {Boolean}
//      */
//     function shouldBailOut(x) {
//       if (typeof x !== 'object'
//             || x === null
//             || x.behavior === undefined
//             || x.behavior === 'auto'
//             || x.behavior === 'instant') {
//         // first arg not an object/null
//         // or behavior is auto, instant or undefined
//         return true;
//       }
//
//       if (typeof x === 'object'
//             && x.behavior === 'smooth') {
//         // first argument is an object and behavior is smooth
//         return false;
//       }
//
//       // throw error when behavior is not supported
//       throw new TypeError('behavior not valid');
//     }
//
//     /**
//      * finds scrollable parent of an element
//      * @method findScrollableParent
//      * @param {Node} el
//      * @returns {Node} el
//      */
//     function findScrollableParent(el) {
//       var isBody;
//       var hasScrollableSpace;
//       var hasVisibleOverflow;
//
//       do {
//         el = el.parentNode;
//
//         // set condition variables
//         isBody = el === d.body;
//         hasScrollableSpace =
//           el.clientHeight < el.scrollHeight ||
//           el.clientWidth < el.scrollWidth;
//         hasVisibleOverflow =
//           w.getComputedStyle(el, null).overflow === 'visible';
//       } while (!isBody && !(hasScrollableSpace && !hasVisibleOverflow));
//
//       isBody = hasScrollableSpace = hasVisibleOverflow = null;
//
//       return el;
//     }
//
//     /**
//      * self invoked function that, given a context, steps through scrolling
//      * @method step
//      * @param {Object} context
//      */
//     function step(context) {
//       // call method again on next available frame
//       context.frame = w.requestAnimationFrame(step.bind(w, context));
//
//       var time = now();
//       var value;
//       var currentX;
//       var currentY;
//       var elapsed = (time - context.startTime) / SCROLL_TIME;
//
//       // avoid elapsed times higher than one
//       elapsed = elapsed > 1 ? 1 : elapsed;
//
//       // apply easing to elapsed time
//       value = ease(elapsed);
//
//       currentX = context.startX + (context.x - context.startX) * value;
//       currentY = context.startY + (context.y - context.startY) * value;
//
//       context.method.call(context.scrollable, currentX, currentY);
//
//       // return when end points have been reached
//       if (currentX === context.x && currentY === context.y) {
//         w.cancelAnimationFrame(context.frame);
//         return;
//       }
//     }
//
//     /**
//      * scrolls window with a smooth behavior
//      * @method smoothScroll
//      * @param {Object|Node} el
//      * @param {Number} x
//      * @param {Number} y
//      */
//     function smoothScroll(el, x, y) {
//       var scrollable;
//       var startX;
//       var startY;
//       var method;
//       var startTime = now();
//       var frame;
//
//       // define scroll context
//       if (el === d.body) {
//         scrollable = w;
//         startX = w.scrollX || w.pageXOffset;
//         startY = w.scrollY || w.pageYOffset;
//         method = original.scroll;
//       } else {
//         scrollable = el;
//         startX = el.scrollLeft;
//         startY = el.scrollTop;
//         method = scrollElement;
//       }
//
//       // cancel frame when a scroll event's happening
//       if (frame) {
//         w.cancelAnimationFrame(frame);
//       }
//
//       // scroll looping over a frame
//       step({
//         scrollable: scrollable,
//         method: method,
//         startTime: startTime,
//         startX: startX,
//         startY: startY,
//         x: x,
//         y: y,
//         frame: frame
//       });
//     }
//
//     /*
//      * ORIGINAL METHODS OVERRIDES
//      */
//
//     // w.scroll and w.scrollTo
//     w.scroll = w.scrollTo = function() {
//       // avoid smooth behavior if not required
//       if (shouldBailOut(arguments[0])) {
//         original.scroll.call(
//           w,
//           arguments[0].left || arguments[0],
//           arguments[0].top || arguments[1]
//         );
//         return;
//       }
//
//       // LET THE SMOOTHNESS BEGIN!
//       smoothScroll.call(
//         w,
//         d.body,
//         ~~arguments[0].left,
//         ~~arguments[0].top
//       );
//     };
//
//     // w.scrollBy
//     w.scrollBy = function() {
//       // avoid smooth behavior if not required
//       if (shouldBailOut(arguments[0])) {
//         original.scrollBy.call(
//           w,
//           arguments[0].left || arguments[0],
//           arguments[0].top || arguments[1]
//         );
//         return;
//       }
//
//       // LET THE SMOOTHNESS BEGIN!
//       smoothScroll.call(
//         w,
//         d.body,
//         ~~arguments[0].left + (w.scrollX || w.pageXOffset),
//         ~~arguments[0].top + (w.scrollY || w.pageYOffset)
//       );
//     };
//
//     // Element.prototype.scroll and Element.prototype.scrollTo
//     Element.prototype.scroll = Element.prototype.scrollTo = function() {
//       // avoid smooth behavior if not required
//       if (shouldBailOut(arguments[0])) {
//         original.elScroll.call(
//             this,
//             arguments[0].left || arguments[0],
//             arguments[0].top || arguments[1]
//         );
//         return;
//       }
//
//       // LET THE SMOOTHNESS BEGIN!
//       smoothScroll.call(
//           this,
//           this,
//           arguments[0].left,
//           arguments[0].top
//       );
//     };
//
//     // Element.prototype.scrollBy
//     Element.prototype.scrollBy = function() {
//       var arg0 = arguments[0];
//
//       if (typeof arg0 === 'object') {
//         this.scroll({
//           left: arg0.left + this.scrollLeft,
//           top: arg0.top + this.scrollTop,
//           behavior: arg0.behavior
//         });
//       } else {
//         this.scroll(
//           this.scrollLeft + arg0,
//           this.scrollTop + arguments[1]
//         );
//       }
//     };
//
//     // Element.prototype.scrollIntoView
//     Element.prototype.scrollIntoView = function() {
//       // avoid smooth behavior if not required
//       if (shouldBailOut(arguments[0])) {
//         original.scrollIntoView.call(this, arguments[0] || true);
//         return;
//       }
//
//       // LET THE SMOOTHNESS BEGIN!
//       var scrollableParent = findScrollableParent(this);
//       var parentRects = scrollableParent.getBoundingClientRect();
//       var clientRects = this.getBoundingClientRect();
//
//       if (scrollableParent !== d.body) {
//         // reveal element inside parent
//         smoothScroll.call(
//           this,
//           scrollableParent,
//           scrollableParent.scrollLeft + clientRects.left - parentRects.left,
//           scrollableParent.scrollTop + clientRects.top - parentRects.top
//         );
//         // reveal parent in viewport
//         w.scrollBy({
//           left: parentRects.left,
//           top: parentRects.top,
//           behavior: 'smooth'
//         });
//       } else {
//         // reveal element in viewport
//         w.scrollBy({
//           left: clientRects.left,
//           top: clientRects.top,
//           behavior: 'smooth'
//         });
//       }
//     };
//   }
//
//   if (typeof exports === 'object') {
//     // commonjs
//     module.exports = { polyfill: polyfill };
//   } else {
//     // global
//     polyfill();
//   }
// })(window, document);
