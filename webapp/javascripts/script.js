/**
 * Created by tristan on 02/12/2015.
 */
var map;
var infowindow;
var arrCoordinate = [{lat: 48.856614, lng: 2.352222},{lat: 47.956614, lng: 2.152222},{lat: 48.896614, lng: 2.752222}];
var Location = ObjectStorage('Location');
var QueryString = getQueryString();

if (typeof localStorage.tokens !== "undefined") {
    var tokens = JSON.parse(localStorage.tokens);
    if (tokens.indexOf(QueryString.token)) {
        console.log(tokens);
    } else {
       //addToken in array
        tokens.push(QueryString.token);
    }
} else {
    /// create Tokens array
    var tokens = [];
    tokens.push(QueryString.token);
}
localStorage.tokens = JSON.stringify(tokens);


//Defined restriction: 10km de rayon
function firstVisite() {
    if ("geolocation" in navigator) {
        navigator.geolocation.getCurrentPosition(getPosition);
    }
}

function getPosition(position) {
    Location.save({token: QueryString.token, lat: position.coords.latitude, lng: position.coords.longitude});
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
    return Token;
};


function ObjectStorage(nameObject) {
    Parse.initialize("ed25cVixRTbSDfLMimYGv9HysDR1wC8R4Jkg6erm", "j8pJL3I0LoWOnuKKzyHSLDfcrhTLRe4vfAOEulPy");
    var Object = Parse.Object.extend(nameObject);

    return {
        save: save,
        retrieve: retrieve
    };

    function save(params) {
        var newObject = new Object();
        newObject.save(params).then(function(object) {
            alert('saved');
        }, function (error) {
            alert("Error: " + error.code + " " + error.message);
        });
    }

    function retrieve(key, val) {
        var query = new Parse.Query(Object);
        query.equalTo(key, val);
        query.find({
            success: function(results) {
                alert("Successfully retrieved " + results.length + " scores.");
                // Do something with the returned Parse.Object values
                for (var i = 0; i < results.length; i++) {
                    var object = results[i];
                    alert(object.id + ' - ' + object.get('lat') + ', ' + object.get('lng'));
                }
            },
            error: function(error) {
                alert("Error: " + error.code + " " + error.message);
            }
        });
    }
}

function getQueryString() {
    // This function is anonymous, is executed immediately and
    // the return value is assigned to QueryString!
    var query_string = {};
    var query = window.location.search.substring(1);
    var vars = query.split("&");
    for (var i=0;i<vars.length;i++) {
        var pair = vars[i].split("=");
        // If first entry with this name
        if (typeof query_string[pair[0]] === "undefined") {
            query_string[pair[0]] = decodeURIComponent(pair[1]);
            // If second entry with this name
        } else if (typeof query_string[pair[0]] === "string") {
            var arr = [ query_string[pair[0]],decodeURIComponent(pair[1]) ];
            query_string[pair[0]] = arr;
            // If third or later entry with this name
        } else {
            query_string[pair[0]].push(decodeURIComponent(pair[1]));
        }
    }
    return query_string;
};