var express = require('express');
var app = express();//Respond with "Hi from Abhay" for requests that hit our root "/"
app.get('/', function (req, res) {
 res.send('Changes are not made yet');
});
app.listen(process.env.PORT || 3000);
module.exports = app;
