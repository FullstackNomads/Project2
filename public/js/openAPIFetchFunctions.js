const fetchButton = document.getElementById(`test`);


fetchButton.addEventListener(`click`, test)

async function fetchDataFromAPI(url) {
  let rawData = await fetch(url);

  return rawData.json()
}

async function fetchDataForPlace(place) {
  try {
    let placeDataURL = `https://api.opentripmap.com/0.1/en/places/geoname?name=${place}&apikey=5ae2e3f221c38a28845f05b67a2c973ea4a2466e011768b41a6fa08b`
    let placeData = await fetchDataFromAPI(placeDataURL);
    return placeData;
    // return {
    //   latitude: latLonData.Lat,
    //   longitude: latLonData.Lon
    // }
  } catch (err) {
    return err;
  }
}

async function fetchPointsOfInterestWithinXMetersOfLatLon(lat, lon, meters) {
  try {
    let radiusURL = `https://api.opentripmap.com/0.1/en/places/radius?radius=${meters}&lon=${lon}&lat=${lat}&apikey=5ae2e3f221c38a28845f05b67a2c973ea4a2466e011768b41a6fa08b`

    return await fetchDataFromAPI(radiusURL)
      .then((radiusData) => {
        let pointsOfInterest = radiusData.features;
        console.log(pointsOfInterest);
        // console.log(radiusData.features)
        // console.log(radiusData.features[0])
        // console.log(radiusData.features[0].properties)
        // console.log(radiusData.features[0].properties.xid)
        let namedPlaces = [];
        pointsOfInterest.forEach((point) => {
          if (point.properties.name === "") {
            return;
          }
          namedPlaces.push({
            name: point.properties.name,
            xid: point.properties.xid,
            types: point.properties.kinds,
          });
        })
        return namedPlaces;
      });
  } catch (err) {
    return err;
  }
}

async function fetchPointOfInterestDetails(xid) {
  let url = `https://api.opentripmap.com/0.1/en/places/xid/${xid}?apikey=5ae2e3f221c38a28845f05b67a2c973ea4a2466e011768b41a6fa08b`

  let details = await fetch(url);
  return details.json();
}

// fetchDetails(`N639130340`)
//   .then((details) => console.log(details))

// `https://api.opentripmap.com/0.1/en/places/xid/N639130340?apikey=5ae2e3f221c38a28845f05b67a2c973ea4a2466e011768b41a6fa08b`

// fetchDataFromAPI(url)



async function test(e) {
  e.preventDefault();
  let place = document.getElementById(`search`).value;
  let placeData = await fetchDataForPlace(place);
  let latitude = placeData.lat;
  let longitude = placeData.lon;
  console.log(`LATITUDE: ${latitude}\n\nLONGITUDE: ${longitude}`);

  let pointsOfInterest = await fetchPointsOfInterestWithinXMetersOfLatLon(latitude, longitude, 2000);

  console.log(pointsOfInterest);
  let pointOfInterestXID = pointsOfInterest[21].xid;
  console.log(pointOfInterestXID)
  pointOfInterestDetails = await fetchPointOfInterestDetails(pointOfInterestXID);
  console.log(pointOfInterestDetails)

}

// test(`rockford`)