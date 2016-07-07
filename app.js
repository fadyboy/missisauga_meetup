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
    $("button").on('click', function(){
        var location = $("#location").val();
        // check that location has a value then declare paramemeter object for api call
        if (location !== ""){
            var googleMapsUrl = "https://maps.googleapis.com/maps/api/geocode/json";
            var googleMapsApiKey = "YOUR_GOOGLE_APP_KEY";
            var paramsObj = {
                "address":location,
                "key":googleMapsApiKey
            };
            $.get(googleMapsUrl, paramsObj, function(resp){
                var lat = resp.results[0].geometry.location.lat;
                var lng = resp.results[0].geometry.location.lng;
                
                //function to display the map and results
                displayMap(lat, lng);
            });
        }
    });
    
    function displayMap(lat, lng){
        var mapProperties = {
            "center": new google.maps.LatLng(lat, lng),
            "zoom": 15,
            "mapTypeId": google.maps.MapTypeId.ROADMAP
        };
        
        var map = new google.maps.Map(document.getElementById("mapResult"), mapProperties);
    }
    
    
});