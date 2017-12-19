map = document.querySelector('google-map');
var moveInterval;
var callInterval;
var callRoute;
var callTime;
var timeInterval;

setInterval(DecimalGenerate, 3000);

icons = {
  'police': '../images/map_police.png',
  'ambulance': '../images/map_ambulance.png',
  'camera': '../images/map_camera.png',
  'call': '../images/map_call.png',
  'patrol': '../images/map_ship.png',
  'building': '../images/map_building.png'
};

locations = {
  'police': [[38.451658, 27.223701], [38.3371, 27.2058]], 
  'ambulance': [[38.465345, 27.104260], [38.315405, 27.128537], [38.390794, 26.968311]],
  'camera': [[38.412102, 27.025604], [38.380899, 27.181945], [38.243750, 27.133392], [38.461543, 27.163495]],
  'patrol': [[38.438951, 27.095250], [38.445942, 27.033452], [38.416896, 26.928739]],
  'call': [[38.4, 27.0]],
  'building': [[38.439757, 27.166661], [38.449438, 27.112073], [38.355270, 27.234296], [38.395642, 27.05988]],
  'border': [
  [38.483350, 27.072343], 
  [38.490061, 27.095615], 
  [38.485907, 27.116029], 
  [38.486546, 27.133994], 
  [38.481113, 27.157674], 
  [38.481113, 27.181354], 
  [38.470245, 27.201769], 
  [38.448505, 27.207485], 
  [38.440511, 27.227490], 
  [38.418442, 27.238514],
  [38.400207, 27.228715],
  [38.367242, 27.230757],
  [38.363081, 27.203810],
  [38.366602, 27.179313],
  [38.362120, 27.157674],
  [38.346752, 27.142159],
  [38.352836, 27.118071],
  [38.356998, 27.085408],
  [38.397967, 27.062136],
  [38.397007, 26.995586],
  [38.424520, 26.958024],
  [38.462573, 27.009468]]
};

function DecimalGenerate() {
  var dir = document.getElementsByClassName("txtSpeed");

  for (i = 0; i < dir.length; i++) {
    var min = 30,
      max = 90,
      NumberResult = Math.random() * (max - min) + min;
    dir[i].innerHTML = parseFloat(NumberResult).toFixed(0);
  }
};

$( document ).ready(function() {
  DecimalGenerate();
  });

function handleVehicle(sender) {
  var markerId = '';
  // Get Marker ID
  for (i = 0; i < map.markers.length; i++) {
    if (map.markers[i].id == sender) {
      markerId = map.markers[i].id;
    }
  }

  if (document.getElementById('call').checked) {  
    setDirections(markerId);
    Polymer.dom.flush();

    callRoute = getRoute();
    (function f(){
      if (callRoute.length > 0) {
        clearTimeout(callInterval);
        startDrive(callRoute, markerId);
        Polymer.dom.flush();
        clearDirections();
        return
      }
      callRoute = getRoute();
      callInterval = setTimeout(f, 100);
    })();
  }
}

function setDirections(markerId) {
  var dir = document.querySelector('google-map-directions');

  for (i = 0; i < map.markers.length; i++) {
    if (map.markers[i].group == "call") {
      var latlng = "" + map.markers[i].latitude + "," + map.markers[i].longitude;
      dir.endAddress = latlng;
    }
    if (map.markers[i].id == markerId) {
      var latlng = "" + map.markers[i].latitude + "," + map.markers[i].longitude;
      dir.startAddress = latlng;
    }
  }
  Polymer.dom.flush();
}

function startDrive(route, markerId) {
  stopMove();
  var marker;
  var driveInterval;

  for (i = 0; i < map.markers.length; i++) {
    if (map.markers[i].id == markerId) {
      marker = map.markers[i];
      break;
    }
  }

  var i = -1;
  (function f(){
    i = (i + 1)
    if (i >= route.length) {
      clearTimeout(driveInterval);
      clearInterval(timeInterval);
      startMove();
      return
    }
    animate(marker, route[i]);
    driveInterval = setTimeout(f, 100);
  })();
}

