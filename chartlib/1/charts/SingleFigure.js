/* Copyright (c) Ericsson 2016 */

define("chartlib/charts/SingleFigure",["chartlib/base/d3","chartlib/charts/Chart"],function(t,i){"use strict";return i.extend({defaults:{theme:{title:{fontSize:38},subTitle:{fontSize:20},plotOptions:{pictorial:{number:{fontWeight:"normal",fontFamily:"Ericsson Capital, Arial",fontSize:"100",fill:"#58585b",unit:"%"},descriptive:{fontFamily:"Arial",fontWeight:"normal",fontSize:13,fill:"#58585b"}}}},plotOptions:{pictorial:{descriptive:!1}},chart:{margin:"useSpecialMargins"},grid:!1},onChartReady:function(){this.attachTo(this.options.element)},createPrivateVariables:function(){this.data=[],this.singleFigureWrapper=[],this.figureWrapper=[],this.numberWrapper=[],this.labelWrapper=[],this.figureSize={},this.numberSize={},this.availableSpace={},this.figures=[],this.isSingleValue=!0,this.topCut=[],this.bottomCut=[],this.useSpecialMargins="useSpecialMargins"===this.options.chart.margin},redraw:function(){if(this.createWrapper(),this.useSpecialMargins===!0){var t=this.getSize();t=.0476*t.width,this.options.chart.margin={top:t,bottom:t,left:0,right:0}}this.update(this.options.data)},createWrapper:function(){0===this.singleFigureWrapper.length&&(this.singleFigureWrapper=this.svg.append("g").attr("id","singleFigureWrapper-"+this.id),this.figureWrapper=this.singleFigureWrapper.append("g").attr("id","figureWrapper-"+this.id),this.numberWrapper=this.singleFigureWrapper.append("g").attr("id","numberWrapper-"+this.id),this.labelWrapper=this.singleFigureWrapper.append("g").attr("id","labelWrapper-"+this.id))},onUpdate:function(t){this.options.data=t;var i=this.chartSize;this.data=t;var e=this.data,a=this.options,r=this.getSize();if(i.width=r.width-a.chart.margin.left-a.chart.margin.right,i.height=r.height-a.chart.margin.top-a.chart.margin.bottom,i.margins={left:a.chart.margin.left,top:a.chart.margin.top},i=this.changeSizeForTitle(i),this.positionWrapper(),this.setAreaSizes(),this.createCutSizes(),this.figureSize=this.measureFigurePath(a.path),this.createFigure(),a.plotOptions.pictorial.descriptive!==!1){var n=this.labelWrapper.selectAll(".label").data([{value:0,label:a.plotOptions.pictorial.descriptive.text}]);this.updateLabelText(n),this.createLabelText(n)}var s;if(a.chart.scale.y){var h=Math.max(e[0].value,a.chart.scale.y);s=this.roundToDecimals(h)+a.theme.plotOptions.pictorial.number.unit}else s=this.roundToDecimals(e[0].value)+a.theme.plotOptions.pictorial.number.unit;this.maxY=void 0!==a.chart.scale.y?a.chart.scale.y:100,this.numberSize=this.measureTextFieldSize(s,a.theme.plotOptions.pictorial.number.fontSize,a.theme.plotOptions.pictorial.number.fontFamily);var l=this.numberWrapper.selectAll(".label").data(e);this.updateNumber(l),this.createNumber(l),this.moveAndScaleFigure(),this.moveAndScaleNumber(),this.moveAndScaleCuts(),this.moveLabelText()},positionWrapper:function(){this.singleFigureWrapper.attr("transform","translate("+this.chartSize.margins.left+", "+this.chartSize.margins.top+")")},measureFigurePath:function(t){var i=this.svg.append("path").attr("d",t),e=i.node().getBBox();return i.remove(),e},setAreaSizes:function(){var t=this.chartSize.width,i={marginleft:.0476,figure:.4286,gap:.0476,label:.4286,number:.2636,marginright:.0476};i.marginleft=i.marginleft*t,i.figure=i.figure*t,i.gap=i.gap*t,i.number=i.number*t,i.label=i.label*t,i.marginright=i.marginright*t,this.availableSpace=i},createCutSizes:function(){0===this.topCut.length&&(this.topCut=this.defs.append("clipPath").attr("id","addOfPercentage-"+this.id).append("rect"),this.bottomCut=this.defs.append("clipPath").attr("id","cutOfPercentage-"+this.id).append("rect"))},createFigure:function(){var t=this.data.map(function(t){return{label:t.label,value:parseFloat(t.value)}}),i=this.colorScale,e=this.options,a=Array.isArray(e.theme.colors)?e.theme.colors[0]:i(t[0]);0===this.figures.length&&(this.figures[0]=this.figureWrapper.append("path").attr("clip-path","url(#cutOfPercentage-"+this.id+")").attr("d",e.path).attr("fill",a),this.figures[1]=this.figureWrapper.append("path").attr("clip-path","url(#addOfPercentage-"+this.id+")").attr("d",e.path).attr("fill-opacity",.3).attr("fill",a)),this.figureWrapper.selectAll("path").transition().duration(e.animation.transitionDuration).delay(e.animation.transitionDelay).ease(e.animation.easing).attr("fill",a)},updateLabelText:function(t){var i=this;t.attr("class","update label").text("").each(function(t){i.wrapLabelText(t,this,i)})},createLabelText:function(t){var i=this,e=this.options;t.enter().append("text").attr("class","enter label").attr("font-weight",e.theme.plotOptions.pictorial.descriptive.fontWeight).attr("font-size",e.theme.plotOptions.pictorial.descriptive.fontSize).attr("font-family",e.theme.plotOptions.pictorial.descriptive.fontFamily).attr("fill",e.theme.plotOptions.pictorial.descriptive.fill).attr("dy",".71em").each(function(t){i.wrapLabelText(t,this,i)})},wrapLabelText:function(i,e,a){var r=a.availableSpace.marginleft+a.availableSpace.figure+a.availableSpace.gap,n=a.availableSpace.label,s="1.2";a.wrapTextField(t.select(e),i.label,r,n,s)},updateNumber:function(i){var e=this.options,a=this;i.attr("class","update label").transition().duration(e.animation.transitionDuration).delay(e.animation.transitionDelay).ease(e.animation.easing).tween("text",function(i){var r=t.interpolate(this.textContent.replace(e.theme.plotOptions.pictorial.number.unit,"").replace(",","."),a.roundToDecimals(i.value).replace(",","."));return this.textContent=r(0),function(t){this.textContent=a.roundToDecimals(r(t))+e.theme.plotOptions.pictorial.number.unit}})},createNumber:function(t){var i=this.options,e=this;t.enter().append("text").attr("class","enter label").attr("font-family",i.theme.plotOptions.pictorial.number.fontFamily).attr("font-size",i.theme.plotOptions.pictorial.number.fontSize).attr("fill",i.theme.plotOptions.pictorial.number.fill).attr("dy","0.9em").text(function(t){return e.roundToDecimals(t.value)+i.theme.plotOptions.pictorial.number.unit})},moveAndScaleFigure:function(){var t=this.availableSpace.figure/this.figureSize.width,i=this.chartSize.height/this.figureSize.height,e=Math.min(t,i),a=this.figureSize.width*e;a=this.availableSpace.figure-a+this.availableSpace.marginleft;var r=this.figureSize.height*e;r=(this.chartSize.height-r)/2,this.figureWrapper.attr("transform","matrix("+e+", 0, 0, "+e+", "+a+", "+r+")")},moveAndScaleNumber:function(){var t=this.availableSpace.number/this.numberSize.width,i=this.chartSize.height/this.numberSize.height,e=Math.min(t,i),a=this.numberSize.width*e;a=this.availableSpace.number-a+this.availableSpace.marginleft+this.availableSpace.gap+this.availableSpace.figure;var r=this.numberSize.height*e;this.options.plotOptions.pictorial.descriptive!==!1&&(r+=this.labelWrapper.node().getBBox().height+10),r=(this.chartSize.height-r)/2,this.numberWrapper.attr("transform","matrix("+e+", 0, 0, "+e+", "+a+", "+r+")"),this.numberWrapScale=e},moveAndScaleCuts:function(){var t=this.options,i=1-this.data[0].value/this.maxY;0>i&&(i=0),this.topCut.transition().duration(t.animation.transitionDuration).delay(t.animation.transitionDelay).ease(t.animation.easing).attr("x",0).attr("y",0).attr("height",Math.max(0,this.figureSize.height*i)).attr("width",Math.max(0,this.figureSize.width)),this.bottomCut.transition().duration(t.animation.transitionDuration).delay(t.animation.transitionDelay).ease(t.animation.easing).attr("x",0).attr("y",this.figureSize.height*i).attr("height",Math.max(0,this.figureSize.height*(1-i))).attr("width",Math.max(0,this.figureSize.width))},moveLabelText:function(){if(this.options.plotOptions.pictorial.descriptive!==!1){var t=this.numberSize.height*this.numberWrapScale;this.options.plotOptions.pictorial.descriptive!==!1&&(t+=this.labelWrapper.node().getBBox().height+10),t=(this.chartSize.height-t)/2,t+=this.numberSize.height*this.numberWrapScale,t-=this.numberSize.height*this.numberWrapScale*.2,t+=10,this.labelWrapper.attr("transform","translate(0,"+t+")")}}})});