// src/utils/cities.js
export async function searchUSCities(q) {
    const url = `https://api.teleport.org/api/cities/?search=${encodeURIComponent(q)}&limit=5`;
    const { _embedded } = await fetch(url).then(r=>r.json());
    return _embedded['city:search-results']
      // Only keep U.S. cities
      .filter(c => c.matching_full_name.endsWith('United States'))
      .map(c => ({
        name: c.matching_full_name,
        href: c._links['city:item'].href
      }));
  }
  
  export async function fetchLatLon(href) {
    const { location } = await fetch(href).then(r=>r.json());
    return {
      lat: location.latlon.latitude,
      lon: location.latlon.longitude
    };
  }
  