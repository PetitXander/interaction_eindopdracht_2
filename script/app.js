
const provider = 'https://{s}.basemaps.cartocdn.com/rastertiles/voyager/{z}/{x}/{y}{r}.png';
const copyright = '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors &copy; <a href="https://carto.com/attributions">CARTO</a> &copy; <a href="https://www.freevector.com">FreeVector.com</a>';

// get charge points
const getAPI = async (lat, long) => {
	const key = '27939f64-f1a9-44a7-9d38-7f94c979057d ';
	const chargingStations = await fetch(`https://api.openchargemap.io/v3/poi/?key=${key}&latitude=${lat}&longitude=${long}&distance=50&distanceunit=KM`)
		.then((r) => r.json())
		.catch((err) => console.error('An error occured ', err));
	console.log(chargingStations);

};

//init map
const initMap = () => {
	console.log('manp initiate');
	map = L.map('mapid').setView([50.900692, 3.731650], 10);
	layergroup = L.layerGroup().addTo(map);
	L.tileLayer(provider, { attribution: copyright }).addTo(map);
	searchControl = L.esri.Geocoding.geosearch().addTo(map);
};

//get user location
const getLocation = () => {
	console.log('GETLOCATION');
	if (navigator.geolocation) {
		navigator.geolocation.getCurrentPosition(showPosition, showError, { timeout: 10000 });
	} else {
		console.log('Geolocation is not supported by this browser.');
	}
};

// search on map
const searchOnMap = () => {
	results = L.layerGroup().addTo(map);
	searchControl.on('results', function (data) {
		results.clearLayers();
		layergroup.clearLayers();
		for (var i = data.results.length - 1; i >= 0; i--) {
			results.addLayer(L.marker(data.results[i].latlng));
			getAPI(data.results[i].latlng.lat, data.results[i].latlng.lng);
		}
	});
};

// DOMContentLoaded
document.addEventListener('DOMContentLoaded', function () {
    console.log('init');
    getAPI();
});