function clearDirections(sender) {
  var dir = document.querySelector('google-map-directions');
  dir.map = null;
  dir.map = "{{map}}";
  dir.response = null;
  ambulanceRoute = null;
  policeRoute = null;
  Polymer.dom.flush();
}

function updateLocation(marker) {
  var infoWindow = document.getElementById("markerInfo-" + marker.id);

  var locationElements = infoWindow.getElementsByClassName('location');

  if (document.getElementById('border').checked) {
    if (isVehicleInBorder(marker)) {
      locationElements[0].innerHTML = "Inside Border";
    }
    else {
      locationElements[0].innerHTML = "Outside Border";
    }
  }
  else {
    locationElements[0].innerHTML = "N/A";
  }
  Polymer.dom.flush();
}

function animate(marker, latlng) {
  marker.latitude = latlng.lat();
  marker.longitude = latlng.lng();
  updateElapsedTime();
  updateLocation(marker);
  Polymer.dom.flush();
}

function updateElapsedTime() {
  infoWindow = d3.select("google-map").select("#markerInfo-call0");
  
  var currentDate = new Date();
  var timeDiff = Math.abs(currentDate.getTime() - callTime.getTime());
  var diffDays = Math.ceil(timeDiff / (1000)) - 1; 
  
  //alert(diffDays);
  div = infoWindow
    .select("div")
    .select("foreignObject")
    .select("div")
    .select("i.timeElapsed")
    .text(diffDays);

  Polymer.dom.flush();
}

function isVehicleInBorder(marker) {
  var poly = document.querySelector('google-map-poly');

  markerLatLng = new google.maps.LatLng(marker.latitude, marker.longitude);
  if (google.maps.geometry.poly.containsLocation(markerLatLng, poly.poly)) {
    return true;
  }
  else {
    return false;
  }
}

function getRoute() {      
  var routeArray = [];
  var dir = document.querySelector('google-map-directions');
  if (dir.response) {
    route = dir.response.routes[0]
    legs = route.legs;
    for (i = 0; i < legs.length; i++) {
      steps = legs[i].steps;
      for (j = 0; j < steps.length; j++) {
        segment = steps[j].path;
        for (k = 0; k < segment.length; k++) {
          routeArray.push(segment[k]);
        }
      }
    }
  }
  return routeArray;
}

function startMove() {
  moveInterval = setInterval(move, 5000);
}

function move() {
  coefficient = 0.0001
  for (i = 0; i < map.markers.length; i++) {
    if (['police', 'ambulance', 'patrol'].indexOf(map.markers[i].group) != -1) {
      if (Math.floor((Math.random() * 10) + 1) > 5) {
        // Latitute
        if (Math.floor((Math.random() * 10) + 1) > 5) {
          // Up
          map.markers[i].latitude = map.markers[i].latitude + coefficient;
        }
        else {
          // Down
          map.markers[i].latitude = map.markers[i].latitude - coefficient;
        }
      }
      else {
        // Longitute
        if (Math.floor((Math.random() * 10) + 1) > 5) {
          // Up
          map.markers[i].longitude = map.markers[i].longitude + coefficient;
        }
        else {
          // Down
          map.markers[i].longitude = map.markers[i].longitude - coefficient;
        }
      }
      updateLocation(map.markers[i]);
    }
  }
  Polymer.dom.flush();
}

function stopMove() {
  clearInterval(moveInterval);
}

function handleBorder(cb) {
  if (cb.checked) {
    showBorder();
  }
  else {
    hideBorder();
  }
}

function hideBorder() {
  var poly = document.querySelector('google-map-poly');
  Polymer.dom(poly.parentNode).removeChild(poly);
  Polymer.dom.flush();
}

