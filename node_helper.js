'use strict';

const NodeHelper = require("node_helper");
const request = require('request'); 
const cheerio = require("cheerio");

module.exports = NodeHelper.create({

  start: function() {
    console.log('Starting node helper: ' + this.name);
  },

  // Subclass socketNotificationReceived received.
  socketNotificationReceived: function(notification, payload) {
    if (notification === 'CONFIG') {
		var self = this;
		this.config = payload;
		self.retrieveAndUpdate();
		setInterval(function() {
			self.retrieveAndUpdate();
		}, this.config.updateInterval);
    }
  },

  retrieveAndUpdate: function() {
	var self = this;

	// assemble URL 
	const URL = "http://www.bergfex.at/"+self.config.country+"/schneewerte"; 

	request(URL, function (err, response, html) {
		let $ = cheerio.load(html);
		var allSnowReports = [];
		var tbody = $('tr.tr0'); 
		
		tbody.each(function() {
			var entry = parseEntry($(this));
			allSnowReports.push(entry);
		});
		tbody = $('tr.tr1'); 
		
		tbody.each(function() {
			var entry = parseEntry($(this));
			allSnowReports.push(entry);
		});

		console.log(allSnowReports.length + " snow reports from bergfex.at retrieved.");
		var selSnowReports = [];
		for (var i=0; i<self.config.skiareas.length; i++) {
			// console.log("searching for " + self.config.skiareas[i]);
			selSnowReports.push(searchData(allSnowReports, self.config.skiareas[i]));
		}
		// console.log(selSnowReports);
		
		self.sendSocketNotification('SNOW_REPORT', selSnowReports);
	});
	
  }

});


function searchData(snow_reports, skiarea) {
	for (var i=0; i<snow_reports.length; i++) {
		if (snow_reports[i].skiarea === skiarea) {
			return snow_reports[i];
		}
	}
	return null;
}

function parseEntry(row) {
	var entry = {skiarea: "", tal: "", berg: "", neu: "", lifte: "", update: ""}; 

	var td1 = row.children().first();
	var td2 = td1.next();
	var td3 = td2.next();
	var td4 = td3.next();
	var td5 = td4.next();
	var td6 = td5.next();
	// var td7 = td6.next();

	entry.skiarea = td1.text().trim();
	entry.tal = td2.text().trim();
	entry.berg = td3.text().trim();
	entry.neu = td4.text().trim();
	entry.lifte = td5.text().trim();
	entry.update = td6.attr('data-value').trim();
	
	return entry;
}
