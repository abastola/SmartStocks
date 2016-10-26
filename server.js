// load the things we need
var companyname="Smart Stocks"
var express = require('express');
var app = express();
var bodyParser=require("body-parser");
var globalArrayOfContacts=[];
var fs=require('fs');
var watson = require('watson-developer-cloud');
var url = require('url');



//Here we are configuring express to use body-parser as middle-ware.
app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());

// set the view engine to ejs
app.set('view engine', 'ejs');

// use res.render to load up an ejs view file

// index page
app.get('/', function(req, res) {
  console.log("Reached the Index Page");
  res.render('pages/index', {title: 'Home: '+companyname,
  brand: companyname});
});

//get request
app.get('/articles', function(req, res) {
  console.log("Reached News Page");
  res.render('pages/contact', {title: 'Articles: '+companyname, brand: companyname, allData: globalArrayOfContacts, stockname: stockfullname});
});

// IBM Data Ilusstration
app.get('/ibmdata', function(req, res) {
  console.log("Reached IBM Data Page");
  res.render('pages/ibmdata', {title: 'IBM BlueMix Data: '+companyname, brand: companyname, ibm_reaction: ibm_reaction, ibm_score:ibm_score, stockname: stockfullname, stock_logo: stock_logo});
});
app.get('/finalresult', function(req, res) {
  console.log("Reached Final Data Page");
  res.render('pages/finalresult', {title: 'Final Results: '+companyname, pictures: stock_real_picture, brand: companyname, ibm_reaction: ibm_reaction, ibm_score:ibm_score, stockname: stockfullname, stock_logo: stock_logo});
});

// IBM Data Ilusstration
app.get('/textme', function(req, res) {
  phonenumber=req.query.number;
  SendTheText();
  console.log("Reached the Textme page");
  res.render('pages/finalresult', {title: 'Final Results: '+companyname, pictures: stock_real_picture, brand: companyname, ibm_reaction: ibm_reaction, ibm_score:ibm_score, stockname: stockfullname, stock_logo: stock_logo});
});

//site is accessible at localhost:8080
app.listen(8080);
console.log('8080 is the magic port');

var stockfilename=['microsoft', 'costco', 'walmart', 'samsung', 'fargo', 'aig', 'atandt', 'chase'];
var stockfullname=['Microsoft', 'COSTCO', 'Walmart', 'Samsung', 'Wells Fargo', 'AIG', 'AT&T', 'JP Morgan'];
var ibm_reaction=['positive', 'positive', 'negative', 'positive', 'negative', 'negative', 'negative', 'negative'];
var prediction_final=['+2.60%', '+0.73%', '-1.35%', '0.00%', '-9.00%', '-1.40%', '-1.96%', '+1.80%']
var stock_logo=[ 'https://cdn2.iconfinder.com/data/icons/metro-ui-icon-set/512/Microsoft_New_Logo.png', 'http://gmkfreelogos.com/logos/C/img/Costco_Wholesale.gif', 'http://www.danielrrosen.com/wp-content/uploads/2014/09/walmart-logo-e1412100386818.png', 'http://www.samsung.com/common/img/logo-square-letter.png', 'https://www.willowglen.org/images/8125-500x500/wellsfargo.jpg', ' http://www.advisenltd.com/wp-content/uploads/2016/02/AIG-logo.png', 'http://mesaindependent.com/wp-content/uploads/2016/02/AZ-EV-AT-and-T-sq-logo.jpg', 'http://hyperallergic.com/wp-content/uploads/2016/02/Chase.jpg'];
var ibm_score=[0.3613, 0.0479, -0.2444, 0.250256, -0.5112, -0.2097, -0.667, -0.4100 ];
var stock_real_picture=['http://www.ramapoicehockey.com/wp-content/uploads/2016/10/microsoft.png', 'http://www.ramapoicehockey.com/wp-content/uploads/2016/10/COSTCo.png', 'http://www.ramapoicehockey.com/wp-content/uploads/2016/10/walmart.png', 'http://www.ramapoicehockey.com/wp-content/uploads/2016/10/Samsung.png', 'http://www.ramapoicehockey.com/wp-content/uploads/2016/10/Wells-Fargo.png', 'http://www.ramapoicehockey.com/wp-content/uploads/2016/10/AIG.png', 'http://www.ramapoicehockey.com/wp-content/uploads/2016/10/att.png', 'http://www.ramapoicehockey.com/wp-content/uploads/2016/10/JPM.png'];

for (var filenumber=0; filenumber<8; filenumber++){
  var fullNews = fs.readFileSync("./fullnews/"+stockfilename[filenumber]+".txt");
  globalArrayOfContacts[filenumber]=fullNews.toString();
}

//PrintDataFromIBMJSON();

function PrintDataFromIBMJSON(){
  var data = fs.readFileSync("./chase.json");
  var dataJSON=JSON.parse(data.toString());
  console.log("Company: "+ dataJSON['entities'][0]['disambiguated']['name']);
  console.log("Marget Reaction: "+ dataJSON['entities'][0]['sentiment']['type']);
  console.log("Score: "+ dataJSON['entities'][0]['sentiment']['score']);
  //console.log(dataJSON);
  //console.log(dataJSON.response);

}