function showBorder() {
  poly = document.createElement('google-map-poly');
  poly.clickable = true;
  poly.closed = true;
  poly.fillColor = "red";
  poly.strokeColor = 'blue';
  poly.fillOpacity = .2
  poly.strokeOpacity = .5;
  poly.strokeWeight = 1;
  poly.zIndex = 1;
  
  for (i = 0; i < locations['border'].length; i++) {
    point = document.createElement('google-map-point');
    point.latitude = locations['border'][i][0];
    point.longitude = locations['border'][i][1];
    Polymer.dom(poly).appendChild(point);
  }

  Polymer.dom(map).appendChild(poly);
  Polymer.dom.flush();
}

function handleClick(cb) {
  if (cb.checked) {
    addMarker(cb.id, locations[cb.id]);
  }
  else {
    deleteMarker(cb.id);
  }
}

function getTimeStamp(now) {
  return ((now.getMonth() + 1) + '/' +
          (now.getDate()) + '/' +
           now.getFullYear() + " " +
           now.getHours() + ':' +
           ((now.getMinutes() < 10)
               ? ("0" + now.getMinutes())
               : (now.getMinutes())) + ':' +
           ((now.getSeconds() < 10)
               ? ("0" + now.getSeconds())
               : (now.getSeconds())));
}

function addMarker(group, locLatLon) {
  for (i = 0; i < locLatLon.length; i++) {
    markerId = group + i;
    marker = document.createElement('google-map-marker');
    marker.latitude = locLatLon[i][0];
    marker.longitude = locLatLon[i][1];
    marker.clickEvents = true;
    marker.group = group;
    marker.id = markerId;
    marker.icon = icons[group];
    marker.title = group;
    info = document.createElement('google-map-infowindow');
    info.innerHTML = '<div class="markerInfo" id="markerInfo-' + markerId + '"></div>';
    Polymer.dom(marker).appendChild(info);
    Polymer.dom(map).appendChild(marker);
    if (group == 'call') {
      marker.draggable = true;
      marker.animation = 'DROP';
      callTime = new Date();
      timeInterval = setInterval(updateElapsedTime, 1000);
    }
    Polymer.dom.flush();
    addChart(group, i);
  }
  moveInterval = setInterval(move, 5000);
}

function deleteMarker(group) {
  for (i = 0; i < map.markers.length; i++) {
    if (map.markers[i].group == group) {
      Polymer.dom((Polymer.dom(map.markers[i]).parentNode)).removeChild(map.markers[i]);
    }
  }
  if (group == 'call') {
    enableCheck = true;
  }
}

function goToUrl(group) {
  if (group == 'ambulance') {
    window.location.href = "/object";
  }
}

function getIcon(group) {
  if (group == "police") {
    return "taxi";
  }
  else if (group == "ambulance") {
    return "ambulance";
  }
  else if (group == "call") {
    return "video-camera";
  }
}

