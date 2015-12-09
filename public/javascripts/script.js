/**
 * Created by tristan on 02/12/2015.
 */
var map;
var infowindow;

//Defined restriction: 10km de rayon

console.log(coordinates);
if ("geolocation" in navigator) {
    navigator.geolocation.getCurrentPosition(getPosition);
}
function getPosition(position) {
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
    var paris = {lat: 48.856614, lng: 2.352222};

    map = new google.maps.Map(document.getElementById('map'), {
        center: paris,
        zoom: 15
    });

    infowindow = new google.maps.InfoWindow();

    var service = new google.maps.places.PlacesService(map);
    service.nearbySearch({
        location: paris,
        radius: 500,
        types: ['bar', 'movie_theater']
    }, callback);
}

function callback(results, status) {
    if (status === google.maps.places.PlacesServiceStatus.OK) {
        results.sort(function(a, b) {
            return parseFloat(b.rating) - parseFloat(a.rating);
        });
        console.log(results[0]);
        createMarker(results[0]);
    }
}

function createMarker(place) {
    var placeLoc = place.geometry.location;
    var marker = new google.maps.Marker({
        map: map,
        position: place.geometry.location
    });

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
    var nbrTotalCoordinates = coordinates.length();

    for (var i = 0; i < nbrTotalCoordinates; i++) {
        center.lat += coordinates[i].lat;
        center.lng += coordinates[i].lng;
    }

    center.lat = center.lat / nbrTotalCoordinates;
    center.lng = center.lng / nbrTotalCoordinates;

    return center;
}
