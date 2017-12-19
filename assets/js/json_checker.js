var enableCheck = true;
var jsonUrl = '../images/captured.json';
var jpegUrl = '../images/captured.jpeg';

function checkJsonFile() {
    var group = 'call';
    if (enableCheck && fileExists(jsonUrl) && fileExists(jpegUrl)) {
        enableCheck = false;
        //usage:
        readTextFile(jsonUrl, function(text){
            var data = parseJson(text);
            locations[group] = [[parseFloat(data.latitude), parseFloat(data.longitude)]];
            document.getElementById(group).checked = true;
            handleClick(document.getElementById(group));
        });
    }
}

function parseJson(jsonString) {
    obj = JSON.parse(jsonString);
    return obj;
}

function fileExists(file_url) {
    var http = new XMLHttpRequest();

    http.open('HEAD', file_url, false);
    http.send();

    return http.status != 404;
}

$(document).ready(function() {
    setInterval(checkJsonFile, 2000);
});

function readTextFile(file, callback) {
    var rawFile = new XMLHttpRequest();
    rawFile.overrideMimeType("application/json");
    rawFile.open("GET", file, true);
    rawFile.onreadystatechange = function() {
        if (rawFile.readyState === 4 && rawFile.status == "200") {
            callback(rawFile.responseText);
        }
    }
    rawFile.send(null);
}