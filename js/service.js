/******************************************************************************
 * This tutorial is based on the work of Martin Hawksey twitter.com/mhawksey  *
 * But has been simplified and cleaned up to make it more beginner friendly   *
 * All credit still goes to Martin and any issues/complaints/questions to me. *
 ******************************************************************************/

var TO_ADDRESS = "eugsokolov@gmail.com";

// spit out all the keys/values from the form in HTML for email
function formatMailBody(obj, order) {
  var result = "";
  // loop over all keys in the ordered form data
  for (var idx in order) {
    var key = order[idx];
    result += "<h4 style='text-transform: capitalize; margin-bottom: 0'>" + key + "</h4><div>" + obj[key] + "</div>";
    // for every key, concatenate an `<h4 />`/`<div />` pairing of the key name and its value, 
    // and append it to the `result` string created at the start.
  }
  return result; // once the looping is done, `result` will be one long string to put in the email body
}

function sendEmail(data) {
    try {
        MailApp.sendEmail({
            to: TO_ADDRESS,
            subject: "Contact form submitted from sokolov.tech",
            replyTo: String(data.email), // This is optional and reliant on your form actually collecting a field named `email`
            htmlBody: formatMailBody(data, JSON.parse(data.formDataNameOrder))
        });
    
        return ContentService    // return json success results
                .createTextOutput(
                JSON.stringify({"result":"success",
                                "data": JSON.stringify(data) }))
                .setMimeType(ContentService.MimeType.JSON);
    } catch(error) { // if error return this
      Logger.log(error);
      return ContentService
            .createTextOutput(JSON.stringify({"result":"error", "error": e}))
            .setMimeType(ContentService.MimeType.JSON);
    }
}

function recordDataInSheet(data, sheetName) {
  try {
    var doc = SpreadsheetApp.getActiveSpreadsheet();
    var sheet = doc.getSheetByName(sheetName);
    var headers = sheet.getRange(1, 1, 1, sheet.getLastColumn()).getValues()[0];
    var nextRow = sheet.getLastRow() + 1;
    var row = [new Date()];
    for (var i = 1; i < headers.length; i++) {
      if (headers[i].length > 0) {
        row.push(data[headers[i]]);
      }
    }
    sheet.getRange(nextRow, 1, 1, row.length).setValues([row]);
  }
  catch(error) {
    Logger.log('error writing row to sheet', e);
  }
  finally {
    return;
  }
}

function doPost(e) {
    Logger.log(e); // the Google Script version of console.log see: Class Logger
    var data = e.parameters; // shorter name for form data
    if ('lat' in data) {
        recordDataInSheet(data, 'locations');
    } else {
        sendEmail(data);
    }
}
