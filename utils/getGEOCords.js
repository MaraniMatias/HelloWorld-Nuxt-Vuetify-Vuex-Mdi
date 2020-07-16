import get from './../utils/get'

async function getGeoCords(restApiKey, searchtext) {
  const query = encodeURIComponent(searchtext)
  const url = `https://geocoder.ls.hereapi.com/6.2/geocode.json?apiKey=${restApiKey}&searchtext=${query}`
  const response = await fetch(url)
  const rtaGeoJson = await response.json()
  const Location = get(rtaGeoJson, 'Response.View.0.Result.0.Location')
  if (typeof Location === 'undefined') return undefined

  // fetch(`https://nominatim.openstreetmap.org/search?q=${query}&format=json`)
  //   .then(response => response.json())
  //   .then(console.log);

  const { Latitude, Longitude } = Location.DisplayPosition
  const geoJson = {
    NavigationPosition: get(Location, 'NavigationPosition.0'),
    DisplayPosition: Location.DisplayPosition,
    Address: Location.Address,
    Latitude,
    Longitude,
  }
  return geoJson
}

export default getGeoCords
