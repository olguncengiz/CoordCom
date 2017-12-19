/*!

 handlebars v1.3.0

Copyright (C) 2011 by Yehuda Katz

Permission is hereby granted, free of charge, to any person obtaining a copy
of this software and associated documentation files (the "Software"), to deal
in the Software without restriction, including without limitation the rights
to use, copy, modify, merge, publish, distribute, sublicense, and/or sell
copies of the Software, and to permit persons to whom the Software is
furnished to do so, subject to the following conditions:

The above copyright notice and this permission notice shall be included in
all copies or substantial portions of the Software.

THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,
FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE
AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER
LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM,
OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN
THE SOFTWARE.

@license
*/
define("jscore/handlebars/handlebars",function(){var t=function(){"use strict";function t(t){this.string=t}var r;return t.prototype.toString=function(){return""+this.string},r=t}(),r=function(t){"use strict";function r(t){return s[t]||"&amp;"}function e(t,r){for(var e in r)Object.prototype.hasOwnProperty.call(r,e)&&(t[e]=r[e])}function n(t){return t instanceof a?t.toString():t||0===t?(t=""+t,c.test(t)?t.replace(l,r):t):""}function i(t){return t||0===t?f(t)&&0===t.length?!0:!1:!0}var o={},a=t,s={"&":"&amp;","<":"&lt;",">":"&gt;",'"':"&quot;","'":"&#x27;","`":"&#x60;"},l=/[&<>"'`]/g,c=/[&<>"'`]/;o.extend=e;var u=Object.prototype.toString;o.toString=u;var p=function(t){return"function"==typeof t};p(/x/)&&(p=function(t){return"function"==typeof t&&"[object Function]"===u.call(t)});var p;o.isFunction=p;var f=Array.isArray||function(t){return t&&"object"==typeof t?"[object Array]"===u.call(t):!1};return o.isArray=f,o.escapeExpression=n,o.isEmpty=i,o}(t),e=function(){"use strict";function t(t,r){var n;r&&r.firstLine&&(n=r.firstLine,t+=" - "+n+":"+r.firstColumn);for(var i=Error.prototype.constructor.call(this,t),o=0;o<e.length;o++)this[e[o]]=i[e[o]];n&&(this.lineNumber=n,this.column=r.firstColumn)}var r,e=["description","fileName","lineNumber","message","name","number","stack"];return t.prototype=new Error,r=t}(),n=function(t,r){"use strict";function e(t,r){this.helpers=t||{},this.partials=r||{},n(this)}function n(t){t.registerHelper("helperMissing",function(t){if(2===arguments.length)return void 0;throw new s("Missing helper: '"+t+"'")}),t.registerHelper("blockHelperMissing",function(r,e){var n=e.inverse||function(){},i=e.fn;return f(r)&&(r=r.call(this)),r===!0?i(this):r===!1||null==r?n(this):p(r)?r.length>0?t.helpers.each(r,e):n(this):i(r)}),t.registerHelper("each",function(t,r){var e,n=r.fn,i=r.inverse,o=0,a="";if(f(t)&&(t=t.call(this)),r.data&&(e=d(r.data)),t&&"object"==typeof t)if(p(t))for(var s=t.length;s>o;o++)e&&(e.index=o,e.first=0===o,e.last=o===t.length-1),a+=n(t[o],{data:e});else for(var l in t)t.hasOwnProperty(l)&&(e&&(e.key=l,e.index=o,e.first=0===o),a+=n(t[l],{data:e}),o++);return 0===o&&(a=i(this)),a}),t.registerHelper("if",function(t,r){return f(t)&&(t=t.call(this)),!r.hash.includeZero&&!t||a.isEmpty(t)?r.inverse(this):r.fn(this)}),t.registerHelper("unless",function(r,e){return t.helpers["if"].call(this,r,{fn:e.inverse,inverse:e.fn,hash:e.hash})}),t.registerHelper("with",function(t,r){return f(t)&&(t=t.call(this)),a.isEmpty(t)?void 0:r.fn(t)}),t.registerHelper("log",function(r,e){var n=e.data&&null!=e.data.level?parseInt(e.data.level,10):1;t.log(n,r)})}function i(t,r){g.log(t,r)}var o={},a=t,s=r,l="1.3.0";o.VERSION=l;var c=4;o.COMPILER_REVISION=c;var u={1:"<= 1.0.rc.2",2:"== 1.0.0-rc.3",3:"== 1.0.0-rc.4",4:">= 1.0.0"};o.REVISION_CHANGES=u;var p=a.isArray,f=a.isFunction,h=a.toString,v="[object Object]";o.HandlebarsEnvironment=e,e.prototype={constructor:e,logger:g,log:i,registerHelper:function(t,r,e){if(h.call(t)===v){if(e||r)throw new s("Arg not supported with multiple helpers");a.extend(this.helpers,t)}else e&&(r.not=e),this.helpers[t]=r},registerPartial:function(t,r){h.call(t)===v?a.extend(this.partials,t):this.partials[t]=r}};var g={methodMap:{0:"debug",1:"info",2:"warn",3:"error"},DEBUG:0,INFO:1,WARN:2,ERROR:3,level:3,log:function(t,r){if(g.level<=t){var e=g.methodMap[t];"undefined"!=typeof console&&console[e]&&console[e].call(console,r)}}};o.logger=g,o.log=i;var d=function(t){var r={};return a.extend(r,t),r};return o.createFrame=d,o}(r,e),i=function(t,r,e){"use strict";function n(t){}function i(t,r){if(!r)throw new p("No environment passed to template");var e=function(t,e,n,i,o,a){var s=r.VM.invokePartial.apply(this,arguments);if(null!=s)return s;if(r.compile){var l={helpers:i,partials:o,data:a};return o[e]=r.compile(t,{data:void 0!==a},r),o[e](n,l)}throw new p("The partial "+e+" could not be compiled when running in runtime-only mode")},n={escapeExpression:u.escapeExpression,invokePartial:e,programs:[],program:function(t,r,e){var n=this.programs[t];return e?n=a(t,r,e):n||(n=this.programs[t]=a(t,r)),n},merge:function(t,r){var e=t||r;return t&&r&&t!==r&&(e={},u.extend(e,r),u.extend(e,t)),e},programWithDepth:r.VM.programWithDepth,noop:r.VM.noop,compilerInfo:null};return function(e,i){i=i||{};var o,a,s=i.partial?i:r;i.partial||(o=i.helpers,a=i.partials);var l=t.call(n,s,e,o,a,i.data);return i.partial||r.VM.checkRevision(n.compilerInfo),l}}function o(t,r,e){var n=Array.prototype.slice.call(arguments,3),i=function(t,i){return i=i||{},r.apply(this,[t,i.data||e].concat(n))};return i.program=t,i.depth=n.length,i}function a(t,r,e){var n=function(t,n){return n=n||{},r(t,n.data||e)};return n.program=t,n.depth=0,n}function s(t,r,e,n,i,o){var a={partial:!0,helpers:n,partials:i,data:o};if(void 0===t)throw new p("The partial "+r+" could not be found");return t instanceof Function?t(e,a):void 0}function l(){return""}var c={},u=t,p=r;e.COMPILER_REVISION,e.REVISION_CHANGES;return c.checkRevision=n,c.template=i,c.programWithDepth=o,c.program=a,c.invokePartial=s,c.noop=l,c}(r,e,n),o=function(t,r,e,n,i){"use strict";var o,a=t,s=r,l=e,c=n,u=i,p=function(){var t=new a.HandlebarsEnvironment;return c.extend(t,a),t.SafeString=s,t.Exception=l,t.Utils=c,t.VM=u,t.template=function(r){return u.template(r,t)},t},f=p();return f.create=p,o=f}(n,t,e,r,i);return o});