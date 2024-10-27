const socket = io();

if(navigator.geolocation) {
    navigator.geolocation.watchPosition((position) => {
      const { latitude, longitude } = position.coords;
      console.log(`User's location: ${latitude}, ${longitude}`); 
      socket.emit("send-location",  { latitude, longitude });

    }, (error) => {
        console.error(error);
    },
    {
        enableHighAccuracy: true,
        timeout: 5000,
        maximumAge: 0,
    }
);
}


const map = L.map("map").setView([0,0], 12);

L.tileLayer("https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png", {
    attribution: "OpenStreetMap by Shalini"
}).addTo(map)


const markers = {};

//REMOVING this part remove  the exact location where we are on the map
socket.on("receive-location", (data) => {
    const {id, latitude, longitude} = data;
    map.setView([latitude, longitude], 12);

    if(markers[id]) {
        markers[id].setLatLng([latitude, longitude]);
    }
    else{
        markers[id] = L.marker([latitude, longitude]).addTo(map);
    }
    
});

socket.on("user-disconnected", (id) => {
    if (markers[id]) {
        map.removeLayer(markers[id]);
        delete markers[id];
    }
})

