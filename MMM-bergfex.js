/* Magic Mirror
 * Module: MMM-bergfex
 *
 * By Juergen Wolf-Hofer
 * Apache Licensed.
 */

Module.register('MMM-bergfex', {

  defaults: {
    updateInterval: 20 * 1000,
    animationSpeed: 0,
	header: 'Bergfex.at',
	skiarea: 'Gerlos - Zillertal Arena'
  },

    getStyles: function () {
        return ["MMM-bergfex.css"];
    },  
  
  // Define start sequence
  start: function() {
    Log.log('Starting module: ' + this.name);
    this.stats = {};
	this.stats.skiarea = '-';
	this.stats.tal = '-';
	this.stats.berg = '-';
	this.stats.neu = '-';
	this.stats.lifte = '-';
	this.stats.update = '-';
    this.sendSocketNotification('CONFIG', this.config);
  },

  socketNotificationReceived: function(notification, payload) {
    Log.log('MMM-bergfex: socketNotificationReceived ' + notification);
    Log.log(payload);
    if (notification === 'SNOW_REPORT') {
	  this.stats.skiarea = payload.skiarea;
	  this.stats.tal = payload.tal;
	  this.stats.berg = payload.berg;
	  this.stats.neu = payload.neu;
	  this.stats.lifte = payload.lifte;
	  this.stats.update = payload.update;
      this.updateDom(this.config.animationSpeed);
    }
  },

  // Override dom generator.
  getDom: function() {
	var wrapper = document.createElement('div');
	var header = document.createElement("header");
    //header.classList.add("align-left");
	var name = document.createElement("span");
    name.innerHTML = "" + this.config.header;
    header.appendChild(name);
	wrapper.appendChild(header);
	
    var table = document.createElement('table');
    table.classList.add("small", "table");

	var str = "<tr><td>Gebiet</td><td>Tal</td><td>Berg</td><td>Neu</td><td>Lifte</td></tr>";
    str += '<tr>';
	str +=  	'<td>' + this.stats.skiarea + '</td>';
    //str += '</tr>';
    //str += '<tr>';
	str +=  	'<td >' + this.stats.tal + '</td>';
	str +=  	'<td >' + this.stats.berg + '</td>';
	str +=  	'<td >' + this.stats.neu + '</td>';
	str +=  	'<td >' + this.stats.lifte + '</td>';
    str += '</tr>';
    table.innerHTML = str;
	
	wrapper.appendChild(table);
	return wrapper;
  },
});
