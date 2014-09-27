var express = require('express'),
	app = express(),
	port = parseInt(process.env.PORT, 10) || 4567;

var mongoose = require('mongoose');
mongoose.connect('mongodb://localhost/cmpa_db');



// Login authentication
var passport = require('passport');
var LocalStrategy = require('passport-local').Strategy;

passport.use(new LocalStrategy (
	function (username, password, done) {
		User.findOne({ username: username}, function (err, user) {
			if (err)
				return done(err);
			if (!user)
				return done(null, false, {message: 'Incorrect username.'});
			if (!user.validPassword(password))
				return done(null, false, {message: 'Incorrect password.'});

			return done(null, user);
		});
	}
));






// Adding module for mailing service
var nodemailer = require('nodemailer');
// Transport object using SMTP tranport
var transporter = nodemailer.createTransport({
	service: 'Gmail',
	auth: {
		user: 'info.nodemailer@gmail.com',
		pass: 'nodemailer'
	}
});

var toEmail;









var db = mongoose.connection;
var Schema = mongoose.Schema;


var bookingSchema = new Schema({
	name: String,
	contactNumber: Number,
	email: String,
	date: String,
	meetingName: String,
	numberOfAttendees: Number,
	prepStartTime: Number,
	startTime: Number,
	endTime: Number,
	roomRequested: String,
	bookingid: Number
}, {collection: 'bookings'});

var Book = mongoose.model('Book', bookingSchema);
var daysOfMonth = {'jan':31,'feb':28,'mar':31,'apr':30,'may':31,'jun':30,'jul':31,'aug':31,'sep':30,'oct':31,'nov':30,'dec':31};

app.configure(function(){
	app.use(express.methodOverride());
	app.use(express.bodyParser());
	app.use(express.static(__dirname + '/public'));
	app.use(express.errorHandler({
		dumpExceptions: true,
		showStack: true
	}));
	app.use(app.router);

	db.on('error', console.error.bind(console, 'connection error:'));
	db.once('open', function callback() {
		console.log('Connected to mongo database: ' + db);
	});

	Book.find({},function(err,data){
		data.forEach(function(book){
			console.log(book.name);
		});
	});


});

var bookingID = 0;
Book.find({}).sort('-bookingid').exec(function(err, data){
	bookingID = data[0]?data[0].bookingid:0;
	console.log(data + ' Booking ID: ' + bookingID);
});
console.log("This is the booking id number: " + bookingID);



