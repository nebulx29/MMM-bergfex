/* Magic Mirror
 * Module: MMM-bergfex
 *
 * By Juergen Wolf-Hofer
 * Apache Licensed.
 */

Module.register('MMM-bergfex', {

  defaults: {
    updateInterval: 30 * 60 * 1000,
    animationSpeed: 0,
	header: 'Bergfex.at',
	skiareas: [
			'Hauser Kaibling / Schladming - Ski amade',
			'Hochkar',
		],
	shortenArea: 20,
	cssclass: 'light'
  },

    getStyles: function () {
        return ["MMM-bergfex.css"];
    },  
  
  // Define start sequence
  start: function() {
    Log.log('Starting module: ' + this.name);
	this.snowreports = [{
				skiarea: 'loading...',
				tal: '',
				berg: '',
				neu: '',
				lifte: '',
				update: '' 
	}];
    this.sendSocketNotification('CONFIG', this.config);
  },

  socketNotificationReceived: function(notification, payload) {
    Log.log('MMM-bergfex: socketNotificationReceived ' + notification);
    Log.log(payload);
    if (notification === 'SNOW_REPORT') {
		this.snowreports = payload;
		this.updateDom(this.config.animationSpeed);
    }
  },

  // Override dom generator.
  getDom: function() {
	var wrapper = document.createElement('div');
	var header = document.createElement("header");
	var name = document.createElement("span");
    name.innerHTML = "" + this.config.header;
    header.appendChild(name);
	wrapper.appendChild(header);
	
    var table = document.createElement('table');
    table.classList.add("small", "table");

	var str = "<tr><td>Gebiet</td><td>Tal</td><td>Berg</td><td>Neu</td><td>Lifte</td></tr>";
	for (var i=0; i<this.snowreports.length; i++) {
		str += '<tr>';
		str +=  	'<td class="' + this.config.cssclass + '">' + this.snowreports[i].skiarea.substring(0,this.config.shortenArea) + '...</td>';
		str +=  	'<td class="' + this.config.cssclass + '">' + this.snowreports[i].tal + '</td>';
		str +=  	'<td class="' + this.config.cssclass + '">' + this.snowreports[i].berg + '</td>';
		str +=  	'<td class="' + this.config.cssclass + '">' + this.snowreports[i].neu + '</td>';
		str +=  	'<td class="' + this.config.cssclass + '">' + this.snowreports[i].lifte + '</td>';
		str += '</tr>';
	}
    table.innerHTML = str;
	
	wrapper.appendChild(table);
	return wrapper;
  },
});