function addChart(group, index) { 
  var w = 600;
  var h = 400;
  
  infoWindow = d3.select("google-map").select("#markerInfo-" + group + index);

  //Create DIV element
  var div = infoWindow
    .append("div")
    .attr("width", w)
    .attr("height", h);

  // Add Action Buttono
  if (group == "police" || group == "ambulance") {
    div.append("foreignObject")
      //.attr("width", "80%")
      //.attr("height", "50%")
      .html("<div class='btn-group'>"+
              "<a class='btn btn-primary' href=''><i class='fa fa-user fa-fw'></i> Actions</a>"+
              "<a class='btn btn-primary dropdown-toggle' data-toggle='dropdown'>"+
                "<span class='fa fa-caret-down' title='Toggle dropdown menu'></span>"+
              "</a>"+
              "<ul class='dropdown-menu'>"+
                "<li><a href='' id='" + group + index + "' onclick='handleVehicle(this.id);'><i class='fa fa-phone fa-fw'></i> Take Call</a></li>"+
                //"<li><a href='' id='" + group + "' onclick='goToUrl(this.id);'><i class='fa fa-" + getIcon(group) + " fa-fw'></i> See Details</a></li>"+
                "<li><a href='/object' id='" + group + "'><i class='fa fa-" + getIcon(group) + " fa-fw'></i> See Details</a></li>"+
                "<li><a href=''><i class='fa fa-fire fa-fw'></i> Notify Fire Department</a></li>"+
                "<li class='divider'></li>"+
                "<li><a href=''><i class='fa fa-ban'></i> Cancel Notifications</a></li>"+
              "</ul>"+
            "</div>");
    //.append("br")

    div.append("foreignObject")
        .html("<div style='width: 200px;height: 50px'>" +
            "<br>" +
            "<i class='fa fa-location-arrow' aria-hidden='true'></i> Location: <i class='location'></i>" +
            "<br>" +
            "</div>");
    
    div.append("foreignObject")
    //.attr("width", "80%")
    //.attr("height", "50%")
    //.append("xhtml:body")
    .html("<div class='panel-group' id='accordion" + group + index + "' role='tablist' aria-multiselectable='true'>"+
            "<div class='panel panel-default'>"+
              "<div class='panel-heading' role='tab' id='headingOne" + group + index + "'>"+
                "<h4 class='panel-title'>"+
                  "<a role='button' data-toggle='collapse' data-parent='#accordion" + group + index + "' href='#collapseOne" + group + index + 
                    "' aria-expanded='false' aria-controls='collapseOne" + group + index + "'>Staff</a>"+
                "</h4>"+
              "</div>"+
            "<div id='collapseOne" + group + index + "' class='panel-collapse collapse' role='tabpanel' aria-labelledby='headingOne" + group + index + "'>"+
              "<div class='panel-body'>"+
                "<table class='ebTable'> "+
                  "<tbody>"+
                    "<tr>"+
                      "<td><i class='fa fa-id-card-o fa-3x' aria-hidden='true'></i></td>"+
                    "</tr> "+
                    "<tr> "+
                      "<td><b>1. Driver</b></td> "+
                      "<td>Henry Ford</td> "+
                      "<td>"+
                        "<button type='button' class='btn btn-primary' data-toggle='modal' data-target='.bs-example-modal-sm'>Trainings</button>"+
                        "<div class='modal fade bs-example-modal-sm' tabindex='-1' role='dialog' aria-labelledby='mySmallModalLabel'>"+
                          "<div class='modal-dialog modal-sm' role='document'>"+
                            "<div class='modal-content'>"+
                              "..."+
                            "</div>"+
                          "</div>"+
                        "</div>"+
                      "</td>"+
                    "</tr>"+
                    "<tr>"+
                      "<td><b>2. First Responder</b></td>"+
                      "<td>Lisa Lorens</td>"+
                    "</tr>"+
                    "<tr>"+
                      "<td><b>3. Care Assistant</b></td>"+
                      "<td>Sarah Care</td>"+
                    "</tr>"+
                    "<tr>"+
                      "<td><b>4. Paramedic</b></td>"+
                      "<td>Maria Medic</td>"+
                    "</tr>"+
                  "</tbody> "+
                "</table>"+
              "</div>"+
            "</div>"+
          "</div>"+
          "<div class='panel panel-default'>"+
            "<div class='panel-heading' role='tab' id='headingTwo" + group + index + "'>"+
              "<h4 class='panel-title'>"+
                "<a class='collapsed' role='button' data-toggle='collapse' data-parent='#accordion" + group + index + "' href='#collapseTwo" + group + index + 
                "' aria-expanded='false' aria-controls='collapseTwo" + group + index + "'>"+
                  "Vehicle"+
                "</a>"+
              "</h4>"+
            "</div>"+
            "<div id='collapseTwo" + group + index + "' class='panel-collapse collapse' role='tabpanel' aria-labelledby='headingTwo" + group + index + "'>"+
              "<div class='panel-body'>"+
                "<table class='ebTable'> "+
                  "<tbody>"+
                    "<tr>"+
                      "<td>"+
                        "<i class='fa fa-" + getIcon(group) + " fa-3x' aria-hidden='true'>"+
                        "</i>"+
                      "</td>"+
                    "</tr> "+
                    "<tr> "+
                      "<td>"+
                        "<i class='fa fa-tachometer fa-fw' aria-hidden='true'></i>"+
                          "<b>"+
                            "&nbsp; Speed"+
                          "</b>"+
                        "</td> "+
                      "<td>"+
                        "<div class='txtSpeed'>"+
                        "</div>"+
                      "</td> "+
                    "</tr>"+
                    "<tr>"+
                      "<td>"+
                        "<i class='fa fa-battery fa-fw' aria-hidden='true'></i>"+
                          "<b>"+
                            "&nbsp; Battery Level"+
                          "</b>"+
                        "</td>"+
                      "<td>"+
                        "89%"+
                      "</td>"+
                    "</tr>"+
                    "<tr>"+
                      "<td>"+
                        "<i class='fa fa-thermometer fa-fw' aria-hidden='true'></i>"+
                          "<b>"+
                            "&nbsp; Oil Level"+
                          "</b>"+
                        "</td>"+
                      "<td>"+
                        "95%"+
                      "</td>"+
                    "</tr>"+
                    "<tr>"+
                      "<td>"+
                        "<i class='fa fa-bar-chart fa-fw' aria-hidden='true'></i>"+
                          "<b>"+
                            "&nbsp; Tire Pressure"+
                          "</b>"+
                        "</td>"+
                      "<td>"+
                        "Front Left: 35 "+
                        "<br>Front Right: 34 "+
                        "<br>Rear Left: 32 "+
                        "<br>Rear Right: 32"+
                      "</td>"+
                    "</tr>"+
                    "<tr>"+
                      "<td>"+
                        "<i class='fa fa-wrench fa-fw' aria-hidden='true'></i>"+
                          "<b>"+
                            "&nbsp; Last Maintanance"+
                          "</b>"+
                        "</td>"+
                      "<td>"+
                        "2016.11.20"+
                      "</td>"+
                    "</tr>"+
                  "</tbody> "+
                "</table>"+
              "</div>"+
            "</div>"+
          "</div>");
    }
    else if (group == "call") {
      div.append("foreignObject")
        //.attr("width", "80%")
        //.attr("height", "50%")
        .html("<div style='width: 200px;height: 100px'>"+
            "<i class='fa fa-" + getIcon(group) + " fa-fw'></i><a href='/video' id='" + group + "'> Camera Feeds</a>" +
            "<br><br>" + 
            "<i class='fa fa-clock-o fa-fw'></i> Call Time: " + getTimeStamp(callTime) +
            "<br><br>" + 
            "<i class='fa fa-hourglass-start fa-fw' id='elapsedTime'></i> Elapsed Time (Seconds): <i class='timeElapsed'></i>" +
          "</div>"
            //"<div class='btn-group' style='width: 300px;height: 100px'>"+
            //  "<a class='btn btn-primary' href=''><i class='fa fa-user fa-fw'></i> Actions</a>"+
            //  "<a class='btn btn-primary dropdown-toggle' data-toggle='dropdown'>"+
            //  "<span class='fa fa-caret-down' title='Toggle dropdown menu'></span>"+
            //  "</a>"+
            //  "<ul class='dropdown-menu'>"+
            //    "<li><a href='/video' id='" + group + "'><i class='fa fa-" + getIcon(group) + " fa-fw'></i> Go To Cameras</a></li>"+
            //    "<li class='divider'></li>"+
            //    "<li><a id='" + group + "' href=''><i class='fa fa-ban'></i> Cancel</a></li>"+
            //  "</ul>"+
            //"</div>"
            );
    }
}
