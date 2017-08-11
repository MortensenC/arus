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

var port = config.port || 3002

var limiter = new RateLimit({
  windowMs: 10*60*1000, // 10 minutes
  max: 3, // limit each IP to 3 requests per windowMs
  delayMs: 0 // disable delaying - full speed until the max limit is reached
});


// function DB() {
//     var connection = mysql.createConnection({
//         user: config.db.username,
//         password: config.db.password,
//         host: config.db.host,
//         port: 3306,
//         database: config.db.database
//     });
//
//     return connection;
// }
//
// function sendEmail(from, to, subject, content, attachmentData) {
//     var helper = sendgrid.mail;
//     var from_email = new helper.Email(from);
//     var to_email = new helper.Email(to);
//     // var to_email = new helper.Email("p5150j@gmail.com");
//     var subject = subject;
//     var content = new helper.Content("text/html", content)
//     var mail = new helper.Mail(from_email, subject, to_email, content);
//
//     if (attachmentData && attachmentData.filename && attachmentData.content) {
//         var attachment = new helper.Attachment();
//         attachment.setContent(Buffer.from(attachmentData.content).toString('base64'));
//         attachment.setType("text/csv");
//         attachment.setFilename(attachmentData.filename);
//         attachment.setDisposition("attachment");
//         mail.addAttachment(attachment);
//     }
//
//     var sg = sendgrid(config.sendgridApiKey);
//     var request = sg.emptyRequest({
//       method: 'POST',
//       path: '/v3/mail/send',
//       body: mail.toJSON()
//     });
//     return new Promise((resolve, reject) => {
//       sg.API(request, function(error, response) {
//         if(response.statusCode == 202) {
//           resolve('{ "result": "success"}');
//         } else {
//           console.log(error)
//           reject('{ "result": "failed"}');
//         }
//       });
//     });
//
// }
//
// function getSubscriptionsCSV() {
//     return new Promise(function(resolve, reject) {
//         DB().query("select * from newsletter_requests order by request_date desc", function(err, rows, fields) {
//             if (err) {
//                 reject(err);
//             }
//             console.log(rows);
//             if(rows && rows.length > 0) {
//                 resolve(json2csv({ data: rows, fields: ['name', 'email', 'request_date'] }));
//             } else {
//                 resolve('');
//             }
//         });
//     })
// }
//
// function getMembersCSV() {
//     return new Promise(function(resolve, reject) {
//         DB().query("select * from member_requests order by request_date desc", function(err, rows, fields) {
//             if (err) {
//                 reject(err);
//             }
//             console.log(rows);
//             if(rows && rows.length > 0) {
//                 resolve(json2csv({ data: rows, fields: ['name', 'phone', 'email', 'request_date'] }));
//             } else {
//                 resolve('');
//             }
//         });
//     })
// }
//
// function getBizPitchApplicationCSV() {
//     return new Promise(function(resolve, reject) {
//         DB().query("select * from biz_pitch_application order by application_date desc", function(err, rows, fields) {
//             if (err) {
//                 reject(err);
//             }
//             console.log(rows);
//             if(rows && rows.length > 0) {
//                 resolve(json2csv({ data: rows, fields: [
//                     'email',
//                     'first_name',
//                     'last_name',
//                     'telephone',
//                     'address',
//                     'company',
//                     'company_address',
//                     'date_business',
//                     'website',
//                     'social_media',
//                     'is_legally_established',
//                     'company_industry',
//                     'product_or_service',
//                     'product_or_service_description',
//                     'how_did_you_hear',
//                     'application_date'
//                 ] }));
//             } else {
//                 resolve('');
//             }
//         });
//     })
// }
//
//
// function addSubscription(name, email) {
//     var data = {
//         name: name,
//         email: email
//     }
//     return new Promise(function(resolve, reject) {
//         DB().query('INSERT INTO newsletter_requests SET ?', data, function(err, result) {
//             if (!err) {
//                 resolve();
//             } else {
//                 console.log(err);
//                 reject({ error: err.errno });
//             }
//         });
//     });
// };
//
// function addApplication(data) {
//     return new Promise(function(resolve, reject) {
//         DB().query('INSERT INTO biz_pitch_application SET ?', data, function(err, result) {
//             if (!err) {
//                 resolve();
//             } else {
//                 console.log(err);
//                 reject({ error: err.errno });
//             }
//         });
//     });
// };
//
// function addMember(name, email, phone) {
//     var data = {
//         name: name,
//         email: email,
//         phone: phone
//     }
//     return new Promise(function(resolve, reject) {
//         DB().query('INSERT INTO member_requests SET ?', data, function(err, result) {
//             if (!err) {
//                 resolve();
//             } else {
//                 console.log(err);
//                 reject({ error: err.errno });
//             }
//         });
//     });
// }

