var express = require('express');
var app = express();
var path = require('path');
var bodyParser = require('body-parser');
var RateLimit = require('express-rate-limit');
var fs = require('fs');
var config = require('./config');
var sendgrid = require('sendgrid');
// var mysql = require('mysql');
// var json2csv = require('json2csv');

var twilioService = require('./app/twilio.service');

var port = config.port || 3002

var limiter = new RateLimit({
  windowMs: 60*60*1000, // 60 minutes
  max: 4, // limit each IP to 4 requests per windowMs
  delayMs: 0 // disable delaying - full speed until the max limit is reached
});


app.use(bodyParser.urlencoded({ extended: false }));

// viewed at http://localhost:8080
app.get('/', function(req, res) {
    res.sendFile(path.join(__dirname + '/index.html'));
});

app.get('/Custom-software', function(req, res) {
    res.sendFile(path.join(__dirname + '/custom-software.html'));
});

app.get('/Blockchain', function(req, res) {
    res.sendFile(path.join(__dirname + '/blockchain.html'));
});

app.get('/Devops', function(req, res) {
    res.sendFile(path.join(__dirname + '/devops.html'));
});


app.get('/Agile', function(req, res) {
    res.sendFile(path.join(__dirname + '/agile.html'));
});

app.get('/contact-us', function(req, res) {
    res.sendFile(path.join(__dirname + '/contact.html'));
});

app.get('/sitemap', function(req, res) {
    res.sendFile(path.join(__dirname + '/sitemap.xml'));
});


// app.get('/community-promotion', function(req, res) {
//     res.sendFile(path.join(__dirname + '/community-promotion.html'));
// });



app.post('/api/contactus', function(req, res) {

	var client = sendgrid(config.sendgridApiKey);
	var helper = sendgrid.mail;

	var mail = new helper.Mail(
        new helper.Email("patrick.ortell@arus.io"),
        "Contact form from Arus",
        new helper.Email(config.adminEmail || "patrick.ortell@arus.io"),
        new helper.Content("text/html", "<p>Name: " + req.body.name + "</p><p>Email: " + req.body.email + "</p><p>Telephone: " + req.body.telephone + "</p><p>Message: " + req.body.message + "</p>")
    );

    const request = client.emptyRequest({
        method: 'POST',
        path: '/v3/mail/send',
        body: mail.toJSON()
    });

    return new Promise((resolve, reject) => {
        client.API(request, function (error, response) {
            if (response.statusCode == 202) {
                resolve({ success: true });
            } else {
            	reject();
                console.log(error.response.body.errors);
            }
        });
    }).then(() => {
    	res.status(200).send("1");
    }).catch((e) => {
    	console.log(e);
    	res.status(400).send("There was an error");
    });
})

if (config.enableRateLimit) {
    app.use('/api/communitypromotion', limiter);
}
app.post('/api/communitypromotion', function(req, res) {

    var client = sendgrid(config.sendgridApiKey);
    var helper = sendgrid.mail;

    var mail = new helper.Mail(
        new helper.Email("patrick.ortell@arus.io"),
        "Community promotion form from Arus",
        new helper.Email(config.adminEmail || "patrick.ortell@arus.io"),
        new helper.Content("text/html", `
            <p>Name: ${req.body.name}</p>
            <p>Email: ${req.body.email}</p>
            <p>Telephone: ${req.body.telephone}</p>
            <p>Idea: ${req.body.idea}</p>`)
    );

    const request = client.emptyRequest({
        method: 'POST',
        path: '/v3/mail/send',
        body: mail.toJSON()
    });

    return new Promise((resolve, reject) => {
        client.API(request, function (error, response) {
            if (response.statusCode == 202) {
                resolve({ success: true });
            } else {
                reject();
                console.log(error.response.body.errors);
            }
        });
    }).then(() => {
        res.status(200).send("1");
        try {
            var phone = req.body.telephone;
            phone = phone.startsWith('+1') ? phone.slice(2) : phone;
            if (phone.match(/\D/g) || phone.length !== 10) {
                throw new Error('invalid phone');
            }
            twilioService.sendTextWithGif('+1' + phone, "Thank you "+req.body.name+"! Don't forget to like our Facebook page! https://www.facebook.com/ahoybvi/", "fuckyeah");
        } catch(e) {
            console.log("MESSAGING ERROR", e);
        }
    }).catch((e) => {
        console.log(e);
        res.status(400).send("There was an error");
    });
})

app.use('/js', express.static('js'))
app.use('/css', express.static('css'))
app.use('/fonts', express.static('fonts'))
app.use('/img', express.static('img'))


app.listen(port, function() {
	console.log("Listening on port " + port)
});
