/**
 * Created by tristan on 02/12/2015.
 */
var map;
var infowindow;

//Defined restriction: 10km de rayon

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