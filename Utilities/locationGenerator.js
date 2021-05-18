// https://gist.github.com/mkhatib/5641004

/**
* Generates number of random geolocation points given a center and a radius.
* @param  {Object} center A JS object with latitude and longitude attributes.
* @param  {number} radius Radius in meters.
* @param {number} count Number of points to generate.
* @return {array} Array of Objects with lat and lng attributes.
*/

export function generateRandomPoints(center, radius, count) {
  var points = [];
  for (var i=0; i<count; i++) {
    points.push(generateRandomPoint(center, radius));
  }
  return points;
}

/**
* Generates number of random geolocation points given a center and a radius.
* Reference URL: http://goo.gl/KWcPE.
* @param  {Object} center A JS object with latitude and longitude attributes.
* @param  {number} radius Radius in meters.
* @return {Object} The generated random points as JS object with latitude and longitude attributes.
*/

export function generateRandomPoint(center, radius) {
  let x0 = center.longitude;
  let y0 = center.latitude;
  // Convert Radius from meters to degrees.
  let rd = radius/111300;

  let u = Math.random();
  let v = Math.random();

  let w = rd * Math.sqrt(u);
  let t = 2 * Math.PI * v;
  let x = w * Math.cos(t);
  let y = w * Math.sin(t);

  let xp = x/Math.cos(y0);

  // Resulting point.
  return {'latitude': y+y0, 'longitude': xp+x0};
}