// app.enable('trust proxy'); // only if you're behind a reverse proxy (Heroku, Bluemix, AWS if you use an ELB, custom Nginx setup, etc)
//
// var limiter = new RateLimit({
//   windowMs: 60*60*1000, // 60 minutes
//   max: 3, // limit each IP to 3 requests per windowMs
//   delayMs: 0 // disable delaying - full speed until the max limit is reached
// });
//
// var csvWorkerLimiter = new RateLimit({
//   windowMs: 60*60*1000*12,
//   max: 1,
//   delayMs: 0
// });


app.use(bodyParser.urlencoded({ extended: false }));

// viewed at http://localhost:8080
app.get('/', function(req, res) {
    res.sendFile(path.join(__dirname + '/index.html'));
});

app.get('/process', function(req, res) {
    res.sendFile(path.join(__dirname + '/process.html'));
});

app.get('/mobile-apps', function(req, res) {
    res.sendFile(path.join(__dirname + '/mobile.html'));
});

app.get('/web-apps', function(req, res) {
    res.sendFile(path.join(__dirname + '/webapp.html'));
});


app.get('/consultancy', function(req, res) {
    res.sendFile(path.join(__dirname + '/consultancy.html'));
});

app.get('/contact-us', function(req, res) {
    res.sendFile(path.join(__dirname + '/contact.html'));
});

app.get('/blog', function(req, res) {
    res.sendFile(path.join(__dirname + '/blog.html'));
});


app.get('/education-article', function(req, res) {
    res.sendFile(path.join(__dirname + '/education-article.html'));
});


