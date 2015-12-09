/**
 * Created by tristan on 02/12/2015.
 */
var map;
var infowindow;
var arrCoordinate = [{lat: 48.856614, lng: 2.352222},{lat: 47.956614, lng: 2.152222},{lat: 48.896614, lng: 2.752222}];

//Defined restriction: 10km de rayon

if ("geolocation" in navigator) {
    navigator.geolocation.getCurrentPosition(getPosition);
}
function getPosition(position) {
    console.log(position);
    sendCoordinates(position.coords.latitude, position.coords.longitude);
}

function sendCoordinates(lat, lng) {
    var httpRequest = false;

    if (window.XMLHttpRequest) {
        httpRequest = new XMLHttpRequest();
        if (httpRequest.overrideMimeType) {
            httpRequest.overrideMimeType('text/xml');
        }
    } else if (window.ActiveXObject) { // IE
        try {
            httpRequest = new ActiveXObject("Msxml2.XMLHTTP");
        } catch (e) {
            try {
                httpRequest = new ActiveXObject("Microsoft.XMLHTTP");
            } catch (e) {
            }
        }
    }

    if (!httpRequest) {
        console.error('Impossible de créer une instance XMLHTTP');
        return false;
    }

    httpRequest.onreadystatechange = function () {
        (httpRequest);
    };
    httpRequest.open('GET', '/room/addCoordinate?lat=' + lat + '&lng=' + lng, true);
    httpRequest.send();
}


function initMap() {
    var center = calculCenterCoordinates(arrCoordinate);
    console.log(center);
    map = new google.maps.Map(document.getElementById('map'), {
        center: center,
        zoom: 15
    });

    infowindow = new google.maps.InfoWindow();

    var service = new google.maps.places.PlacesService(map);
    service.nearbySearch({
        location: center,
        radius: 10000,
        types: ['bar', 'movie_theater']
    }, callback);
}

function callback(results, status) {
    if (status === google.maps.places.PlacesServiceStatus.OK) {
        results.sort(function(a, b) {
            return parseFloat(b.rating) - parseFloat(a.rating);
        });
        createMarker(results[0]);
    }
}

function createMarker(place) {
    var placeLoc = place.geometry.location;
    var marker = new google.maps.Marker({
        map: map,
        position: place.geometry.location
    });
    map.setCenter(place.geometry.location);

    google.maps.event.addListener(marker, 'click', function() {
        infowindow.setContent(place.name);
        infowindow.open(map, this);
    });
}


function calculCenterCoordinates(coordinates) {
    var center = {
        lat: 0,
        lng: 0
    };
    var nbrTotalCoordinates = coordinates.length;

    for (var i = 0; i < nbrTotalCoordinates; i++) {
        center.lat += coordinates[i].lat;
        center.lng += coordinates[i].lng;
    }

    center.lat = center.lat / nbrTotalCoordinates;
    center.lng = center.lng / nbrTotalCoordinates;

    return center;
}

var rand = function() {
    var Token = Math.random().toString(36).substr(2);
    console.log(Token);
};