var sms_message_body='';
for (var filenumber=0; filenumber<8; filenumber++){
  sms_message_body=sms_message_body+ stockfullname[filenumber]+": "+prediction_final[filenumber]+"\n";

}


var twilio = require('twilio');

// Create a new REST API client to make authenticated requests against the
// twilio back end
var client = new twilio.RestClient('key', 'sid');

//Phone Number for Twilio
var phonenumber='';
var yourname='';


// Pass in parameters to the REST API using an object literal notation. The
// REST client will handle authentication and response serialzation for you.
function SendTheText(){

  client.sms.messages.create({
    to:phonenumber,
    from:'+17329177489',
    body: 'Morning! Your Stock Updates:\n'+sms_message_body
  }, function(error, message) {
    // The HTTP request to Twilio will run asynchronously. This callback
    // function will be called when a response is received from Twilio
    // The "error" variable will contain error information, if any.
    // If the request was successful, this value will be "falsy"
    if (!error) {
      // The second argument to the callback will contain the information
      // sent back by Twilio for the request. In this case, it is the
      // information about the text messsage you just sent:
      console.log('Success! The SID for this SMS message is:');
      console.log(message.sid);

      console.log('Message sent on:');
      console.log(message.dateCreated);
    } else {
      console.log('Oops! There was an error.');
    }
  });
}

/*
//IBM alchemy API calls
var alchemy_language = watson.alchemy_language({
apikey: 'api key'
});

for (var apicallnumber=0; apicallnumber<8; apicallnumber++){

var parameters = {
extract: 'entities, keywords',
sentiment: 1,
maxRetrieve: 1,
text: globalArrayOfContacts[apicallnumber],
filename_IBM:stockfilename[apicallnumber]+'.json'
};

alchemy_language.combined(parameters, function (err, response) {
console.log("Result is here");
if (err){
console.log('error:', err);
}
else{
console.log(JSON.stringify(response, null, 2));
var dataJSON=JSON.parse(JSON.stringify(response, null, 2));
var market_reaction=dataJSON['entities'][0]['sentiment']['type'];
var market_score=dataJSON['entities'][0]['sentiment']['score'];

console.log("Marget Reaction: "+ market_reaction);
console.log("Score: "+ market_score);
console.log();console.log();console.log();console.log();
//console.log(dataJSON);
}

});
}
*/




//--------------------------New York TImes Article Enginer-----------------------------



function getOutputFile(NewsDay){
  var request=require('request');
  console.log("---------- Value of Offset: "+NewsDay+ " -------------");
  request.get({
    url: "https://api.nytimes.com/svc/search/v2/articlesearch.json",
    qs: {
      'api-key': "api-key",
      'q': "Samsung",
      'page': NewsDay


    },
  }, function(err, response, body) {
    body = JSON.stringify(body)
    console.log(body+"\n \n \n \n \n");
    var filename="./rawnews/samsung"+NewsDay+".json";
    fs.writeFile(filename, body, function(err){
      if(err) {
        return console.log(err);
      }

      console.log(filename+": created!");

    });

  });


}
//var offset_nyt=0;var timerID = setInterval(function(){getOutputFile(offset_nyt++)}, 5050);

//attach all the news to a single string file
function makeFullNewsFile(){
  var FullNews="";
  for (var abc=0; abc <10; abc++){
    //read articles
    var data = fs.readFileSync("./rawnews/samsung"+abc+".json");
    var dataJSON=JSON.parse(data.toString());
    dataJSON=JSON.parse(dataJSON);
    //console.log(dataJSON);
    //console.log(dataJSON.response);
    FullNews+=dataJSON['response']['docs'][0]['lead_paragraph'];
    FullNews+=dataJSON['response']['docs'][1]['lead_paragraph'];
    FullNews+=dataJSON['response']['docs'][2]['lead_paragraph'];
    FullNews+=dataJSON['response']['docs'][3]['lead_paragraph'];
    FullNews+=dataJSON['response']['docs'][4]['lead_paragraph'];
    FullNews+=dataJSON['response']['docs'][5]['lead_paragraph'];
    FullNews+=dataJSON['response']['docs'][6]['lead_paragraph'];
    FullNews+=dataJSON['response']['docs'][7]['lead_paragraph'];
    FullNews+=dataJSON['response']['docs'][8]['lead_paragraph'];
    FullNews+=dataJSON['response']['docs'][9]['lead_paragraph'];

    /*
    console.log(dataJSON['response']['docs'][0]['lead_paragraph']);
    console.log(dataJSON['response']['docs'][2]['lead_paragraph']);
    console.log(dataJSON['response']['docs'][3]['lead_paragraph']);
    console.log(dataJSON['response']['docs'][4]['lead_paragraph']);
    console.log(dataJSON['response']['docs'][5]['lead_paragraph']);
    console.log(dataJSON['response']['docs'][6]['lead_paragraph']);
    console.log(dataJSON['response']['docs'][7]['lead_paragraph']);
    console.log(dataJSON['response']['docs'][8]['lead_paragraph']);
    console.log(dataJSON['response']['docs'][9]['lead_paragraph']);
    */
  }
  console.log(FullNews);

  var filename="./fullnews/samsung.txt";
  fs.writeFile(filename, FullNews, function(err){
    if(err) {
      return console.log(err);
    }

    console.log(filename+": created!");

  });

}
