'use strict';

/* Magic Mirror
 * Module: MMM-bergfex
 *
 * By Juergen Wolf-Hofer
 * Apache 2.0 Licensed.
 */

const NodeHelper = require('node_helper');
var async = require('async');
var sys = require('sys');
var exec = require('child_process').exec;
const request = require('request');
const cheerio = require("cheerio");

// Constants
const URL = "http://www.bergfex.at/oesterreich/schneewerte/";

module.exports = NodeHelper.create({

  start: function() {
    console.log('Starting node helper: ' + this.name);
  },

  // Subclass socketNotificationReceived received.
  socketNotificationReceived: function(notification, payload) {
    if (notification === 'CONFIG') {
	  var self = this;
      this.config = payload;
      setInterval(function() {
        self.getStats();
      }, this.config.updateInterval);
    }
  },

  getStats: function() {
	  var self = this;
	  console.log('getStats()');
	retrieveData();
	
	//var a1 = searchData(this.config.snow_reports, this.config.skiarea);
	
	var a1 = { 
			skiarea: 'Gosau - Dachstein West',
			tal: '80 cm',
			berg: '100 cm',
			neu: '10 cm',
			lifte: '32/32',
			update: 'Heute, 08:13' 
	};

	self.sendSocketNotification('SNOW_REPORT', a1);
  }


});

function retrieveData() {
	console.log('retrieveData()');
	request(URL, function (err, response, html) {
		let $ = cheerio.load(html), pageData = {};
		var data = [];
		var tbody = $('.content').children().last();
		
		tbody.children().each(function() {
			var entry = parseEntry($(this));
			data.push(entry);
		});
		
		console.log(data.length + " snow reports from bergfex.at retrieved.");
		//this.config.snow_reports = data;
		//console.log(data);
		//var a = searchData(data, 'Gerlos - Zillertal Arena');
		//console.log(a);
	});
}

function searchData(snow_reports, skiarea) {
	for (var i=0; i<snow_reports.length; i++) {
		if (snow_reports[i].skiarea === skiarea) {
			return snow_reports[i];
		}
	}
	return null;
}

function parseEntry(row) {
	var entry = {skiarea: "", tal: "", berg: "", neu: "", lifte: ""};
	
	var td1 = row.children().first();
	var td2 = td1.next();
	var td3 = td2.next();
	var td4 = td3.next();
	var td5 = td4.next();
	var td6 = td5.next();
	var td7 = td6.next();
	
	entry.skiarea = td1.text().trim();
	entry.tal = td2.text().trim();
	entry.berg = td3.text().trim();
	entry.neu = td4.text().trim();
	entry.lifte = td5.text().trim();
	entry.update = td7.text().trim();
	
	return entry;
}