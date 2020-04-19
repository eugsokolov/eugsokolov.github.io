function recordCoordinates(data) {
  if (validateHuman(data.honeypot)) {  //if form is filled, form will not be submitted
    return false;
  }

  data.formDataNameOrder = JSON.stringify(['lat', 'long']);
  data.formGoogleSheetName = "locations"; // default sheet name
  data.formGoogleSendEmail = ""; // no email by default

  var url = 'https://script.google.com/macros/s/AKfycbzrkYN1RrZfcHPEoZduSRwFhdLny4stcXnoenTTPEhLVBSlqQZt/exec';
  var xhr = new XMLHttpRequest();
  xhr.open('POST', url);
  // xhr.withCredentials = true;
  xhr.setRequestHeader('Content-Type', 'application/x-www-form-urlencoded');
  xhr.onreadystatechange = function() {
      console.log('status', xhr.status, xhr.statusText )
      console.log('response', xhr.responseText);
      return;
  };
  // todo post fails
  var encoded = Object.keys(data).map(function(k) {
      return encodeURIComponent(k) + '=' + encodeURIComponent(data[k])
  }).join('&')
  xhr.send(encoded);

}
function ipLookUp () {
  $.ajax('https://ipapi.co/json')
  .then(
      function success(response) {
          console.log('ip-api responses', response)
          recordCoordinates({lat: response.latitude, long: response.longitude});
      },
      function fail(data, status) {
          console.log('ipLookUp failed', status);
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
