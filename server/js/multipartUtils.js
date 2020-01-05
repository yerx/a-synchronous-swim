var parser = require('parse-multipart');

module.exports.getBoundary = function(buffer) {
  var finder = /--(----\w+)\b/;
  // example:     var boundary = "----WebKitFormBoundaryDtbT5UpPj83kllfw";
  var boundary = buffer.toString().match(finder);
  return boundary ? boundary[1] : null;
};

module.exports.parse = function(buffer) {
  var boundary = module.exports.getBoundary(buffer);
  return parser.Parse(buffer, boundary);
  // buffer is the body - the multipart raw body
};

module.exports.getFile = function(buffer) {
  var parts = module.exports.parse(buffer);
  for (var part of parts) {
    // return first part with filename and data keys
    if (part.filename && part.data) {
      return part;
    }
  }
  // the returned data is an array of parts, each one described by a file name and data - the data is the buffer
  return null;
};


// how parse-multipart works
/*
https://www.npmjs.com/package/parse-multipart
Two parts
1. boundary - normally comes as headers
boundary, the string which serve as a 'separator' between parts, it normally comes to you via headers. In this case, the boundary is:
2. body - contains content-type, form-data, name, filename


The lines above represents a raw multipart/form-data payload sent by some HTTP client via form submission containing two files. We need to extract the all files contained inside it. The multipart format allows you to send more than one file in the same payload, that's why it is called: multipart.

*/