function sendMail (toEmail) {

	var mailOptions = {
		from: 'No-Reply Mailer <info.nodemailer@gmail.com>', 	// sender address
		to: 'testnode@mailinator.com, ' + toEmail,				// list of receivers
		subject: 'Hello Test',									// subject line
		//text: 'This is the text that should be appearing...',	// plain text body
		html: '<!DOCTYPE html PUBLIC "-//W3C//DTD XHTML 1.0 Transitional//EN" "http://www.w3.org/TR/xhtml1/DTD/xhtml1-transitional.dtd"><html xmlns="http://www.w3.org/1999/xhtml"><head><meta http-equiv="Content-Type" content="text/html; charset=UTF-8" /><title>Room Booker</title><meta name="viewport" content="width=device-width, initial-scale=1.0"/></head><body><table border="0" cellpadding="0" cellspacing="0" width="100%"><tr><td style="padding: 0 0 30px 0;"><!-- Table1 --><table align="center" border="0" cellpadding="0" cellspacing="0" width="600" style="border: 1px solid #cccccc; border-collapse: collapse;"><tr><td align="center" bgcolor="#70bbd9" style="padding: 40px 0 30px 0; color: #153643; font-size: 28px; font-weight: bold; font-family: Arial, sans-serif;"><img src="http://www.nightjar.com.au/tests/magic/images/h1.gif" alt="Creating Email Magic" width="300" height="230" style="display: block;" /></td></tr><tr><td bgcolor="#ffffff" style="padding: 40px 30px 40px 30px;"><table border="0" cellpadding="0" cellspacing="0" width="100%"><tr><td style="color: #153643; font-family: Arial, sans-serif; font-size: 24px;"><b>Welcome to Room Booking Services App!</b></td></tr><tr><td style="padding: 20px 0 30px 0; color: #153643; font-family: Arial, sans-serif; font-size: 16px; line-height: 20px;">We are very glad you have chosen us to help you with all your room booking and scheduling needs. We hope that our software services can help increase productivity in your workplace.</td></tr><tr><td><table border="0" cellpadding="0" cellspacing="0" width="100%"><tr><td width="260"><table border="0" cellpadding="0" cellspacing="0" width="100%"><tr><td><img src="http://www.nightjar.com.au/tests/magic/images/left.gif" alt="" width="100%" height="140" style="display: block;" /></td></tr><tr><td style="padding: 25px 0 0 0; color: #153643; font-family: Arial, sans-serif; font-size: 16px; line-height: 20px;">Our app is mobile friendly so you can view and book rooms on your tablet and mobile phones! We support a wide range of resolutions to ensure it is user friendly across all platforms and devices.</td></tr></table></td><td style="font-size: 0; line-height: 0;" width="20">&nbsp;</td><td width="260"><table border="0" cellpadding="0" cellspacing="0" width="100%"><tr><td><img src="http://www.nightjar.com.au/tests/magic/images/right.gif" alt="" width="100%" height="140" style="display: block;" /></td></tr><tr><td style="padding: 25px 0 0 0; color: #153643; font-family: Arial, sans-serif; font-size: 16px; line-height: 20px;">Our algorithms are super smart! We make sure there are no conflicts upon making request for reservations of rooms. There is no need for an administrator (although that is an option) to monitor the requests and bookings.</td></tr></table></td></tr></table></td></tr></table></td></tr><tr><td bgcolor="#ee4c50" style="padding: 30px 30px 30px 30px;"><table border="0" cellpadding="0" cellspacing="0" width="100%"><tr><td style="color: #ffffff; font-family: Arial, sans-serif; font-size: 14px;" width="75%">&reg; Room Booker Inc. 2014<br/><a href="#" style="color: #ffffff;"><font color="#ffffff">Unsubscribe</font></a> to this newsletter instantly</td><td align="right" width="25%"><table border="0" cellpadding="0" cellspacing="0"><tr><td style="font-family: Arial, sans-serif; font-size: 12px; font-weight: bold;"><a href="http://www.twitter.com/" style="color: #ffffff;"><img src="http://www.nightjar.com.au/tests/magic/images/tw.gif" alt="Twitter" width="38" height="38" style="display: block;" border="0" /></a></td><td style="font-size: 0; line-height: 0;" width="20">&nbsp;</td><td style="font-family: Arial, sans-serif; font-size: 12px; font-weight: bold;"><a href="http://www.twitter.com/" style="color: #ffffff;"><img src="http://www.nightjar.com.au/tests/magic/images/fb.gif" alt="Facebook" width="38" height="38" style="display: block;" border="0" /></a></td></tr></table></td></tr></table></td></tr></table><!-- Table1 --></td></tr></table></body></html>'		// html body
	}

	console.log(mailOptions);
	transporter.sendMail(mailOptions, function(error, info) {
		if (error) {
			console.log(error);
		} else {
			console.log('Message sent: ' + info.response);
		}
	});
}

//sendMail();

