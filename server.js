(function(){

	'use strict';
	var fs = require('fs');
	var path = require('path');
	var bodyParser = require('body-parser');
	var express = require('express');
	var app = express();
	var nedb = require('nedb'), database = new nedb({filename : 'pvr.db', autoload : true});
	app.use(express.static(path.join(__dirname,'public')));
	app.use(bodyParser.json());
	app.use(bodyParser.urlencoded({extended : true}));

	app.get('/getLanguages', function(req, res){

		fs.readFile('./pvr.json', 'utf8', function(err, data){
			if(err) throw err;
			res.send(data);
		});
	});

	app.get('/getMovies', function(req, res){
		var moviesId = [];
		var obj;
		var moviesObj = {};
		moviesObj['movies'] = [];
		fs.readFile('./pvr_languages.json', 'utf8', function(err, data){
			if(err) throw err;
			obj = JSON.parse(data);
			for(var i = 0; i < obj[req.query.language].length; i++)
			{
				moviesId.push(obj[req.query.language][i].movie);
			}
			fs.readFile('./pvr.json', 'utf8', function(err, data){
				if(err) throw err;
				obj = JSON.parse(data);
				for(var i = 0; i < obj.movies.length; i++)
				{
					if(moviesId.indexOf(obj.movies[i].id) != -1)
						moviesObj['movies'].push(obj.movies[i]);
				}
				res.send(JSON.stringify(moviesObj));
			});
		});
	});

	app.get('/getMovieDetails', function(req, res){
		var obj;
		var theatres = [];
		var shows = [];
		var movieDetails = {};
		movieDetails['theatres'] = [];
		movieDetails['shows'] = [];
		movieDetails['dates'] = [];
		fs.readFile('./pvr_movies.json', 'utf8', function(err, data){
			if(err) throw err;
			obj = JSON.parse(data);
			for(var i = 0; i < obj[req.query.movie].length; i++)
			{
				theatres.push(obj[req.query.movie][i].theatre);
				shows.push(obj[req.query.movie][i].show);
			}
			fs.readFile('./pvr.json','utf8', function(err, data){
				if(err) throw err;
				obj = JSON.parse(data);
				for(var i = 0; i < obj.theatres.length; i++)
				{
					if(theatres.indexOf(obj.theatres[i].id) != -1)
						movieDetails['theatres'].push(obj.theatres[i]);
				}
				for(var i = 0; i < obj.shows.length; i++)
				{
					if(shows.indexOf(obj.shows[i].id) != -1)
						movieDetails['shows'].push(obj.shows[i]);
				}
				movieDetails['dates'].push(getDatesFn(0));
				movieDetails['dates'].push(getDatesFn(1));
				movieDetails['dates'].push(getDatesFn(2));
				res.send(JSON.stringify(movieDetails));
			});
		});
	});

	function getDatesFn(num){
		var noOfMilliseconds = (24 * 60 * 60 * 1000) * num;
		var date = new Date((new Date().getTime()) + noOfMilliseconds);
		var day = date.getDate();
		day = ("0" + day).slice(-2);
		var month = date.getMonth() + 1;
		month = ("0" + month).slice(-2);
		var year = date.getFullYear();
		var _date = {"id" : num, "name" : day + "-" + month + "-" + year};
		return _date;
	}

	app.get('/getNames', function(req, res){
		var obj;
		var filmDetails = {};
		filmDetails['movie'] = "";
		filmDetails['theatre'] = "";
		filmDetails['show'] = "";
		filmDetails['date'] = "";
		fs.readFile('./pvr.json', 'utf8', function(err, data){
			if(err) throw err;
			obj = JSON.parse(data);
			for(var i = 0; i < obj.movies.length; i++)
			{
				if(req.query.movie == obj.movies[i].id)
					filmDetails['movie'] = obj.movies[i].name;
			}
			for(var i = 0; i < obj.theatres.length; i++)
			{
				if(req.query.theatre == obj.theatres[i].id)
					filmDetails['theatre'] = obj.theatres[i].name;
			}
			for(var i = 0; i < obj.shows.length; i++)
			{
				if(req.query.show == obj.shows[i].id)
					filmDetails['show'] = obj.shows[i].name;
			}
			filmDetails['date'] = (getDatesFn(req.query.date)).name;
			res.send(JSON.stringify(filmDetails));
		});
	});

	app.post('/addDetails', function(req, res){
		var count = 0;
		database.insert({
			movie : req.body.movie,
			theatre : req.body.theatre,
			show : req.body.show,
			date : req.body.date,
			noOfSeats : req.body.noOfSeats,
			seats : req.body.seats
		}, function(err){
			if(count == 0){
				console.log("Data could not be inserted in the database file. Please try again!");
			}
		});
		count = count + 1;
		if(count == 1)
		{
			console.log("Data inserted successfully into the database file");
			res.send("yes");
		}
	});

	app.get('/previousTransaction', function(req, res){
		var selectedSeats = "";
		database.find({movie : req.query.movie, theatre : req.query.theatre, show : req.query.show, date : req.query.date}, function(err, docs){
			for(var i = 0; i < docs.length; i++)
			{
				selectedSeats = selectedSeats + docs[i].seats + ",";
			}
			res.send(selectedSeats);
		});
	});

	app.listen(process.env.PORT || 8085);
	console.log("Server is listening")
})();