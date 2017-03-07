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
const AREA = "Gerlos - Zillertal Arena";

var snow_reports = [];

module.exports = NodeHelper.create({
  start: function() {
    console.log('Starting node helper: ' + this.name);
  },

  // Subclass socketNotificationReceived received.
  socketNotificationReceived: function(notification, payload) {
    var self = this;

    if (notification === 'CONFIG') {
      this.config = payload;
      setInterval(function() {
        self.getStats();
      }, this.config.updateInterval);
    }
  },

  getStats: function() {
    var self = this;
	
	retrieveData();
	var a1 = searchData(AREA);
	self.sendSocketNotification('STATS',snow_reports);
	
	/*var path = this.config.dht22Util + " ";

    async.parallel([
      //async.apply(exec, 'sudo /home/pi/bin/dht22 c 22'),
      //async.apply(exec, 'sudo /home/pi/bin/dht22 f 22'),
      //async.apply(exec, 'sudo /home/pi/bin/dht22 h 22'),
      async.apply(exec, this.config.dht22util + ' c ' + this.config.dht22gpio),
      async.apply(exec, this.config.dht22util + ' f ' + this.config.dht22gpio),
      async.apply(exec, this.config.dht22util + ' h ' + this.config.dht22gpio)
    ],
    function (err, res) {
      var stats = {};
	  stats.celsius = res[0][0];
	  stats.fahrenheit = res[1][0];
	  stats.humidity = res[2][0];
      //console.log(stats);
      self.sendSocketNotification('STATS', stats);
    });*/
  },

});

function retrieveData() {
	request(URL, function (err, response, html) {
		let $ = cheerio.load(html), pageData = {};
		var data = [];
		var tbody = $('.content').children().last();
		
		tbody.children().each(function() {
			entry = parseEntry($(this));
			data.push(entry);
		});
		
		//console.log(data.length + " snow reports from bergfex.at retrieved.");
		snow_reports = data;
		//console.log("forecasts after: ");
		//console.log(forecasts);
		
		var a1 = searchData(AREA);
		console.log(a1);
	});
}

function searchData(area) {
	for (i=0; i<snow_reports.length; i++) {
		if (snow_reports[i].skigebiet === area) {
			return snow_reports[i];
		}
	}
	return null;
}

function parseEntry(row) {
	var entry = {skigebiet: "", tal: "", berg: "", neu: "", lifte: ""};
	
	var td1 = row.children().first();
	var td2 = td1.next();
	var td3 = td2.next();
	var td4 = td3.next();
	var td5 = td4.next();
	var td6 = td5.next();
	var td7 = td6.next();
	
	entry.skigebiet = td1.text().trim();
	entry.tal = td2.text().trim();
	entry.berg = td3.text().trim();
	entry.neu = td4.text().trim();
	entry.lifte = td5.text().trim();
	entry.update = td7.text().trim();
	
	return entry;
}