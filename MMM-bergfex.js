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
	cssclassrow: 'xsmall',
	cssclassheader: 'small bright', 
	country: 'oesterreich',
	showUpdateHint: true,
  },

	getStyles: function () {
		return ["MMM-bergfex.css"];
	},  

	getTranslations: function(){
		return {
			en: "translations/en.json", 
			de: "translations/de.json"
		}
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
	this.hideTime = 30000; // hides update hint after given time 
	this.showHint = false; 
	this.updateTime; 

    this.sendSocketNotification('CONFIG', this.config);
  },

  socketNotificationReceived: function(notification, payload) {
    // Log.log('MMM-bergfex: socketNotificationReceived ' + notification);
    //Log.log(payload);
    if (notification === 'SNOW_REPORT') {
		this.showHint = true; 
		this.updateTime = moment().format('HH:mm:ss');
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
    // table.classList.add("small", "table");

	var str = "<tr class='" + this.config.cssclassheader + "'><th>Gebiet</th><th>Tal</th><th>Berg</th><th>Neu</th><th>Lifte</th></tr>";
	for (var i=0; i<this.snowreports.length; i++) {
		str += '<tr>';
		str +=  	'<td class="' + this.config.cssclassrow + '">' + this.snowreports[i].skiarea.substring(0,this.config.shortenArea) + '</td>';
		str +=  	'<td class="' + this.config.cssclassrow + '">' + this.snowreports[i].tal + '</td>';
		str +=  	'<td class="' + this.config.cssclassrow + '">' + this.snowreports[i].berg + '</td>';
		str +=  	'<td class="' + this.config.cssclassrow + '">' + this.snowreports[i].neu + '</td>';
		str +=  	'<td class="' + this.config.cssclassrow + '">' + this.snowreports[i].lifte + '</td>';
		str += '</tr>';
	}
    table.innerHTML = str;
	
	wrapper.appendChild(table);

	// add update hint 
	if(this.config.showUpdateHint && this.showHint && this.updateTime !== undefined){
		var updateHint = document.createElement('div');
		updateHint.className = 'xsmall dimmed italic'; 
		updateHint.innerHTML = this.translate("LAST_UPDATE")+' '+this.updateTime+'.'; 
	
		setTimeout(function() {
			updateHint.style.display='none';
		}, this.hideTime);
	
		wrapper.appendChild(updateHint);
	}

	return wrapper;
  },
});
