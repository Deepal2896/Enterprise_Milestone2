var SERVER_NAME = 'user-api'
var PORT = 3009;
var HOST = '127.0.0.1';


var errors = require('restify-errors');
var restify = require('restify')

  // Get a persistence engine for the users
  , patientsSave = require('save')('patients')

  // Create the restify server
  , server = restify.createServer({ name: SERVER_NAME})

  server.listen(PORT, HOST, function () {
  console.log('*********************************')
  console.log('Server %s listening at %s', server.name, server.url)
  console.log('*********** Resources: ***********')
  console.log(' /users')
  console.log(' /users/:id')  
  console.log('*********************************')
})

server
  // Allow the use of POST
  .use(restify.plugins.fullResponse())

  // Maps req.body to req.params
  .use(restify.plugins.bodyParser())

// Get all users in the system
server.get('/patients', function (req, res, next) {
	// Find every entity within the given collection
	patientsSave.find({}, function (error, patients) {
		console.log(`Received GET request /patients`);
		// Return all of the patients in the system
		res.send( patients );
		// console.log(`Processed Request Count >>>> Get: ${++getCount}`.bold.blue);
	});
});
// Create a new patient
server.post('/patients', function (req, res, next) {
	// Make sure patient is defined
	if (req.params.name === undefined) {
		// If there are any errors, pass them to next in the correct format
		return next(new restify.InvalidArgumentError('name must be supplied'));
	}
	if (req.params.age === undefined) {
		// If there are any errors, pass them to next in the correct format
		return next(new restify.InvalidArgumentError('age must be supplied'));
	}
	if (req.params.gender === undefined) {
		// If there are any errors, pass them to next in the correct format
		return next(new restify.InvalidArgumentError('gender must be supplied'));
	}
	if (req.params.reason === undefined) {
		// If there are any errors, pass them to next in the correct format
		return next(new restify.InvalidArgumentError('reason must be supplied'));
	}
	if (req.params.condition === undefined) {
		// If there are any errors, pass them to next in the correct format
		return next(new restify.InvalidArgumentError('condition must be supplied'));
	}
	if (req.params.bloodgroup === undefined) {
		// If there are any errors, pass them to next in the correct format
		return next(new restify.InvalidArgumentError('bloodgroup must be supplied'));
	}
	if (req.params.allergy === undefined) {
		// If there are any errors, pass them to next in the correct format
		return next(new restify.InvalidArgumentError('allergy must be supplied'));
	}
	var newPatient = {
		name: req.params.name,
		age: req.params.age,
		gender: req.params.gender,
		reason: req.params.reason,
		condition: req.params.condition,
		bloodgroup: req.params.bloodgroup,
		allergy: req.params.allergy,
	};
	// Create the patient using the persistence engine
	patientsSave.create(newPatient, function (error, patient) {
		// If there are any errors, pass them to next in the correct format
		if (error)
			return next(
				new restify.InvalidArgumentError(JSON.stringify(error.errors))
			);

		// Send the user if no issues
		res.send(201, patient);
		// console.log(
		// 	`Processed Request Count >>>>> Post: ${++postCount}`
		// );
	});
});

  

// Delete user with the given id
server.del('/patients', function (req, res, next) {
	var query = patientsSave.find({}, function (error, patients) {});
	// Find every entity within the given collection
	
	patientsSave.deleteMany(query, function (error) {
		// If there are any errors, pass them to next in the correct format
		if (error)
			return next(
				new restify.InvalidArgumentError(JSON.stringify(error.errors))
			);

		// Send a 200 OK response
		res.send(200, 'Deleted');
		console.log(`patients DELETE: Deleted all patients....`);
	});
});