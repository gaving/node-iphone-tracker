var map = (function() {
    var instance = null;
    var events = [];
    return {
        load : function() {
            map.instance = new google.maps.Map(document.getElementById("map"), {
                zoom: 5,
                mapTypeId: google.maps.MapTypeId.ROADMAP,
                center: new google.maps.LatLng(55.85, -4.31),
                scrollwheel: false,
                backgroundColor: 'black',
                navigationControl: true,
                navigationControlOptions: { position: google.maps.ControlPosition.RIGHT },
                scaleControl: true,
                scaleControlOptions: { position: google.maps.ControlPosition.BOTTOM }
            });

            var trafficLayer = new google.maps.TrafficLayer();
            trafficLayer.setMap(map.instance);

            google.maps.event.addListener(map.instance, 'zoom_changed', map.load_events);
            google.maps.event.addListener(map.instance, 'dragend', map.load_events);

            map.events = [];
            map.load_events();
        },
        load_events: function() {
            $.getJSON('/events', function(events) {
                map.clear();
                events.forEach(function(event) {
                    map.mark(event);
                });
            });
        },
        mark : function(event, hash) {
            var opts = hash || false;
            var marker = new google.maps.Marker({
                position: new google.maps.LatLng(event.lat || 0, event.lng || 0),
                title: event.title || "Unknown",
                icon: new google.maps.MarkerImage('/img/marker.png'),
                animation: opts.animation || false
            });
            marker.event = event;
            google.maps.event.addListener(marker, 'click', function() {
                map.show_info(marker);
            });
            marker.setMap(map.instance);
            map.events.push(marker);

            if (opts.centre) {
                map.instance.setCenter(marker.getPosition());
            }
        },
        clear : function() {
            map.events.forEach(function(event) {
                event.setMap(null);
            });
        },
        show_info : function(marker) {
            var contentString = '<div id="marker">'+
                '<h1>' + marker.event.title +' </h1>'+
                '<div id="bodyContent">'+
                '<p>' + marker.event.lat + ',' + marker.event.lng + '</p>'+
                '</div>'+
            '</div>';
            var infowindow = new google.maps.InfoWindow({
                content: contentString
            }).open(map.instance, marker);
        }
    };
})();
