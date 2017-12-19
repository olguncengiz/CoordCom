/* Copyright (c) Ericsson 2016 */

define("jscore/ext/keyboard",["jscore/core"],function(e){"use strict";var t={},i=0,n=[],r={esc:27,tab:9,space:32,enter:13,backspace:8,scroll:145,caps:20,num:144,pause:19,"break":19,insert:45,home:36,"delete":46,end:35,pageup:33,pagedown:34,left:37,up:38,right:39,down:40,f1:112,f2:113,f3:114,f4:115,f5:116,f6:117,f7:118,f8:119,f9:120,f10:121,f11:122,f12:123},s={shift:{},ctrl:{},alt:{},meta:{},init:function(){this.shift={binded:!1,pressed:!1},this.ctrl={binded:!1,pressed:!1},this.alt={binded:!1,pressed:!1},this.meta={binded:!1,pressed:!1}},setPressed:function(e){e.shiftKey&&(this.shift.pressed=!0),e.ctrlKey&&(this.ctrl.pressed=!0),e.altKey&&(this.alt.pressed=!0),e.metaKey&&(this.meta.pressed=!0)},setBinded:function(e){return"ctrl"===e?(this.ctrl.binded=!0,!0):"shift"===e?(this.shift.binded=!0,!0):"alt"===e?(this.alt.binded=!0,!0):"meta"===e?(this.meta.binded=!0,!0):!1},check:function(){return this.ctrl.pressed===this.ctrl.binded&&this.shift.pressed===this.shift.binded&&this.alt.pressed===this.alt.binded&&this.meta.pressed===this.meta.binded}},d=function(e){var t=e;if(void 0!==e.originalEvent&&(t=e.originalEvent),void 0===t.keyCode)return!0;for(var i=String.fromCharCode(t.keyCode).toLowerCase(),d=0;d<n.length;d++){var a=n[d];s.init(),s.setPressed(t);for(var o=a.__keys.split("+"),h=0,l=0;l<o.length;l++){var f=o[l];s.setBinded(f)&&h++,f.length>1?r[f]===t.keyCode&&h++:i===f&&h++}if(h===o.length&&s.check()){var c=!1;if(a.__element?a.__element.getNative()===document.activeElement&&(c=!0):c=!0,c)return a.__callback(),t.stopPropagation(),t.preventDefault(),!1}}return!0};return t.addEventHandler=function(t,r,s){t=t.toLowerCase();var a=0;t.split("+").forEach(function(e){var t=-1!==["ctrl","alt","shift"].indexOf(e);if(t||a++,a>1)throw new Error("Cannot have more than 1 non-modifier in combination.")}),0===n.length&&e.Window.addEventHandler("keydown",d.bind(this));var o={__id:i++,__keys:t,__callback:r,__element:s};return n.push(o),o},t.removeEventHandler=function(t){for(var i=0;i<n.length;i++){var r=n[i];if(r.__id===t.__id)return n.splice(i,1),void(0===n.length&&e.Window.removeEventHandler("keydown",d.bind(this)))}},t});