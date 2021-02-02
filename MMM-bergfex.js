
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
	cssClassRow: 'xsmall',
	cssClassHeader: 'xsmall bright', 
	country: 'oesterreich',
	showDate: false,
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

	// define required scripts
	getScripts: function(){
		return ["moment.js"]
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

    this.sendSocketNotification('CONFIG', this.config);
  },

  socketNotificationReceived: function(notification, payload) {
    // Log.log('MMM-bergfex: socketNotificationReceived ' + notification);
    //Log.log(payload);
    if (notification === 'SNOW_REPORT') {
		this.showHint = true; 
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

	var str = "<tr class='" + this.config.cssClassHeader + "'><th>"+this.translate("AREA")+"</th><th>"+this.translate("VALLEY")+"</th><th>"+this.translate("MOUNTAIN")+"</th><th>"+this.translate("NEW")+
	"</th><th>"+this.translate("LIFTS")+"</th>";
	if(this.config.showDate){
		str += "<th>"+this.translate("UPDATE")+"</td>";
	}
	str += "</tr>";
	for (var i=0; i<this.snowreports.length; i++) {
		str += '<tr>';
		str += '<td class="' + this.config.cssClassRow + '">' + this.snowreports[i].skiarea.substring(0,this.config.shortenArea) + '</td>';
		str += '<td class="' + this.config.cssClassRow + '">' + this.snowreports[i].tal + '</td>';
		str += '<td class="' + this.config.cssClassRow + '">' + this.snowreports[i].berg + '</td>';
		str += '<td class="' + this.config.cssClassRow + '">' + this.snowreports[i].neu + '</td>';
		str += '<td class="' + this.config.cssClassRow + '">' + this.snowreports[i].lifte + '</td>';
		if(this.config.showDate){
			str += '<td class="'+this.config.cssClassRow+'">'+moment(this.snowreports[i].update, 'YYYY-MM-DD hh:mm:ss').format('DD.MM.YYYY HH:mm')+'</td>';
		}
		str += '</tr>';
	}
    table.innerHTML = str;
	
	wrapper.appendChild(table);

	return wrapper;
  },
});
