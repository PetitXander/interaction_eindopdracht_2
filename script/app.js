
let lat = 50.900692;
let long = 3.731650;
// get charge points
const getAPI = async (lat, long) => {
	const key = '';
	const chargingStations = await fetch(`https://api.openchargemap.io/v3/poi/?key=${key}&latitude=${lat}&longitude=${long}&distance=50&distanceunit=KM`)
		.then((r) => r.json())
		.catch((err) => console.error('An error occured ', err));
	console.log(chargingStations);

};