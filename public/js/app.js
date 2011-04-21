$(function() {
    map.load();

    var socket = new io.Socket(null, {port: 8000, rememberTransport: false});
    socket.connect();
    socket.on('message', function(obj){
        map.mark(obj, { centre: true, anim : google.maps.Animation.DROP });
    });

    $(window).resize(function() {
        var map = $('#map'),
        map_height = $(window).height() - $("#status").height();
        map.height(map_height);
    }).trigger("resize");
});