app.post('/api/contactus', function(req, res) {

	var client = sendgrid(config.sendgridApiKey);
	var helper = sendgrid.mail;

	var mail = new helper.Mail(
        new helper.Email("info@ahoybvi.com"),
        "Contact form from Ahoy",
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

// app.get('/BizPitchForm', function(req, res) {
//     res.sendFile(path.join(__dirname + '/form.html'));
// });
//
// if (config.enableRateLimit) {
//    app.use('/api/', limiter);
//    app.use('/worker/', csvWorkerLimiter);
// };
// app.get('/api/join', function(req, res) {
//     try {
//         var text = "Someone from our team will get back to you within the next 24-48 hours. If you need to reach someone urgently, please call 284-494-5707   Notice of Confidentiality: This message and any attachments may contain information that is privileged, confidential, or exempt from disclosure under applicable law. If you have received this message in error, please send a reply message immediately and delete the message and any attachments without opening the attachment. Any further dissemination of this communication is strictly prohibited. Thank you.";
//         addMember(req.query.name, req.query.email, req.query.phone)
//             .then(()=> {
//               fs.readFile('email.html', 'utf8', function (err,data) {
//                 if (err) {
//                   res.status(500).send();
//                 } else {
//                   sendEmail(config.infoEmail, req.query.email, "Thank you for your interest in the Forge.",
//                     data.replace("${TITLE}", "Thank you for your interest in the Forge.").replace("${TEXT}", text))
//                     .then((response)=> {
//                       res.status(200).send(response);
//                     })
//                     .catch((error)=> {
//                       res.status(400).send(error);
//                     });
//                 }
//               });
//             })
//             .catch((error)=> {
//               res.status(400).send(error);
//             });
//
//     } catch(err) {
//         console.log(err);
//         res.status(400).send('{ "result": "failed" }');
//     }
// });

// app.get('/api/subscribe', function(req, res) {
//     try {
//         var text = "We will be sending out newsletters and updates periodically until our opening Summer of 2017. If you are interested in becoming a member of the Forge, please email info@forgebvi.com with more information.";
//         addSubscription(req.query.name, req.query.email)
//             .then(()=> {
//               fs.readFile('email.html', 'utf8', function (err,data) {
//                 if (err) {
//                   res.status(500).send();
//                 } else {
//                   sendEmail(config.infoEmail, req.query.email, "Thank you for your interest in the Forge.",
//                     data.replace("${TITLE}", "Thank you for your interest in the Forge.").replace("${TEXT}", text))
//                     .then((response)=> {
//                       res.status(200).send(response);
//                     })
//                     .catch((error)=> {
//                       res.status(400).send(error);
//                     });
//                 }
//               });
//             })
//             .catch((error)=> {
//               res.status(400).send(error);
//             });
//
//     } catch(err) {
//         console.log(err);
//         res.status(400).send('{ "result": "failed" }');
//     }
//
// });

// app.get('/api/application', function(req, res) {
//     try {
//         var applicationParams = {
//             first_name: req.query.fname,
//             last_name: req.query.fname,
//             email: req.query.email,
//             address: req.query.address,
//             company: req.query.company,
//             telephone: req.query.telephone,
//             company_address: req.query.companyaddress,
//             date_business: req.query.datebusiness,
//             website: req.query.website,
//             social_media: req.query.socialmedia,
//             is_legally_established: req.query.companylegal,
//             company_industry: req.query.companyfield == "Other" ? req.query.companyfieldother : req.query.companyfield,
//             product_or_service: req.query.productservice,
//             product_or_service_description: req.query.productservicedesc,
//             founder_description: req.query.founderinventor,
//             how_did_you_hear: req.query.howhear
//         }
//
//         var text = "Thank you for your application, we will be reviewing all of the applications at the beginning of April.  If you have any questions or concerns in the meantime, don't hesitate to reach out to info@forgebvi.com. Thank you!";
//         addApplication(applicationParams)
//             .then(()=> {
//               fs.readFile('email.html', 'utf8', function (err,data) {
//                 if (err) {
//                   res.status(500).send();
//                 } else {
//                   sendEmail(config.infoEmail, req.query.email, "Thank you for your interest in the Forge.",
//                     data.replace("${TITLE}", "Thank you for your interest in the Forge.").replace("${TEXT}", text))
//                     .then((response)=> {
//                       res.status(200).send(response);
//                     })
//                     .catch((error)=> {
//                       res.status(400).send(error);
//                     });
//                 }
//               });
//             })
//             .catch((error)=> {
//               res.status(400).send(error);
//             });
//
//     } catch(err) {
//         console.log(err);
//         res.status(400).send('{ "result": "failed" }');
//     }
//
// });

// app.post('/worker/csv', function(req, res) {
//     console.log("WORKER EXECUTED");
//     console.log("INFO EMAIL: " + config.infoEmail);
//     console.log("SECONDARY EMAIL: " + config.secondaryEmail);
//     getSubscriptionsCSV().then((csv)=> {
//         return sendEmail(config.infoEmail, config.infoEmail, "Newsletter Requests", "The attachment contains all newsletter requests.", {
//             filename: 'newsletter_requests.csv',
//             content: csv
//         }).then(()=> {
//             if (config.secondaryEmail) {
//                 return sendEmail(config.infoEmail, config.secondaryEmail, "Newsletter Requests", "The attachment contains all newsletter requests.", {
//                     filename: 'newsletter_requests.csv',
//                     content: csv
//                 });
//             }
//         });
//     })
//     .then(()=> getMembersCSV())
//     .then((csv)=> {
//         return sendEmail(config.infoEmail, config.infoEmail, "Membership Requests", "The attachment contains all membership requests.", {
//             filename: 'membership_requests.csv',
//             content: csv
//         }).then(()=> {
//             if (config.secondaryEmail) {
//                 return sendEmail(config.infoEmail, config.secondaryEmail, "Membership Requests", "The attachment contains all membership requests.", {
//                     filename: 'membership_requests.csv',
//                     content: csv
//                 });
//             }
//         });
//     })
//     .then(()=> getBizPitchApplicationCSV())
//     .then((csv)=> {
//         return sendEmail(config.infoEmail, config.infoEmail, "BizPitch Applications", "The attachment contains all applications.", {
//             filename: 'bizpitch_applications.csv',
//             content: csv
//         }).then(()=> {
//             if (config.secondaryEmail) {
//                 return sendEmail(config.infoEmail, config.secondaryEmail, "BizPitch Applications", "The attachment contains all applications.", {
//                     filename: 'bizpitch_applications.csv',
//                     content: csv
//                 });
//             }
//         });
//     })
//     .then(()=> res.status(200).send())
//     .catch((err) => {
//         console.log(err);
//         res.status(500).send();
//     });
// });

app.use('/js', express.static('js'))
app.use('/css', express.static('css'))
app.use('/fonts', express.static('fonts'))
app.use('/img', express.static('img'))


app.listen(port, function() {
	console.log("Listening on port " + port)
});


