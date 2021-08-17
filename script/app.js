
let lat = 50.900692;
let long = 3.731650;
// get charge points


const getAPI = async (lat, long) => {
	const key = '27939f64-f1a9-44a7-9d38-7f94c979057d ';
	const chargingStations = await fetch(`https://api.openchargemap.io/v3/poi/?key=${key}&latitude=${lat}&longitude=${long}&distance=50&distanceunit=KM`)
		.then((r) => r.json())
		.catch((err) => console.error('An error occured ', err));
	console.log(chargingStations);

};



// DOMContentLoaded
document.addEventListener('DOMContentLoaded', function () {
    console.log('init');
    getAPI();
});