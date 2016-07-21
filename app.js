/*global $*/
$(document).ready(function(){
    /* 
    Get location value and make api call to google mpas
    declare map parameters to use with api call
    */
    /*
    If selected option is schools, filter results by school
    If selected option is station, filter results by train station
    */
    var map;
    var infoWindow;
    var service;
    
    $("button").on('click', function(){
        var location = $("#location").val();
        var selectedOption = $("#selectOption option:selected").val();
        //console.log("option 1 - " + selectedOption);
        if (selectedOption === "schools"){
            selectedOption = "school";
        } else if (selectedOption === "grocery"){
            selectedOption = "grocery_or_supermarket";
        } else if (selectedOption === "station"){
            selectedOption = "train_station";
        }
        // check that location has a value then declare paramemeter object for api call
        if (location !== ""){
            var googleMapsUrl = "https://maps.googleapis.com/maps/api/geocode/json";
            var googleMapsApiKey = "YOUR_API_KEY_HERE";
            var paramsObj = {
                "address":location,
                "key":googleMapsApiKey
            };
            $.get(googleMapsUrl, paramsObj, function(resp){
                var lat = resp.results[0].geometry.location.lat;
                var lng = resp.results[0].geometry.location.lng;
                
                //function to display the map and results
                displayMap(lat, lng, selectedOption);
            });
        }
        
    });
    
    function displayMap(lat, lng, selectedOption){
        var area = new google.maps.LatLng(lat, lng);
        //new google.maps.LatLng(lat, lng)
        var mapProperties = {
            "center": area,
            "zoom": 14,
            "mapTypeId": google.maps.MapTypeId.ROADMAP
        };
        // create a variable to contain the parameters for the places search
        //console.log("Option 2 - " + selectedOption);
        var placesProperties = {
            "location":area,
            "radius":2000,
            "type":[selectedOption]
            //"rankBy": google.maps.places.rankBy.DISTANCE
        };
        map = new google.maps.Map(document.getElementById("mapResult"), mapProperties);
        
        // create an infowindow variable to capture information for the markers?
        infoWindow = new google.maps.InfoWindow();
        // create a service variable for google places that searches based on location
        service = new google.maps.places.PlacesService(map);
        service.nearbySearch(placesProperties, callback);
        //Use service.getDetails()?? what is the difference with nearbySearch??
        // How to limit results to boundary results
    }
    
    // function to return search results for places
    function callback(results, status){
        if (status === google.maps.places.PlacesServiceStatus.OK){
            for (var i = 0; i < results.length; i++){
                createMarker(results[i]);
                console.log(results[i].place_id);
            }
        }
    }
    
    // function to create markers on the map
    function createMarker(place){
        var placeLoc = place.geometry.location;
        var placesList = document.getElementById("resultsList");
        var boundary = new google.maps.LatLngBounds();
        var marker = new google.maps.Marker({
            "map":map,
            "title":place.name,
            "position":placeLoc
        });
        placesList.innerHTML += '<li>' + place.name + '</li>';
        //boundary.extends(placeLoc);
        
        // add event listner for when infowindow is clicked
        google.maps.event.addListener(marker, 'click', function(){
            //infoWindow.setContent('<div><strong>' + place.name + '</strong><br/>' + place.formatted_address + '</div>');
            infoWindow.setContent('<div><strong>' + place.name + '</strong></div>');
            infoWindow.open(map, this);
        });
    }
    
    
});