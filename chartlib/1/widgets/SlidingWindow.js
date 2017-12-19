/* Copyright (c) Ericsson 2016 */

define("styles!chartlib/widgets/slidingwindow/_slidingWindow.less",function(){return".elChartlib-wSlidingWindow {\n  position: relative;\n  height: 100%;\n}\n.elChartlib-wSlidingWindow-overlayGroup {\n  position: relative;\n  height: 100%;\n}\n.elChartlib-wSlidingWindow-overlayLeft,\n.elChartlib-wSlidingWindow-overlayRight {\n  position: absolute;\n  height: 100%;\n  background-color: rgba(230, 239, 239, 0.7);\n  cursor: -webkit-grab;\n  cursor: -moz-grab;\n  cursor: grab;\n}\n.elChartlib-wSlidingWindow-overlayLeft:active,\n.elChartlib-wSlidingWindow-overlayRight:active {\n  cursor: grabbing;\n  cursor: -webkit-grabbing;\n  cursor: -moz-grabbing;\n}\n.elChartlib-wSlidingWindow-overlayLeftHandle,\n.elChartlib-wSlidingWindow-overlayRightHandle {\n  position: absolute;\n  top: 0;\n  bottom: 0;\n  height: 100%;\n  padding: 0 10px;\n  cursor: pointer;\n  -webkit-user-select: none;\n  -moz-user-select: none;\n  user-select: none;\n}\n.elChartlib-wSlidingWindow-overlayLeftHandleIcon,\n.elChartlib-wSlidingWindow-overlayRightHandleIcon {\n  position: relative;\n  top: calc(50% - 8px);\n}\n.elChartlib-wSlidingWindow-overlayLeft {\n  left: 0;\n}\n.elChartlib-wSlidingWindow-overlayLeftHandle {\n  right: 0;\n}\n.elChartlib-wSlidingWindow-overlayRight {\n  right: 0;\n}\n.elChartlib-wSlidingWindow-overlayRightHandle {\n  left: 0;\n}\n"}),define("text!chartlib/widgets/slidingwindow/_slidingWindow.html",function(){return'<div class="elChartlib-wSlidingWindow">\n\n    <div class="elChartlib-wSlidingWindow-overlayGroup">\n        <div class="elChartlib-wSlidingWindow-overlayLeft">\n            <div class="elChartlib-wSlidingWindow-overlayLeftHandle">\n                <i class="ebIcon ebIcon_grabHandle ebIcon_interactive elChartlib-wSlidingWindow-overlayLeftHandleIcon"></i>\n            </div>\n        </div>\n        <div class="elChartlib-wSlidingWindow-overlayRight">\n            <div class="elChartlib-wSlidingWindow-overlayRightHandle">\n                <i class="ebIcon ebIcon_grabHandle ebIcon_interactive elChartlib-wSlidingWindow-overlayRightHandleIcon"></i>\n            </div>\n        </div>\n    </div>\n</div>\n'}),define("chartlib/widgets/slidingwindow/SlidingWindowView",["jscore/core","jscore/ext/privateStore","text!./_slidingWindow.html","styles!./_slidingWindow.less"],function(i,t,n,e){"use strict";function l(i){return void 0===o(this)[i]&&(o(this)[i]=this.getElement().find(a+"-"+i)),o(this)[i]}var o=t.create(),a=".elChartlib-wSlidingWindow";return i.View.extend({getTemplate:function(){return n},getStyle:function(){return e},getOverlayLeft:function(){return l.call(this,"overlayLeft")},getOverlayRight:function(){return l.call(this,"overlayRight")},getOverlayLeftHandle:function(){return l.call(this,"overlayLeftHandle")},getOverlayRightHandle:function(){return l.call(this,"overlayRightHandle")}})}),define("chartlib/widgets/slidingwindow/SlidingWindow",["jscore/core","jscore/ext/privateStore","./SlidingWindowView"],function(i,t,n){"use strict";function e(){this.view.getOverlayLeftHandle().addEventHandler("mousedown touchstart",s.call(this,l,"start")),this.view.getOverlayRightHandle().addEventHandler("mousedown touchstart",s.call(this,l,"end")),this.view.getOverlayLeft().addEventHandler("mousedown touchstart",s.call(this,l,"start",!0)),this.view.getOverlayRight().addEventHandler("mousedown touchstart",s.call(this,l,"end",!0))}function l(t,n,e){h.call(this,["mouseMoveEvtId","mouseUpEvtId"]),c(this).mouseMoveEvtId=i.Element.wrap(document.body).addEventHandler("mousemove touchmove",s.call(this,o,t.originalEvent,n,e)),c(this).mouseUpEvtId=i.Element.wrap(document.body).addEventHandler("mouseup touchend",a.bind(this)),t.stopPropagation()}function o(i,t,n,e){i=i.originalEvent;var l=i.touches?i.touches[0].pageX:i.pageX,o=r.call(this),d=this.getPanelPosition(),s="start"===n?"end":"start",h=l,g=void 0!==c(this).lastFromPosition?c(this).lastFromPosition:l,w=100/(o/(h-g)),v=d[n]+w,u=d[s]+w,b={};b[n]=parseFloat(v.toFixed(3)),e&&(b[s]=parseFloat(u.toFixed(3))),this.setPanelPosition(b),c(this).lastFromPosition=h,d[n]!==b[n]&&a.call(this),e&&d[s]!==b[s]&&a.call(this)}function a(){c(this).lastFromPosition=void 0,h.call(this,["mouseMoveEvtId","mouseUpEvtId"]),this.trigger("change",this.getPanelPosition())}function r(){return c(this).windowWidth}function d(){c(this).windowWidth=this.getElement().getProperty("clientWidth")}function s(i){var t=Array.prototype.slice.call(arguments,0);return t[0]={},function(n){t[0]=n,i.apply(this,t)}.bind(this)}function h(i){i.forEach(function(i){void 0!==c(this)[i]&&c(this)[i].destroy()}.bind(this))}var c=t.create();return i.Widget.extend({View:n,init:function(){c(this).panelPosition={}},onDOMAttach:function(){d.call(this),this.setPanelPosition(this.options.overlay),e.call(this)},getPanelPosition:function(){return c(this).panelPosition},setPanelPosition:function(i){var t=this.getPanelPosition(),n=t.start,e=t.end,l=void 0!==i.start?Math.max(0,i.start):n,o=void 0!==i.end?Math.min(100,i.end):e;void 0!==i.start&&o>l&&(t.start=l,this.view.getOverlayLeft().setStyle("width",t.start+"%")),void 0!==i.end&&o>l&&(t.end=o,this.view.getOverlayRight().setStyle("width",100-t.end+"%"))}})}),define("chartlib/widgets/SlidingWindow",["chartlib/widgets/slidingwindow/SlidingWindow"],function(i){return i});