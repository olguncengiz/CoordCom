/* Copyright (c) Ericsson 2016 */

define("chartlib/charts/Column",["chartlib/base/d3","chartlib/charts/Chart"],function(t,a){"use strict";function e(t,a){var e="vertical"===this.options.plotOptions.orientation,i=this.chartSize,n=this.scaleHelper.entries.range(),r=this.getBarValues(t,a,n,this.offsetYVal,i.width,i.height,this.measureData,this.dataDimensions),s=r.x+r.width/2;return this.options.plotOptions.column.stacked?this.scaleHelper.entries(t.label)+r.x+r.width/2:e?s:s+parseInt(this.svg.style("font-size"))/3}function i(t,a){if(this.options.plotOptions.column.stacked)return this.scaleHelper.values(t.total)-5;var e="vertical"===this.options.plotOptions.orientation,i=this.chartSize,n=this.scaleHelper.entries.range(),r=this.getBarValues(t,a,n,this.offsetYVal,i.width,i.height,this.measureData,this.dataDimensions);return e&&r.height<0?this.scaleHelper.values(0)-parseInt(this.svg.style("font-size")):!e&&(r.y<0||!this.options.chart.zeroBaseline&&t.value<0)?this.scaleHelper.values(0)+10:e?r.y-5:r.y+5}function n(t){t.forEach(function(t){t.data.forEach(function(a){a.parentLabel=t.label})})}return a.extend({defaults:{theme:{plotOptions:{column:{datalabels:{fill:"#58585b"},overlayline:{stroke:"#cccccc",width:3,border:{color:"#ffffff",width:1}},stackedDistance:1}}},plotOptions:{orientation:"vertical",column:{cornerRadius:.1,startAtZero:!0,barWidthScale:.7,grouped:!1,stacked:!1,stackedPercentageComparison:!1,datalabels:!1,overlayLine:!1,overlaySpline:!1},scaleType:{x:"ordinal",y:"linear"}},grid:{tickHint:{}}},onChartReady:function(){this.attachTo(this.options.element)},createPrivateVariables:function(){this.data=[],this.overlayData=[],this.measureData=[],this.overlayType="",this.yMax=0,this.yMin=0,this.overlayYMax=0,this.overlayYMin=0,this.barWrapper=[],this.barWrapperClipPath=[],this.barSelection=[],this.groupSelection=[],this.dataDimensions=2,this.hasOverlay=!1,this.centerPadding=0,this.offsetYVal=0;var t=this.options.plotOptions;t.column.grouped===!0?t.column.grouped={groupMarginScale:.75}:t.column.grouped&&!t.column.grouped.groupMarginScale&&(t.column.grouped.groupMarginScale=.75),t.column&&t.column.grouped&&t.column.grouped.compareSets===!0&&(this.options.grid===!0?this.options.grid={tickPadding:{x:26}}:this.options.grid.tickPadding&&(this.options.grid.tickPadding={x:26}))},redraw:function(){this.createWrapper(),this.update(this.options.data)},createWrapper:function(){0===this.barWrapper.length&&(this.barWrapperClipPath=this.defs.append("clipPath"),this.barWrapperClipPath.attr("id","barWrapperClipPath-"+this.id).append("rect"),this.barWrapper=this.svg.append("g").attr("id","columnWrapper-"+this.id),this.barWrapper.attr("clip-path","url(#barWrapperClipPath-"+this.id+")"))},onUpdate:function(t){this.options.data=t,this.data=this.addIDsToData(t);var a,e=this.overlayData,i=this.options,r=this.chartSize,s=this.barWrapper,o=this.barWrapperClipPath,l=this.barSelection,h=this.groupSelection,c=this.scaleHelper,u=this,d=i.plotOptions,p="vertical"===i.plotOptions.orientation,g=[],m=function(t){return t.visible!==!1};Array.isArray(this.data[0])?g=this.data.map(function(t){return t.filter(m)}):this.data.forEach(function(t){if(t.visible!==!1){var a=t;void 0!==a.data&&(a={label:t.label,data:[]},t.data.forEach(function(t){t.visible!==!1&&a.data.push(t)})),g.push(a)}}),this.data=g;var v=t;v[0].data&&(v=v[0].data),d.column&&d.column.grouped&&d.column.grouped.compareSets===!0&&(v=t.map(function(t){return{label:t.label,visible:t.visible}})),(d.column.overlaySpline||d.column.overlayLine)&&(this.hasOverlay=!0,this.overlayType=d.column.overlaySpline?d.column.overlaySpline:d.column.overlayLine,"custom"===this.overlayType?(this.overlayData=this.data[1],this.data=this.data[0],g=this.data,v=this.options.data[0]):e=g),this.recalculateDataForPercentageComparison(),this.measureData=[],g[0]&&(this.dataDimensions=g[0].data?3:2,this.measureData=2===this.dataDimensions?g:g[0].data),this.reconfigureDataForStackedCharts(),this.dataDimensions>2&&n(g),this.figureOutTrendLine(e),e=this.overlayData,this.getMaxValues(),this.manageColorDomains();var f=this.getSize();r.width=f.width-i.chart.margin.left-i.chart.margin.right,r.height=f.height-i.chart.margin.top-i.chart.margin.bottom,r.margins={left:i.chart.margin.left,top:i.chart.margin.top},r=this.changeSizeForTitle(r),r=this.changeSizeForGrid(r,this.data),this.changeSizeForDataLabels(r,this.data),r=this.changeSizeForLegend(r,v),d.column.stackedPercentageComparison&&(i.chart.scale={y:{max:100,min:0}}),this.setOrdinalScales();var y=i.grid!==!1?this.grid.getOptions().gridPadding:{left:0,right:0};s.attr("transform","translate("+(r.margins.left+y.left)+","+r.margins.top+")");var b={width:r.width+r.margins.left,height:r.height+r.margins.top};if(o.selectAll("rect").attr("x",0).attr("y",-20).attr("width",Math.max(0,b.width)).attr("height",Math.max(0,b.height)),2===this.dataDimensions)l=s.selectAll("path.bar").data(g);else if(3===this.dataDimensions){this.setCenterPadding();var S=this.centerPadding,D=function(t){var e=a(t);return"translate("+e.x+","+e.y+")"};a=function(t){var a=c.entries(t.label)+S;return{x:p?a:0,y:p?0:a}},this.groupSelection=s.selectAll(".group").data(g),h=this.groupSelection,h.transition().duration(i.animation.transitionDuration).delay(i.animation.transitionDelay).ease(i.animation.easing).attr("transform",D);var x=h.enter().append("g").attr("class","group").attr("transform",D);h.exit().remove(),d.column.stacked!==!1&&x.attr("clip-path",function(t,a){return"url(#stackedClip-"+a+"-"+u.id+")"}),l=h.selectAll("path.bar").data(function(t){return t.data})}var O=this.makeDataLabelSelection(),k=this.makeStackedClipPathSelection(),M=p?r.height:r.width;this.offsetYVal=d.column.startAtZero?c.values(0):M;var w,C=s.selectAll("path.overlayline").data([{data:e}]);if(i.theme.plotOptions.column.overlayline.border&&(w=s.selectAll("path.overlaylineborder").data([{data:e}])),c.line=this.createLineHelper(),this.updateExistingElements(l),this.updateDataLabels(O),this.updateStackedClipPaths(k),this.updateOverlayLine(C,w),this.createNewElements(l),this.createNewDataLabels(O),this.createStackedClipPaths(k),this.createOverlayLine(C,w),l.exit().remove(),O&&O.exit().remove(),this.options.grid!==!1){var P={x:c.entries,y:c.values},V={position:{y:6}};d.column.grouped.compareSets===!0&&(V.group={getTickCoords:function(t){var a=i.plotOptions.column,e=c.groupedEntries.rangeBand(),n=c.groupedEntries(t.label)*a.grouped.groupMarginScale,r=e*a.barWidthScale*a.grouped.groupMarginScale;return{x:p?n+r/2:0,y:p?0:n}},getGroupCoords:a},P.groupedEntries=c.groupedEntries),this.grid.getOptions().tickHint.x=g.length,this.grid.update(g,this.chartSize,P,V)}this.options.legend!==!1&&this.legend.update(v,this.chartSize,c)},recalculateDataForPercentageComparison:function(){var a=this.options,e=this.data;a.plotOptions.column.stackedPercentageComparison&&e.forEach(function(a){var e=0,i=t.sum(a.data,function(t){return t.value});a.data.forEach(function(t){var a=0!==i?t.value/i*100:0;t.originalValue=t.value,t.value=a,t.y0=e,e+=a,t.y1=e}),a.total=100})},reconfigureDataForStackedCharts:function(){if(this.options.plotOptions.column.stacked)if(3===this.dataDimensions)this.data.forEach(function(t){var a=0;t.data.forEach(function(t){t.y0=a,a+=t.value,t.y1=a}),t.total=a});else{var t=0;this.data.forEach(function(a){a.y0=t,a.y1=t+=a.value})}},getMaxValues:function(){var a=this.options,e=this.data,i=this.dataDimensions,n=this.overlayType,r=this.overlayData,s=function(t){return t.value},o=function(t){return t.total};if(a.chart.scale.y&&!a.plotOptions.column.stackedPercentageComparison)this.yMax=a.chart.scale.y.max,this.yMin=a.chart.scale.y.min,a.chart.zeroBaseline.y&&(this.yMin=0);else{if(a.plotOptions.column.stacked&&3===i)this.yMax=t.max(e,o),this.yMin=a.chart.zeroBaseline?0:t.min(e,function(a){return t.min(a.data.map(s))});else if(a.plotOptions.column.stacked)this.yMax=t.sum(e,s),this.yMin=a.chart.zeroBaseline?0:t.min(e,s);else if(2===i){var l=e.some(function(t){return t.value>=0});this.yMax=t[l?"max":"min"](e,s),this.yMin=a.chart.zeroBaseline?0:t[l?"min":"max"](e,s)}else 3===i&&(this.yMax=t.max(e,function(a){return t.max(a.data.map(s))}),this.yMin=a.chart.zeroBaseline?0:t.min(e,function(a){return t.min(a.data.map(s))}));0===this.yMax&&0===this.yMin&&(this.yMax=5),"custom"===n&&(this.overlayYMax=t.max(r,s),this.overlayYMin=t.min(r,s),this.yMax=Math.max(this.yMax,this.overlayYMax),this.yMin=Math.min(this.yMin,this.overlayYMin))}},figureOutTrendLine:function(t){this.hasOverlay===!0&&"trend"===this.overlayType&&(this.overlayData=t.map(function(t){if(t.data){var a=0;return t.data.forEach(function(t){a+=t.value}),{label:t.label,value:a/t.data.length}}return t}))},manageColorDomains:function(){this.firstRun&&Array.isArray(this.options.theme.colors)&&2!==this.dataDimensions&&this.colorScale.domain(this.measureData.map(function(t){return t.label}))},setOrdinalScales:function(){var a=this.options,e=this.data,i=this.scaleHelper,n=this.chartSize,r=e.map(function(t){return t.label}),s=a.plotOptions.column.stacked&&2===this.dataDimensions?[r[0]]:r,o=[this.yMin,this.yMax],l=a.grid!==!1?this.grid.getOptions().gridPadding:{left:0,right:0},h="vertical"===a.plotOptions.orientation,c=n.width-l.left-l.right,u=n.height,d=h?[0,c]:[0,u],p=h?[u,0]:[0,c];if(this.yMin<0&&this.yMax<0&&(o=o.reverse()),i.entries=t.scale.ordinal().domain(s).rangeRoundBands(d,0),i.values=t.scale.linear().domain(o).range(p).nice(),a.plotOptions.column.grouped){var g=void 0!==e[0]?e[0].data.map(function(t){return t.label}):[],m=i.entries.rangeBand();i.groupedEntries=t.scale.ordinal().domain(g).rangeRoundBands([0,m])}},createLineHelper:function(){var a=this.options,e=this.hasOverlay,i=this.scaleHelper,n=this.dataDimensions,r=this,s=this.offsetYVal,o=this.chartSize,l=this.measureData;if(e===!0){var h=i.entries.range();return t.svg.line().interpolate(a.plotOptions.column.overlaySpline?"cardinal":"linear").x(function(t,e){if(2===n){var c=r.getBarValues(t,e,h,s,o.width,o.height,l,n);return c.x+c.width/2}return a.plotOptions.column.stacked?i.entries(t.label)+i.entries.rangeBand()/2:i.entries(t.label)+i.entries.rangeBand()/2}).y(function(t){return i.values(t.value)})}},setCenterPadding:function(){var t=this.options.plotOptions.column;if(t.grouped){var a=this.scaleHelper.groupedEntries.rangeBand();this.centerPadding=a*this.measureData.length*(1-t.grouped.groupMarginScale)/2,this.centerPadding+=a*(1-t.barWidthScale)*t.grouped.groupMarginScale/2}},makeDataLabelSelection:function(){var t=this.options,a=this.data;if(t.plotOptions.column.datalabels){var e;return e=2===this.dataDimensions||t.plotOptions.column.stacked?this.barWrapper.selectAll("text.datalabel").data(a):this.groupSelection.selectAll("text.datalabel").data(function(t){return t.data})}return!1},makeStackedClipPathSelection:function(){var t=this.defs,a=this.data,e=this,i=t.selectAll(".stackedClip").data(a);i.enter().append("clipPath").attr("class","stackedClip").attr("id",function(t,a){return"stackedClip-"+a+"-"+e.id});var n=i.selectAll("path.stackedClipPath").data(function(t){return[t]});return n},updateExistingElements:function(t){var a=this.options,e=this.offsetYVal,i=this.chartSize,n=this.measureData,r=this.dataDimensions,s=this.scaleHelper.entries.range();t.attr("class","update bar clickable hoverable datapoint").transition().duration(a.animation.transitionDuration).delay(a.animation.transitionDelay).ease(a.animation.easing).attr("fill",function(t){return a.plotOptions.column.grouped.compareSets===!0?this.colorScale(t.parentLabel,t):this.colorScale(t.label,t)}.bind(this)).attr("d",function(t,a){var o=this.getBarValues(t,a,s,e,i.width,i.height,n,r);return this.roundedRect(o)}.bind(this))},updateDataLabels:function(a){if(this.options.plotOptions.column.datalabels){var n=this.options,r="vertical"===n.plotOptions.orientation,s=r?"x":"y",o=r?"y":"x",l=this.roundToDecimals.bind(this);a.attr("class","update datalabel").transition().duration(n.animation.transitionDuration).delay(n.animation.transitionDelay).ease(n.animation.easing).tween("text",function(a){var e=n.plotOptions.column.stacked?a.total:a.value,i=t.interpolate(this.textContent.replace(",","."),e);return function(t){this.textContent=l(i(t),n.chart.decimals)}}).attr(s,e.bind(this)).attr(o,i.bind(this))}},updateStackedClipPaths:function(t){var a=this.scaleHelper,e=this.options,i=this,n=this.offsetYVal,r=this.chartSize,s=this.measureData,o=this.dataDimensions,l=a.entries.range();t.attr("class","update stackedClipPath").transition().duration(e.animation.transitionDuration).delay(e.animation.transitionDelay).ease(e.animation.easing).attr("d",function(t,a){var e={value:t.total},h=i.getRegularBarValues(e,a,l,n,r.width,r.height,s,o);return i.roundedRect(h)})},updateOverlayLine:function(t,a){var e=this.scaleHelper,i=this.options;this.hasOverlay===!0&&(t.attr("class","update overlayline").transition().duration(i.animation.transitionDuration).delay(i.animation.transitionDelay).ease(i.animation.easing).attr("d",function(t){return e.line(t.data)}),i.theme.plotOptions.column.overlayline.border&&a.attr("class","update overlaylineborder").transition().duration(i.animation.transitionDuration).delay(i.animation.transitionDelay).ease(i.animation.easing).attr("d",function(t){return e.line(t.data)}))},createNewElements:function(t){var a=this.options,e=this.offsetYVal,i=this.chartSize,n=this.measureData,r=this.dataDimensions,s=this,o=this.scaleHelper.entries.range();t.enter().append("path").attr("class","enter bar clickable hoverable datapoint").attr("stroke","none").attr("fill",function(t){return a.plotOptions.column.grouped.compareSets===!0?s.colorScale(t.parentLabel,t):s.colorScale(t.label,t)}).attr("d",function(t,a){var l=s.getBarValues(t,a,o,e,i.width,i.height,n,r);return s.roundedRect(l)}),t.exit().remove()},createNewDataLabels:function(t){if(this.options.plotOptions.column.datalabels){var a=this.options,n="vertical"===a.plotOptions.orientation,r=n?"x":"y",s=n?"y":"x";t.enter().append("text").attr("class","enter datalabel").attr("text-anchor",n?"middle":"left").attr("fill",a.theme.plotOptions.column.datalabels.fill).attr(r,e.bind(this)).attr(s,i.bind(this)).text(function(t){return this.roundToDecimals(a.plotOptions.column.stacked?t.total:t.value,a.chart.decimals)}.bind(this)),t.exit().remove()}},createStackedClipPaths:function(t){if(this.options.plotOptions.column.stacked){var a=(this.options,this.scaleHelper),e=this.offsetYVal,i=this.chartSize,n=this,r=this.measureData,s=this.dataDimensions,o=a.entries.range();t.enter().append("path").attr("class","enter stackedClipPath").attr("d",function(t,a){var l={value:t.total},h=n.getRegularBarValues(l,a,o,e,i.width,i.height,r,s);return n.roundedRect(h)}),t.exit().remove()}},createOverlayLine:function(t,a){var e=this.options,i=this.scaleHelper;this.hasOverlay===!0&&(e.theme.plotOptions.column.overlayline.border&&(a.enter().append("path").attr("class","enter overlaylineborder").attr("fill","none").attr("d",function(t){return i.line(t.data)}).attr("stroke",e.theme.plotOptions.column.overlayline.border.color).attr("stroke-linecap","round").attr("stroke-width",e.theme.plotOptions.column.overlayline.width+2*e.theme.plotOptions.column.overlayline.border.width),a.exit().remove()),t.enter().append("path").attr("class","enter overlayline").attr("fill","none").attr("d",function(t){return i.line(t.data)}).attr("stroke",e.theme.plotOptions.column.overlayline.stroke).attr("stroke-linecap","round").attr("stroke-width",e.theme.plotOptions.column.overlayline.width),t.exit().remove())},getBarValues:function(t,a,e,i,n,r,s,o){var l=this.options.plotOptions.column;return l.stacked?this.getStackedBarValues(t,a,e,i,n,r,s,o):l.grouped?this.getGroupedBarValues(t,a,e,i,n,r,s,o):this.getRegularBarValues(t,a,e,i,n,r,s,o)},getRegularBarValues:function(t,a,e,i,n,r){var s=this.options,o=s.plotOptions.column,l=this.scaleHelper.entries.rangeBand(),h={x:e[a]+(l-l*o.barWidthScale)/2,y:this.scaleHelper.values(t.value),width:l*o.barWidthScale,height:r-this.scaleHelper.values(t.value)-(r-i),radius:l*o.barWidthScale*o.cornerRadius};return h.radius>Math.abs(h.height)&&(h.radius=Math.abs(h.height)),h},getGroupedBarValues:function(t,a,e,i,n,r){var s=this.options,o=s.plotOptions.column,l=this.scaleHelper.groupedEntries.rangeBand(),h={x:this.scaleHelper.groupedEntries(t.label)*o.grouped.groupMarginScale,y:this.scaleHelper.values(t.value),width:l*o.barWidthScale*o.grouped.groupMarginScale,height:r-this.scaleHelper.values(t.value)-(r-i),radius:l*o.barWidthScale*o.grouped.groupMarginScale*o.cornerRadius};return h.radius>Math.abs(h.height)&&(h.radius=Math.abs(h.height)),h},getStackedBarValues:function(t,a,e){var i=this.scaleHelper,n=this.options,r=i.entries.rangeBand(),s={x:e[0]+(r-r*n.plotOptions.column.barWidthScale)/2,y:i.values(t.y1),width:r*n.plotOptions.column.barWidthScale,height:i.values(t.y0)-i.values(t.y1),radius:0};return 0!==a&&n.theme.plotOptions.column.stackedDistance&&(s.height-=n.theme.plotOptions.column.stackedDistance),s},roundedRect:function(t){var a="vertical"===this.options.plotOptions.orientation,e=t.x,i=t.y,n=t.radius,r=t.radius,s=t.height,o=t.width,l="",h="",c="";return a?(0>s?(n=0,s=-1*s,i-=s):r=0,h="a"+r+","+r+" 0 0 1 ",c="a"+n+","+n+" 0 0 1 ",l+="M"+e+","+(i+n),l+=c+n+","+(0-n),l+="h"+(o-2*n),l+=c+n+","+n,l+="v"+(s-(n+r)),l+=h+(0-r)+","+r,l+="h"+(0-(o-2*r)),l+=h+(0-r)+","+(0-r)):(0>s?(s=-1*s,i-=s,r=0):n=0,h="a"+r+","+r+" 0 0 1 ",c="a"+n+","+n+" 0 0 1 ",l+="M"+i+","+(e+r),l+=h+r+","+(0-r),l+="h"+(s-(n+r)),l+=c+n+","+n,l+="v"+(o-2*n),l+=c+(0-n)+","+n,l+="h"+(0-(s-(n+r))),l+=h+(0-r)+","+(0-r)),l+="z"},toggleEntryVisibility:function(t){var e=function(i){return Array.isArray(i)?void i.forEach(e):(i.label==t.label&&a.prototype.toggleEntryVisibility.call(this,i),void(void 0!==i.data&&i.data.forEach(e.bind(this))))}.bind(this);3===this.dataDimensions?this.options.data.forEach(e):a.prototype.toggleEntryVisibility.call(this,t)},changeSizeForDataLabels:function(t,a){var e,i,n,r=this.options.plotOptions,s=0;r.column.datalabels&&"horizontal"===r.orientation&&(e=this.getLongestStringFromData("value",a)||"0",i=this.localizeValueString(e),s+=Math.round(this.measureTextFieldSize(i).width),this.options.chart.zeroBaseline===!1&&this.yMin<0&&(n=Math.round(this.measureTextFieldSize(this.localizeValueString(this.yMin)).width),this.grid||(t.margins.left+=n),s+=n),t.width-=s)},cleanEventData:function(t){var a={};return Object.defineProperties(a,{label:{value:t.label},value:{value:t.value}}),void 0!==t.parentLabel&&Object.defineProperty(a,"parentLabel",{value:t.parentLabel}),void 0!==t.originalValue&&Object.defineProperty(a,"originalValue",{value:t.originalValue}),a}})});