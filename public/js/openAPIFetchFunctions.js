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

async function fetchCoordForPlace(place) {
  try {
    let placeDataURL = `https://api.opentripmap.com/0.1/en/places/geoname?name=${place}&apikey=5ae2e3f221c38a28845f05b67a2c973ea4a2466e011768b41a6fa08b`
    let placeData = await fetchDataFromAPI(placeDataURL);
    return {
      lat: placeData.lat,
      lon: placeData.lon
    };
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

  let pointsOfInterest = await fetchPointsOfInterestWithinXMetersOfLatLon(latitude, longitude, 10000);

  console.log(pointsOfInterest);
  let pointOfInterestXID = pointsOfInterest[117].xid;
  console.log(pointOfInterestXID)
  pointOfInterestDetails = await fetchPointOfInterestDetails(pointOfInterestXID);
  console.log(pointOfInterestDetails)

}

async function searchForPointsOfInterestByCityAndTerm(city, radius, searchTerm, numberOfResults) {
  let { lat, lon } = await fetchCoordForPlace(city)
  let url = `https://api.opentripmap.com/0.1/en/places/autosuggest?name=${searchTerm}&radius=${radius}&lon=${lon}&lat=${lat}&limit=${numberOfResults}&apikey=5ae2e3f221c38a28845f05b67a2c973ea4a2466e011768b41a6fa08b`
  return await fetch(url)
    .then((results) => results.json())
    .then((JSONResults) => JSONResults)
    .then((results) => results.features)
    .then((features) => {
      let featuresArray = [];
      features.forEach((feature) => {
        featuresArray.push({
          name: feature.properties.name,
          xid: feature.properties.xid
        })
      })
      return featuresArray;
    })
};


searchForPointsOfInterestByCityAndTerm(`London`, 20000, 'museum', 20)
  .then((results) => { console.log(results) })




fetchPointOfInterestDetails(`Q27084322`)
  .then((result) => { console.log(result) })

// fetchPointOfInterestDetails(`R6595252`)
//   .then((result) => { console.log(result) })

// // console.log(ArmourSquarePark)

// // console.log(results);