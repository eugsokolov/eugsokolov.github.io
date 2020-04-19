function getCoordinatesForMap() {
  $.ajax('https://script.google.com/macros/s/AKfycbzrkYN1RrZfcHPEoZduSRwFhdLny4stcXnoenTTPEhLVBSlqQZt/exec')
  .then(
      function success(points) {
        console.log(points)
        return points
      },
      function fail(data, status) {
          console.log('coordinates get failed', data, status);
          return []
      }
  );
}

function hideMap() {
  document.getElementById('map-container').style.visibility = 'hidden';
  document.getElementById('map-container').style.height = '0px';
}

function showMap() {
  document.getElementById('map-container').style.visibility = 'visible';
  document.getElementById('map-container').style.height = '400px';
}

var map, heatmap;

function initMap() {
  map = new google.maps.Map(document.getElementById('map'), {
    zoom: 2,
    center: {lat: 22.404, lng: -3.584},
    mapTypeId: 'roadmap'
  });
  $.ajax('https://script.google.com/macros/s/AKfycbzrkYN1RrZfcHPEoZduSRwFhdLny4stcXnoenTTPEhLVBSlqQZt/exec')
  .then(
      function success(points) {
        heatmap = new google.maps.visualization.HeatmapLayer({
          data: points.map(i => new google.maps.LatLng(i[0], i[1])),
          map: map
        });
        showMap();
      },
      function fail(data, status) {
          console.log('coordinates get failed', data, status);
          hideMap();
      }
  );
}

function toggleHeatmap() {
  heatmap.setMap(heatmap.getMap() ? null : map);
}

function changeGradient() {
  var gradient = [
    'rgba(0, 255, 255, 0)',
    'rgba(0, 255, 255, 1)',
    'rgba(0, 191, 255, 1)',
    'rgba(0, 127, 255, 1)',
    'rgba(0, 63, 255, 1)',
    'rgba(0, 0, 255, 1)',
    'rgba(0, 0, 223, 1)',
    'rgba(0, 0, 191, 1)',
    'rgba(0, 0, 159, 1)',
    'rgba(0, 0, 127, 1)',
    'rgba(63, 0, 91, 1)',
    'rgba(127, 0, 63, 1)',
    'rgba(191, 0, 31, 1)',
    'rgba(255, 0, 0, 1)'
  ]
  heatmap.set('gradient', heatmap.get('gradient') ? null : gradient);
}

function changeRadius() {
  heatmap.set('radius', heatmap.get('radius') ? null : 20);
}

function changeOpacity() {
  heatmap.set('opacity', heatmap.get('opacity') ? null : 0.2);
}
