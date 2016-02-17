require("./environment.js");
var twilio = require('twilio');
var request = require('request');

exports.handler = function (event, context) {
  var twilio_account_sid = process.env.TWILIO_ACCOUNT_SID;
  var twilio_auth_token  = process.env.TWILIO_AUTH_TOKEN;
  var my_phone_number    = event.from;
  var result = "";
  var client             = new twilio.RestClient(twilio_account_sid, twilio_auth_token);
  var xml                = '<?xml version="1.0" encoding="UTF-8"?><Response></Response>';


var options = {
  "conditions": {
      "ticker": event.body
  },
  "select": ["short_name", "price", "fifty_two_week_high", "fifty_two_week_low", "rating", "ric"]
}



request({
    url: "https://dozlacmd51.execute-api.us-east-1.amazonaws.com/v1/search/filter", 
    json: options,
    method: 'PUT'
}, function(error, response, body){

    if(error) {
        console.log(error);

    } else {
        console.log(response.statusCode, body);
        if (body[0]){
          var short_name = body[0].short_name;
          var fifty_two_week_high = body[0].fifty_two_week_high;
          var fifty_two_week_low = body[0].fifty_two_week_low;
          var rating = body[0].rating;
          var price = body[0].price;
          var ric = body[0].ric;
          result = short_name + " latest share price is $" + price + " ($"+ fifty_two_week_high + "/$" + fifty_two_week_low + ")" + ". See more at: https://stockflare.com/stocks/" + ric;
          console.log(result);
        } else {
          result = "We couldn't find what you're looking for. You can search by any ticker symbol Why not try AAPL or NFLX."
        }
    }
});


};
