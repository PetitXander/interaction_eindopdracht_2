
const provider = 'https://{s}.basemaps.cartocdn.com/rastertiles/voyager/{z}/{x}/{y}{r}.png';
const copyright = '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors &copy; <a href="https://carto.com/attributions">CARTO</a> &copy; <a href="https://www.freevector.com">FreeVector.com</a>';

let myLocationBtn, navigateBtn, closeBtn, closeError, map, modal, layergroup, loader, locationError, card, cardTitle, content, cardAddress, cardType, cardContact, cardAvailable, cardComment, cardImage, membership, pay, charg;
let icons,
	images,
	props = [];
var searchControl, results, marker, popup;

// get charge points
const getAPI = async (lat, long) => {
	const key = '27939f64-f1a9-44a7-9d38-7f94c979057d ';
	const chargingStations = await fetch(`https://api.openchargemap.io/v3/poi/?key=${key}&latitude=${lat}&longitude=${long}&distance=50&distanceunit=KM`)
		.then((r) => r.json())
		.catch((err) => console.error('An error occured ', err));
	console.log(chargingStations);
    showResult(chargingStations);

};



//init map
const initMap = () => {
	console.log('map initiate');
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

// error when getting location
const showError = (error) => {
	searchOnMap();
	locationError.style.display = 'block';
	listenToControlsClick();
	loader.style.opacity = '0';
	loader.style.display = 'none';
	switch (error.code) {
		case error.PERMISSION_DENIED:
			console.log('User denied the request for Geolocation.');
			break;
		case error.POSITION_UNAVAILABLE:
			console.log('Location information is unavailable.');
			break;
		case error.TIMEOUT:
			console.log('The request to get user location timed out.');
			break;
		case error.UNKNOWN_ERROR:
			console.log('An unknown error occurred.');
			break;
	}
};

// show posistion on map
const showPosition = (position) => {
	var MyLocationIcon = L.icon({
		iconUrl: './img/MyLocationIcon.png',
		iconSize: [24, 24], // size of the icon
		iconAnchor: [24, 24], // point of the icon which will correspond to marker's location
		popupAnchor: [-12, -12], // point from which the popup should open relative to the iconAnchor
	});

	console.log(position);
	map.setView([position.coords.latitude, position.coords.longitude], 10);
	L.tileLayer(provider, { attribution: copyright }).addTo(map);
	searchOnMap();
	layergroup = L.layerGroup().addTo(map);

	let arr_coords = [];
	arr_coords.push(position.coords.latitude);
	arr_coords.push(position.coords.longitude);
	layergroup.clearLayers();

	let marker = L.marker(arr_coords, { icon: MyLocationIcon }).addTo(layergroup);
	marker.bindPopup(`YOU ARE HERE`);
	//api ophalen
	getAPI(position.coords.latitude, position.coords.longitude);
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

// show marker on map
const chargerMarker = (chargingStation) => {
	var chargerLocationIcon = L.icon({
		iconUrl: './img/EvLocationIcon.png',
		iconSize: [24, 32], // size of the icon
		iconAnchor: [24, 32], // point of the icon which will correspond to marker's location
		popupAnchor: [-12, -16], // point from which the popup should open relative to the iconAnchor
	});
	let chargingCoords = [];
	chargingCoords.push(chargingStation.AddressInfo.Latitude);
	chargingCoords.push(chargingStation.AddressInfo.Longitude);

	marker = L.marker(chargingCoords, { icon: chargerLocationIcon }).addTo(layergroup);
	marker.addEventListener('click', function () {
		content = '<p class="c-popup">' + chargingStation.AddressInfo.Title + '<span class="material-icons">keyboard_arrow_up</span></p>';
		popup = L.popup({ offset: [-12, -16] })
			.setLatLng([chargingStation.AddressInfo.Latitude, chargingStation.AddressInfo.Longitude])
			.setContent(content)
			.openOn(map);
		listenToPopUpClick(chargingStation);
	});
};

// show results
const showResult = (chargingStations) => {
	loader.style.opacity = '0';
	setTimeout(function () {
		loader.style.display = 'none';
	}, 1000);
	chargingStations.forEach((chargingStation) => {
		chargerMarker(chargingStation);
	});
};

//loction click
const listenToLocationClick = () => {
	myLocationBtn.addEventListener('click', function () {
		loader.style.display = 'flex';
		loader.style.opacity = '1';
		results.clearLayers();
		layergroup.clearLayers();
		getLocation();
	});
};

// DOMContentLoaded
document.addEventListener('DOMContentLoaded', function () {
    console.log('init');
	myLocationBtn = document.querySelector('.js-getMyLocation');
	navigateBtn = document.querySelector('.js-navigateTo');
	closeBtn = document.querySelector('.js-closeModal');
	closeError = document.querySelector('.js-closeError');
	loader = document.querySelector('.js-loader');
	card = document.querySelector('.js-card');
	modal = document.querySelector('.js-modal');
	locationError = document.querySelector('.js-location__error');
	cardTitle = document.querySelector('.js-card_title');
	cardAddress = document.querySelector('.js-card_info_addressTitle');
	cardType = document.querySelector('.js-card_info_typeTitle');
	cardContact = document.querySelector('.js-card_info_contact');
	cardAvailable = document.querySelector('.js-card_properties_available');
	cardComment = document.querySelector('.js-card_comment');
	cardImage = document.querySelector('.js-card_img');
	membership = document.querySelector('.js-card_properties_icons_membership');
	pay = document.querySelector('.js-card_properties_icons_pay');
	charg = document.querySelector('.js-card_properties_icons_charg');
	icons = [membership, pay, charg];
	images = ['./img/chargerstation-03.svg', './img/RenewableGreenEnergy.svg', './img/SolarEnergyCarCharger.svg'];
	initMap();
	listenToLocationClick();
	getLocation();
});