/* Copyright (c) Ericsson 2016 */

define("jscore/ext/binding",["jscore/core"],function(t){function e(t,e){return new s({get:function(){return t.getAttribute(e)},set:function(n){return t.setAttribute(e,n)},events:i(t,"change:"+e)})}var n=function(t){this.subscribe=t};n.extend=t.extend,n.prototype={map:function(t){return new n(function(e){this.subscribe(function(n){e(t(n))})}.bind(this))}};var i=function(t,e){return new n(function(n){t.addEventHandler(e,n)})},s=n.extend({constructor:function(t){this.subscribers=[],this.options=t,t.events&&t.get?(this.events=t.events.map(t.get),this.trigger(t.get()),this.events.subscribe(this.trigger.bind(this))):this.events=new n(function(){})},subscribe:function(t){"function"==typeof t?this.events.subscribe(t):(this.subscribers.push(t),void 0!==this.value&&t.fn(this.value))},addSyncSource:function(t){t.subscribe({source:this,fn:function(e){this.value=e,this.options.set&&this.options.set(e),this.notifyExcept(t)}.bind(this)})},trigger:function(t){this.value!==t&&(this.value=t,this.notifyExcept())},notifyExcept:function(t){for(var e in this.subscribers){var n=this.subscribers[e];n.source!==t&&n.fn(this.value)}},bind:function(t){t.addSyncSource(this),this.addSyncSource(t)}}),r={text:function(t){return new s({set:t.setText.bind(t)})},value:function(t){return new s({get:t.getValue.bind(t),set:t.setValue.bind(t),events:i(t,"focusOut change paste cut input")})}},u={bindModel:function(t,n,i,s){var u=e(t,n),o="function"==typeof s?s:r[s],c=o(i);u.bind(c)},bindCollection:function(t,e,n){var i={},s={},r=function(t){var i=s[t.cid];i||(i=n(t),s[t.cid]=i),i.attachTo(e)},u=function(){t.each(r)},o=function(t){s[t.cid].destroy(),delete s[t.cid]},c=function(){for(var t in s)s[t].destroy(),delete s[t]};return u(),i.add=t.addEventHandler("add",r),i.remove=t.addEventHandler("remove",o),i.reset=t.addEventHandler("reset",function(){setData(t)}),i.sort=t.addEventHandler("sort",function(){for(var t in s)s[t].detach();u()}),function(){for(var e in i)t.removeEventHandler(e,i[e]);c()}},Bindable:s,modelAttribute:e,value:r.value,text:r.text,eventTargetObservable:i};return u.bind=u.bindModel,u});