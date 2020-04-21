function recordCoordinates(data) {
  if (validateHuman(data.honeypot)) {
    return false;
  }

  data.formDataNameOrder = JSON.stringify(['lat', 'long', 'origin']);
  data.formGoogleSheetName = "locations";
  data.origin= 'eugsokolov.github.io'

  function empty() {}
  postData(data, empty)
  loadMap()
}

function ipLookUp () {
  $.ajax('https://ipapi.co/json')
  .then(
      function success(response) {
          console.log('ip-api responses', response)
          recordCoordinates({'lat': response.latitude, 'long': response.longitude});
      },
      function fail(data, status) {
          console.log('ipLookUp failed', status);
          // TODO user blocked google lookup and ipapi, find a different way or just save IP
      }
  );
}

function getLocation(){
  if ("geolocation" in navigator) {
    navigator.geolocation.getCurrentPosition(
    function success(position) {
      recordCoordinates({'lat': position.coords.latitude, 'long': position.coords.longitude});
    },
    function error(error_message) {
      console.error('An error has occured while retrieving location', error_message);
      ipLookUp();
    });
  } else {
    console.log('geolocation is not enabled on this browser');
    ipLookUp();
  }
}