function checkTime (book, callback){
	//console.log('Booking request: ' + book);

	// Search to see if request has conflict with same room and same date picked as existing bookings
	Book.find({'date': book.date, 'roomRequested': book.roomRequested}, function(err, bookings) {
		console.log('Booking Data: ' + bookings);

		var flag = true;
		if (bookings) {
			console.log('Here!');


			// If same room and same date for booking, check start and ened times
			bookings.forEach(function (booking) {
				//console.log('Requested start time: ' + book.startTime + ' Requested end time: ' + book.endTime);

				if ((booking.startTime < book.startTime) && (book.startTime < booking.endTime)) {
					console.log('Conflict! Cannot book room: requested start time in between duration of another booking.');
					flag = false;
					return;
				} else if ((booking.startTime < book.endTime) && (book.endTime < booking.endTime)) {
					console.log('Conflict! Cannot book room: requested end time in between duration of another booking.');
					flag = false;
					return;
				} else if ((booking.startTime == book.startTime) && (booking.endTime == book.endTime)) {
					console.log('Conflict! Cannot book room: requested time is exactly at the same time as another booking.');
					flag = false;
					return;
				} else if (booking.startTime == book.startTime) {
					console.log('Conflict! Cannot book room: requested start time is at the same time of another booking.');
					flag = false;
					return;
				} else if (booking.endTime == book.endTime) {
					console.log('Conflict! Cannot book room: requested end time is at the same time of another booking.');
					flag = false;
					return;
				} else if ((booking.startTime > book.startTime) && (booking.endTime < book.endTime)) {
					console.log('Conflict! Cannot book room: requested time overlaps with another booking.');
					flag = false;
					return;
				}

			});
		}

		if (flag)
			callback();
	});
}

app.get('/', function(req, res){
	res.redirect('/index.html');
});

app.get('/api', function (req, res) {
	res.send('Booking API is running');
});

app.get('/api/booking', function(req, res) {
	// Book.find(function(err, data) {
	// 	if (!err) {
	// 		return res.send(data);
	// 	} else {
	// 		return console.log(err);
	// 	}
	// });

	Book.find({}).sort('-date').exec(function(err, data){
		if (!err) {
			return res.send(data);
		} else {
			return console.log(err);
		}
	});
});

app.delete('/api/booking', function (req, res){
	console.log(req.body.bookingid + typeof(req.body.bookingid));
	return Book.remove({bookingid:parseInt(req.body.bookingid)}, function (err) {
		if (!err) {
			console.log("Deleted");
			Book.find({},function(err,data){
				data.forEach(function(moreData){
					console.log(moreData.name);
				});
			});
			return res.send('Done');
		} else {
			console.log(err);
      	}
   });
});

app.post('/api/booking', function(req, res) {
	console.log('POST: ');
	console.log(req.body);
	var book = new Book ({
		name: req.body.name,
		contactNumber: req.body.contactNumber,
		email: req.body.email,
		date: req.body.date,
		meetingName: req.body.meetingName,
		numberOfAttendees: req.body.numberOfAttendees,
		prepStartTime: req.body.prepStartTime,
		startTime: req.body.startTime,
		endTime: req.body.endTime,
		roomRequested: req.body.roomRequested,
		bookingid: ++bookingID
	});

	//console.log('Booking Date: ' + book.date + ' Room Requested: ' + book.roomRequested);
	checkTime(book,function(){
		console.log('Time slot is available.');
		book.save(function(err) {
			if (!err) {
				return console.log('Booking created.');
			} else {
				return console.log(err);
			}
		});
	});

	toEmail = book.email;
	console.log(toEmail + ' ' + book.email);
	sendMail(toEmail);

	return res.send(book);
});

app.put('/api/booking', function(req, res) {

	req.body.forEach(function(data) {
		console.log(data);
		console.log(data.bookingid + typeof(data.bookingid));
		return Book.find({bookingid:parseInt(data.bookingid)}, function (err, moreData) {
			console.log(moreData[0].roomRequested +' ' + data.roomRequested);

			moreData[0].name = data.name,
			moreData[0].contactNumber = data.contactNumber,
			moreData[0].email = data.email,
			moreData[0].date = data.date,
			moreData[0].meetingName = data.meetingName,
			moreData[0].numberOfAttendees = data.numberOfAttendees,
			moreData[0].prepStartTime = data.prepStartTime,
			moreData[0].startTime = data.startTime,
			moreData[0].endTime = data.endTime,
			moreData[0].roomRequested = data.roomRequested,
			moreData[0].save(function(err) {
				if (!err) {
       				console.log("updated");
       				return res.send(moreData[0]);
   				} else {
       				console.log(err);
       				return res.send(err);
   				}
			});

		});
	});

});



app.listen(port);