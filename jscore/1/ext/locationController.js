/* Copyright (c) Ericsson 2016 */

define("jscore/ext/locationController",["../core","jscore/ext/privateStore"],function(t,e){"use strict";function n(){function t(){return(65536*(1+Math.random())|0).toString(16).substring(1)}return t()+t()+"-"+t()+"-"+t()+"-"+t()+"-"+t()+t()+t()+"-"+(new Date).getTime()}function i(){var t=this.getLocation();if(t!==o(this).currentUrl)if(o(this).currentUrl=t,o(this).preventListeners)o(this).preventListeners=!1;else{var e=new RegExp("^"+this.namespace+"(?![a-zA-Z0-9])","i");if(this.namespace&&e.test(t)||!this.namespace){if(this.namespace){var n=null!==t.match(this.namespace)?t.match(this.namespace)[0]:this.namespace;t=t.substring(n.length),"/"===t[0]&&(t=t.substring(1))}var i=t.indexOf("?"),s={path:i>=0?t.substring(0,i):t,query:a(t)};for(var r in o(this).handlers)o(this).handlers.hasOwnProperty(r)&&o(this).handlers[r](t,s)}}}function s(){o(this).listener=i.bind(this),o(this).listenerEvent=t.Window.addEventHandler("hashchange",o(this).listener)}function a(t){var e=t.indexOf("?"),n={};if(e>-1){var i=t.substr(e+1);i.split("&").forEach(function(t){var e=t.split("="),i=e[0],s=e[1];void 0===n[i]||n[i]instanceof Array||(n[i]=[n[i]]),n[i]?n[i].push(s):n[i]=s})}return n}function r(t){this.options=t,o(this).handlers={},o(this).preventListeners=!1,this.init.apply(this,arguments),t&&t.namespace&&(this.namespace=t.namespace),t&&void 0!==t.autoUrlDecode?this.autoUrlDecode=t.autoUrlDecode:this.autoUrlDecode=!0}var o=e.create();return r.prototype={init:function(t){},getLocation:function(){var t;if(this.autoUrlDecode){var e=window.location.hash;t=decodeURIComponent(e),"#"===t.charAt(0)&&(t=t.substr(1))}else{var n=location.href.indexOf("#");t=n>-1?location.href.substr(n+1):""}return t},getNamespaceLocation:function(){var t=this.getLocation();return this.namespace&&(t=t.substring(this.namespace.length+1)),t},setLocation:function(t,e,n){t!==this.getLocation()&&(e?o(this).preventListeners=!0:o(this).preventListeners=!1,n?(history.replaceState(history.state||{},"","#"+t),i.call(this)):window.location.hash=t)},setNamespaceLocation:function(t,e,n){this.namespace&&(t=this.namespace+"/"+t),this.setLocation(t,e,n)},addLocationListener:function(t,e){var i=n();return o(this).handlers[i]=e?t.bind(e):t,i},removeLocationListener:function(t){delete o(this).handlers[t]},start:function(){i.call(this),s.call(this)},stop:function(){delete o(this).currentUrl,t.Window.removeEventHandler(o(this).listenerEvent)}},r.extend=t.extend,r});