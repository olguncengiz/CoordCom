/* Copyright (c) Ericsson 2016 */

define("chartlib/charts/MultiFigure",["chartlib/base/d3","chartlib/charts/Chart"],function(t,i){"use strict";return i.extend({defaults:{theme:{title:{fontSize:38},subTitle:{fontSize:20},plotOptions:{pictorial:{number:{fontWeight:"normal",fontFamily:"Ericsson Capital, Arial",fontSize:"100",fill:"#58585b"},descriptive:{fontFamily:"Arial",fontWeight:"normal",fontSize:13,fill:"#58585b"}}}},plotOptions:{pictorial:{descriptive:!1}},chart:{margin:"useSpecialMargins"},grid:!1},onChartReady:function(){this.attachTo(this.options.element)},createPrivateVariables:function(){this.data=[],this.multiFigureWrapper=[],this.labelWrapper=[],this.numberWrapper=[],this.figureWrapper=[],this.nominatorClipPath=[],this.denominatorClipPath=[],this.table=null,this.figureSize=null,this.useSpecialMargins=!1,"useSpecialMargins"===this.options.chart.margin&&(this.useSpecialMargins=!0),this.FIGURE_GAP=.15,this.UNSELECTED_OPACITY=.4,this.figureCount=null,this.previousFigureCount={filledFigures:0,nonfilledFigures:0,totalFigures:0},this.figureHeight=0,this.previousTable=null,this.scaleChanged=!1,this.isZeroValues=!1,this.wasZeroValues=!1,this.hasFraction=0},redraw:function(){if(this.createWrapper(),this.createFractionClipPaths(),this.useSpecialMargins===!0){var t=this.getSize();t=.0476*t.width,this.options.chart.margin={top:t,bottom:t,left:0,right:0}}this.update(this.options.data)},createWrapper:function(){0===this.multiFigureWrapper.length&&(this.multiFigureWrapper=this.svg.append("g").attr("id","singleFigureWrapper-"+this.id),this.numberWrapper=this.multiFigureWrapper.append("g").attr("id","numberWrapper-"+this.id),this.labelWrapper=this.multiFigureWrapper.append("g").attr("id","labelWrapper-"+this.id),this.figureWrapper=this.multiFigureWrapper.append("g").attr("id","figureWrapper-"+this.id))},createFractionClipPaths:function(){0===this.nominatorClipPath.length&&(this.nominatorClipPath=this.defs.append("clipPath"),this.nominatorClipPath.attr("id","nominatorClipPath-"+this.id).append("rect"),this.denominatorClipPath=this.defs.append("clipPath"),this.denominatorClipPath.attr("id","denominatorClipPath-"+this.id).append("rect"))},onUpdate:function(t){this.options.data=t,this.data=t,this.data[0].value=this.roundToDecimals(this.data[0].value),this.data[1].value=this.roundToDecimals(this.data[1].value),this.hasFraction=this.data[0].value%1,this.figureCount={filledFigures:parseFloat(this.data[0].value),nonfilledFigures:parseFloat(this.data[1].value)-parseFloat(this.data[0].value),totalFigures:parseFloat(this.data[1].value)},0===parseFloat(this.figureCount.totalFigures)&&(this.isZeroValues=!0),this.firstRun===!1&&0===parseFloat(this.previousFigureCount.totalFigures)&&(this.wasZeroValues=!0);var i=this.chartSize,a=this.data,e=this.options,r=this.getSize();if(i.width=r.width-e.chart.margin.left-e.chart.margin.right,i.height=r.height-e.chart.margin.top-e.chart.margin.bottom,i.margins={left:e.chart.margin.left,top:e.chart.margin.top},i=this.changeSizeForTitle(i),this.positionWrapper(),this.setAreaSizes(),e.plotOptions.pictorial.descriptive!==!1){var n=this.labelWrapper.selectAll(".label").data([{value:0,label:e.plotOptions.pictorial.descriptive.text}]);this.updateLabelText(n),this.createLabelText(n)}var s;if(e.chart.scale.y){var o=Math.max(a[0].value,a[1].value);o=Math.max(o,e.chart.scale.y),s=this.roundToDecimals(o,e.chart.decimals,!0)+"/"+this.roundToDecimals(o,e.chart.decimals,!0)}else s=this.roundToDecimals(a[0].value)+"/"+this.roundToDecimals(a[1].value);this.numberSize=this.measureTextFieldSize(s,e.theme.plotOptions.pictorial.number.fontSize,e.theme.plotOptions.pictorial.number.fontFamily);var l=this.numberWrapper.selectAll(".label").data([a]);this.updateNumber(l),this.createNumber(l),this.moveAndScaleNumber(),this.moveLabelText(),this.figureSize=this.measureFigurePath(e.path),this.table=this.createTable(),this.firstRun===!1&&(this.scaleChanged=this.table.cols!==this.previousTable.cols);var h=this.makeSelectionData(),u=this.figureWrapper.selectAll(".figure").data(h),p=h.length;this.previousFigureCount.totalFigures>this.figureCount.totalFigures&&(p=this.previousFigureCount.totalFigures);var c=e.animation.transitionDuration/p;this.createFigures(u),this.updateFigures(u,p,c),this.removeFigures(u,p,c),this.moveFigures(),this.previousFigureCount={filledFigures:parseFloat(this.data[0].value),nonfilledFigures:parseFloat(this.data[1].value)-parseFloat(this.data[0].value),totalFigures:parseFloat(this.data[1].value)},this.previousTable=this.table,this.wasZeroValues=!1,this.isZeroValues=!1},createFigures:function(t){var i=this.firstRun,a=this.data.map(function(t){return{label:t.label,value:parseFloat(t.value)}}),e=this.colorScale,r=this.options;t.enter().append("g").attr("class","enter figure").attr("fill",function(){return Array.isArray(r.theme.colors)?r.theme.colors[0]:e(a)}).attr("opacity",function(){return i.firstRun===!0?1:0}).append("path").attr("d",r.path)},getFigureDuration:function(t,i,a,e,r,n){if(i.firstRun===!0)return 0;var s=0;return void 0!==t.previousValue?(1===t.previousValue&&0===a.value&&(s=(r-e)*n),1===t.previousValue&&1===a.value&&(s=(r-e)*n),0===t.previousValue&&0===a.value&&(s=(r-e)*n),0===t.previousValue&&1===a.value&&(s=e*n)):s=e*n,s},updateFigures:function(i,a,e){var r=this,n=this.data.map(function(t){return{label:t.label,value:parseFloat(t.value)}}),s=this.colorScale,o=this.options;if(r.scaleChanged===!0&&r.wasZeroValues===!1?i.transition().duration(0).delay(o.animation.transitionDuration/2).attr("transform",function(t,i){return r.transformFigure(i,this,r)}).attr("opacity",function(t){return this.previousValue=t.value,1===t.value?1:r.UNSELECTED_OPACITY}):i.attr("transform",function(t,i){return r.transformFigure(i,this,r)}).transition().duration(function(t,i){return r.getFigureDuration(this,r,t,i,a,e)}).delay(o.animation.transitionDelay).ease(o.animation.easing).attr("opacity",function(t){return this.previousValue=t.value,1===t.value?1:r.UNSELECTED_OPACITY}),i.attr("fill",function(){return Array.isArray(o.theme.colors)?o.theme.colors[0]:s(n)}),0!==r.hasFraction){var l,h,u=Math.ceil(r.data[0].value)-1;i.each(function(i,n){l=t.select(this),n===u?(1===l.selectAll("path")[0].length&&(l.select("path").attr("clip-path","url(#nominatorClipPath-"+r.id+")").attr("class","nominatorPath"),h=r.getFigureDuration(this,r,i,n,a,e),l.append("path").attr("clip-path","url(#denominatorClipPath-"+r.id+")").attr("class","denominatorPath").attr("d",o.path).attr("opacity",1).transition().duration(h).delay(o.animation.transitionDelay).ease(o.animation.easing).attr("opacity",r.UNSELECTED_OPACITY)),r.nominatorClipPath.selectAll("rect").attr("y",0).attr("x",0).attr("width",Math.max(0,r.figureSize.width*r.hasFraction)).attr("height",Math.max(0,r.figureSize.height)),r.denominatorClipPath.selectAll("rect").attr("y",0).attr("x",r.figureSize.width*r.hasFraction).attr("width",Math.max(0,r.figureSize.width*(1-r.hasFraction))).attr("height",Math.max(0,r.figureSize.height))):2===l.selectAll("path")[0].length&&(h=r.getFigureDuration(this,r,i,n,a,e),l.selectAll(".denominatorPath").transition().duration(h).delay(o.animation.transitionDelay).ease(o.animation.easing).attr("opacity",1).each("end",function(){t.select(t.select(this).node().parentNode).select(".nominatorPath").attr("clip-path",null),t.select(this).remove()}))})}},removeFigures:function(t,i,a){var e=this.options,r=this,n=r.scaleChanged===!0?e.animation.transitionDuration/2:0;t.exit().transition().duration(function(t,n){if(r.scaleChanged===!0)return 0;var s=(i-n)*a;return e.animation.transitionDelay+s}).delay(e.animation.transitionDelay+n).ease(e.animation.easing).attr("opacity",0).remove()},transformFigure:function(t,i,a){var e=a.getPositionInTable(a.table,t),r=a.availableSpace.figure/(a.table.cols-a.FIGURE_GAP),n=r*a.FIGURE_GAP;r-=n;var s=r/a.figureSize.width,o=a.figureSize.height*s;return a.figureHeight=o+n,"matrix("+s+" 0 0 "+s+" "+e.col*(r+n)+" "+e.row*(o+n)+")"},positionWrapper:function(){this.multiFigureWrapper.attr("transform","translate("+this.chartSize.margins.left+", "+this.chartSize.margins.top+")")},measureFigurePath:function(t){var i=this.svg.append("path").attr("d",t),a=i.node().getBBox();return i.remove(),a},setAreaSizes:function(){this.availableSpace={marginleft:.0476,figure:.4286,gap:.0476,label:.4286,number:.3815,marginright:.0476},this.availableSpace.marginleft=this.availableSpace.marginleft*this.chartSize.width,this.availableSpace.figure=this.availableSpace.figure*this.chartSize.width,this.availableSpace.gap=this.availableSpace.gap*this.chartSize.width,this.availableSpace.number=this.availableSpace.number*this.chartSize.width,this.availableSpace.label=this.availableSpace.label*this.chartSize.width,this.availableSpace.marginright=this.availableSpace.marginright*this.chartSize.width},makeSelectionData:function(){for(var t=parseFloat(this.data[1].value),i=[],a=this.data[0].value,e=0;t>e;e++)i.push({label:e,value:a>e?1:0});return i},createTable:function(){for(var t,i,a,e,r,n=[5,10,15,30,40],s=parseFloat(this.data[1].value),o=this.getAssumedColumnScale(s),l={cols:1,rows:1},h=o;h<n.length;h++)if(t=n[h],i=Math.ceil(s/t),a=this.availableSpace.figure/t,e=a/this.figureSize.width,r={width:this.figureSize.width*e,height:this.figureSize.height*e},r.height*i<=1.2*this.chartSize.height){l={cols:t,rows:i};break}return l},getAssumedColumnScale:function(t){return 10>=t?0:100>=t?1:160>=t?2:300>=t?3:1e4>=t?4:void 0},getPositionInTable:function(t,i){return{col:i%t.cols,row:Math.floor(i/t.cols)}},updateLabelText:function(t){var i=this,a=this.options;t.attr("class","update label").text("").each(function(t){i.wrapLabelText(t,this,i)}).transition().duration(a.animation.transitionDuration).delay(a.animation.transitionDelay).ease(a.animation.easing).attr("opacity",1)},createLabelText:function(t){var i=this,a=this.options;t.enter().append("text").attr("class","enter label").attr("font-weight",a.theme.plotOptions.pictorial.descriptive.fontWeight).attr("font-size",a.theme.plotOptions.pictorial.descriptive.fontSize).attr("font-family",a.theme.plotOptions.pictorial.descriptive.fontFamily).attr("fill",a.theme.plotOptions.pictorial.descriptive.fill).attr("dy",".71em").attr("opacity",function(){return i.isZeroValues===!0?0:1}).each(function(t){i.wrapLabelText(t,this,i)})},wrapLabelText:function(i,a,e){var r=e.availableSpace.marginleft+e.availableSpace.figure+e.availableSpace.gap,n=e.availableSpace.label,s="1.2";e.wrapTextField(t.select(a),i.label,r,n,s)},updateNumber:function(i){var a=this.options,e=this;i.attr("class","update label").transition().duration(a.animation.transitionDuration).delay(a.animation.transitionDelay).ease(a.animation.easing).attr("opacity",1).tween("text",function(i){var a=t.interpolate(this.textContent.split("/")[0].replace(",","."),e.roundToDecimals(i[0].value).replace(",",".")),r=t.interpolate(this.textContent.split("/")[1].replace(",","."),e.roundToDecimals(i[1].value).replace(",","."));return function(t){var i=e.roundToDecimals(a(t)),n=e.roundToDecimals(r(t));this.textContent=i+"/"+n}})},createNumber:function(t){var i=this.options,a=this;t.enter().append("text").attr("class","enter label").attr("font-family",i.theme.plotOptions.pictorial.number.fontFamily).attr("font-size",i.theme.plotOptions.pictorial.number.fontSize).attr("fill",i.theme.plotOptions.pictorial.number.fill).attr("opacity",function(){return a.isZeroValues===!0?0:1}).attr("dy","0.9em").text(function(t){return a.roundToDecimals(t[0].value)+"/"+a.roundToDecimals(t[1].value)})},moveAndScaleNumber:function(){var t=this.availableSpace.number/this.numberSize.width,i=this.chartSize.height/this.numberSize.height,a=Math.min(t,i),e=this.numberSize.width*a;e=this.availableSpace.number-e+this.availableSpace.marginleft+this.availableSpace.gap+this.availableSpace.figure;var r=this.numberSize.height*a;this.options.plotOptions.pictorial.descriptive!==!1&&(r+=this.labelWrapper.node().getBBox().height+10),r=(this.chartSize.height-r)/2,this.numberWrapper.attr("transform","matrix("+a+", 0, 0, "+a+", "+e+", "+r+")"),this.numberWrapScale=a},moveLabelText:function(){if(this.options.plotOptions.pictorial.descriptive!==!1){var t=this.numberSize.height*this.numberWrapScale;this.options.plotOptions.pictorial.descriptive!==!1&&(t+=this.labelWrapper.node().getBBox().height+10),t=(this.chartSize.height-t)/2,t+=this.numberSize.height*this.numberWrapScale,t-=this.numberSize.height*this.numberWrapScale*.2,t+=10,this.labelWrapper.attr("transform","translate(0,"+t+")")}},moveFigures:function(){var t=this.options,i=this.availableSpace.figure-this.figureWrapper.node().getBBox().width+this.availableSpace.marginleft,a=(this.chartSize.height-this.figureHeight*this.table.rows)/2,e=this;this.wasZeroValues===!0?this.figureWrapper.attr("transform","translate("+i+","+a+")").attr("opacity",0).transition().duration(t.animation.transitionDuration).delay(t.animation.transitionDelay).attr("opacity",1):this.scaleChanged===!0?(this.figureWrapper.attr("opacity",1).transition().duration(t.animation.transitionDuration/2-100).attr("opacity",0),this.figureWrapper.transition().duration(0).delay(t.animation.transitionDuration/2).attr("transform",function(){var t=e.availableSpace.figure-e.figureWrapper.node().getBBox().width+e.availableSpace.marginleft,i=(e.chartSize.height-e.figureHeight*e.table.rows)/2;return"translate("+t+","+i+")"}),this.figureWrapper.transition().duration(t.animation.transitionDuration/2).delay(t.animation.transitionDuration/2+100).attr("opacity",1)):this.firstRun===!0||this.figureCount.totalFigures===this.previousFigureCount.totalFigures?this.figureWrapper.attr("transform","translate("+i+","+a+")"):this.figureWrapper.transition().duration(t.animation.transitionDuration/2).delay(t.animation.transitionDelay).ease(t.animation.easing).attr("transform","translate("+i+","+a+")")}})});