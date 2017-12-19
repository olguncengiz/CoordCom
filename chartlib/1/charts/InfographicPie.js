/* Copyright (c) Ericsson 2016 */

define("chartlib/charts/InfographicPie",["chartlib/base/d3","chartlib/charts/Chart"],function(t,e){"use strict";return e.extend({defaults:{theme:{title:{fontSize:38},subTitle:{fontSize:20},plotOptions:{infographicPie:{number:{unit:"%",fontWeight:"bold",fontSize:68,fontFamily:"Ericsson Capital, Arial",fill:"#58585b"},label:{fontWeight:"bold",fontSize:14,fill:"#58585b"},stroke:{color:"#ffffff",width:1}}}},plotOptions:{infographicPie:{radius:.7,innerRadius:.6}},grid:!1},onChartReady:function(){this.attachTo(this.options.element)},createPrivateVariables:function(){this.data=[],this.infographicPieWrapper=[],this.infographicLabelWrapper=[],this.radius=0,this.innerRadius=0,this.isSingleValue=!0,this.arcHelpers={}},redraw:function(){this.createWrapper(),this.update(this.options.data)},createWrapper:function(){0===this.infographicPieWrapper.length&&(this.infographicPieWrapper=this.svg.append("g").attr("id","infographicPieWrapper-"+this.id),this.infographicLabelWrapper=this.svg.append("g").attr("id","infographicLabelWrapper-"+this.id))},onUpdate:function(t){this.options.data=t,this.data=this.makeNominators(t);var e=this.chartSize,i=this.data,n=this.options,a=this.infographicPieWrapper,r=this.infographicLabelWrapper,s=this.arcHelpers,o=this.getSize();e.width=o.width-n.chart.margin.left-n.chart.margin.right,e.height=o.height-n.chart.margin.top-n.chart.margin.bottom,e.margins={left:n.chart.margin.left,top:n.chart.margin.top},e=this.changeSizeForTitle(e),this.figureOutRadius();var l=this.figureOutInnerTextRestriction(),h=this.figureOutOuterTextRestriction();this.createArcHelpers(),this.positionPie();var c=a.selectAll(".arc").data(s.pie(i.nominators)),u=this.isSingleValue===!0?[i.nominators[0]]:i.nominators,p=r.selectAll(".label").data(u);p.enter().append("g").attr("class","label");var f=p.selectAll(".labelNumber").data(function(t){return[t]}),d=p.selectAll(".labelText").data(function(t){return[t]});if(this.updatePieArcs(c),this.updateLabelNumber(f),this.createNewPieArcs(c),this.createNewLabelNumber(f,l,h),this.createNewLabelText(d,l,h),this.positionLabelGroup(p,l,h),n.theme.plotOptions.infographicPie.stroke!==!1){var g=a.selectAll(".arcLine").data(s.pie(i.nominators));this.updateArcLine(g),this.createArcLine(g)}},makeNominators:function(t){if(1===t.length){for(;t[0].value>100;)t[0].value/=10;return{nominators:[{label:t[0].label,value:t[0].value},{label:"",value:100-t[0].value}]}}this.isSingleValue=!1;var e=t[0].value+t[1].value;return{nominators:[{label:t[0].label,value:t[0].value/e*100},{label:t[1].label,value:t[1].value/e*100}]}},figureOutRadius:function(){var t=this.chartSize,e=(t.width-t.margins.left)*(this.isSingleValue===!0?1:.4),i=t.height-t.margins.top,n=Math.min(e,i);this.radius=n/1.5,this.radius*=this.options.plotOptions.infographicPie.radius,this.innerRadius=this.radius*this.options.plotOptions.infographicPie.innerRadius},figureOutInnerTextRestriction:function(){var t=2*Math.sqrt(Math.pow(this.innerRadius,2)/2);return{left:this.chartSize.margins.left+this.chartSize.width/2-t/2,top:this.chartSize.margins.top+this.chartSize.height/2-t/2,width:t,height:t}},figureOutOuterTextRestriction:function(){var t=this.chartSize,e=this.radius;return{left:{x:t.margins.left,y:t.margins.top+t.height/2-e,width:t.width/2-e-e/5,height:2*e},right:{x:t.margins.left+t.width/2+e+e/5,y:t.margins.top+t.height/2-e,width:t.width/2-e-e/5,height:2*e}}},createArcHelpers:function(){this.arcHelpers.arc=t.svg.arc().outerRadius(this.radius).innerRadius(this.innerRadius),this.arcHelpers.pie=t.layout.pie().sort(null).value(function(t){return t.value})},positionPie:function(){var t=this.chartSize,e=t.margins.left+t.width/2,i=t.margins.top+t.height/2;this.infographicPieWrapper.attr("transform","translate("+e+","+i+")")},updatePieArcs:function(t){var e=this.options,i=this;t.attr("class","update arc clickable hoverable datapoint").each(function(t){isNaN(t.startAngle)&&(t.startAngle=0),isNaN(t.endAngle)&&(t.endAngle=0)}).transition().duration(e.animation.transitionDuration).delay(e.animation.transitionDelay).ease(e.animation.easing).attrTween("d",function(t){return i.arcTween(t,this,i)}).attr("fill",function(t){return i.colorScale(t.data.label,t)})},updateLabelNumber:function(e){var i=this.options,n=this;e.attr("class","update labelNumber").transition().duration(i.animation.transitionDuration).delay(i.animation.transitionDelay).ease(i.animation.easing).tween("text",function(e){var a=t.interpolate(this.textContent.replace(i.theme.plotOptions.infographicPie.number.unit,"").replace(",","."),n.roundToDecimals(e.value).replace(",","."));return this.textContent=a(0),function(t){this.textContent=n.roundToDecimals(a(t))+i.theme.plotOptions.infographicPie.number.unit}})},createNewPieArcs:function(t){var e=this,i=this.options;t.enter().append("path").attr("class","enter arc clickable hoverable datapoint").each(function(t){isNaN(t.startAngle)&&(t.startAngle=0),isNaN(t.endAngle)&&(t.endAngle=0),this._current=t}).attr("d",this.arcHelpers.arc).attr("fill",function(t){return e.colorScale(t.data.label,t)}).transition().duration(i.animation.transitionDuration).delay(i.animation.transitionDelay).ease(i.animation.easing).attrTween("d",function(t){return e.arcTween(t,this,e)})},createNewLabelNumber:function(t,e,i){var n=this.options,a=this,r=this.isSingleValue;t.enter().append("text").attr("class","enter labelNumber").attr("font-family",n.theme.plotOptions.infographicPie.number.fontFamily).attr("fill",n.theme.plotOptions.infographicPie.number.fill).attr("dy","0.7em").text(function(t){return a.roundToDecimals(t.value)+n.theme.plotOptions.infographicPie.number.unit}),t.attr("font-size",function(){var t,i=0===n.chart.decimals?"100":"00",s=n.theme.plotOptions.infographicPie.number.fontSize;i+=n.chart.decimals>0?n.chart.decimalSeparator:"";for(var o=0;o<n.chart.decimals;o++)i+="0";for(i+=n.theme.plotOptions.infographicPie.number.unit,t=a.measureTextFieldSize(i,s,n.theme.plotOptions.infographicPie.number.fontFamily);t.width>e.width&&(s-=2,!(10>s));)t=a.measureTextFieldSize(i,s,n.theme.plotOptions.infographicPie.number.fontFamily);return r===!0?s:2.5*s}).attr("text-anchor",function(t,e,i){return r===!0?"middle":0===i?"end":"start"}).attr("x",function(t,n,a){return r===!0?e.left+e.width/2:0===a?i.left.x+i.left.width:i.right.x})},createNewLabelText:function(e,i,n){var a=this.options,r=this.wrapTextField.bind(this),s=this.isSingleValue;e.enter().append("text").attr("class","enter labelText").attr("font-family",a.theme.plotOptions.infographicPie.label.fontFamily).attr("font-size",a.theme.plotOptions.infographicPie.label.fontSize).attr("fill",a.theme.plotOptions.infographicPie.label.fill).attr("text-anchor",function(t,e,i){return s?"middle":0===i?"end":"start"}),e.attr("x",function(t,e,a){return s?i.left+i.width/2:0===a?n.left.x+n.left.width:n.right.x}).attr("y",function(){var e=10;return s===!0&&(e=5),e+.72*t.select(this).attr("font-size")+.72*t.select(this.parentNode).select(".labelNumber").attr("font-size")}).each(function(e,a,o){var l=t.select(this),h=l.selectAll("tspan"),c=0===o?n.left.x+n.left.width:n.right.x,u=n.right.width,p=10,f=1.1;s&&(c=i.left+i.width/2,u=i.width,p=3),h.empty()||h.remove(),s&&(i.width<50||i.height<50)||r(l,e.label,c,u,f,p)})},positionLabelGroup:function(e,i,n){var a=this.isSingleValue;e.attr("transform",function(){var e=0,r=0;if(a)r=i.top+(i.height-.85*this.getBBox().height)/2;else{var s=.7*t.select(this).select(".labelNumber").node().getBBox().height;r=n.right.y,r+=(n.right.height-s)/2}return"translate("+e+","+r+")"})},arcTween:function(e,i,n){isNaN(i._current.endAngle)&&(i._current.endAngle=0,i._current.startAngle=0,e.endAngle=0,e.startAngle=0);var a=t.interpolate(i._current,e);return i._current=a(0),function(t){return n.arcHelpers.arc(a(t))}},updateArcLine:function(t){var e=this.options,i=this;t.each(function(t){isNaN(t.startAngle)&&(t.startAngle=0),isNaN(t.endAngle)&&(t.endAngle=0)}).transition().duration(e.animation.transitionDuration).delay(e.animation.transitionDelay).ease(e.animation.easing).attrTween("d",function(t){return i.lineTween(t,this,i)})},createArcLine:function(t){var e,i,n=this.options,a=this;n.theme.plotOptions.infographicPie.stroke===!0?(e="white",i=1):(e=n.theme.plotOptions.infographicPie.stroke.color,i=n.theme.plotOptions.infographicPie.stroke.width),t.enter().append("path").style("stroke-width",i).attr("class","arcLine").attr("stroke",e).each(function(t){this._current=t}).attr("d",function(t){return a.arcLine(t,a)}).transition().duration(n.animation.transitionDuration).delay(n.animation.transitionDelay).ease(n.animation.easing).attrTween("d",function(t){return a.lineTween(t,this,a)})},arcLine:function(t,e){isNaN(t.startAngle)&&(t.startAngle=0),isNaN(t.endAngle)&&(t.endAngle=0);var i=Math.sin(t.startAngle)*e.innerRadius,n=Math.cos(t.startAngle)*e.innerRadius*-1,a=Math.sin(t.startAngle)*e.radius,r=Math.cos(t.startAngle)*e.radius*-1,s=" M"+i+","+n+" L"+i+","+n+" L"+a+","+r;return s},lineTween:function(e,i,n){isNaN(i._current.endAngle)&&(i._current.endAngle=0,i._current.startAngle=0,e.endAngle=0,e.startAngle=0);var a=t.interpolate(i._current,e);return i._current=a(0),function(t){return n.arcLine(a(t),n)}},getTooltipContent:function(t){var e="function"==typeof this.options.tooltip.format?this.options.tooltip.format:function(t){var e=t.label||"";return e.length>15&&(e=e.substr(0,15)+"..."),(t.label?e+" : ":"")+t.value.toString()};return e.call(this,this.cleanEventData(t))},cleanEventData:function(t){var e={};return Object.defineProperties(e,{label:{value:t.data.label},value:{value:t.data.value}}),e}})});