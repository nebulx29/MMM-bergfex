# MMM-bergfex.at
bergfex.at snow reports Austria retrieved from http://www.bergfex.at/oesterreich/schneewerte/

### Prerequisites

- tested only on MagicMirror v2.0.0


### Download and Installation 

To use this module, clone this repository to your __modules__ folder of your MagicMirror: `git clone https://github.com/nebulx29/MMM-bergfex`

Goto `MMM-bergfex` module directory and run `npm install cheerio` and `npm install`


### Configuration

The module needs the default configuration block in your config.js to work.

```
		{
			module: 'MMM-bergfex',
			position: 'top_right', 
			classes: 'small dimmed', 
			config: {
			    updateInterval: 30*60*1000,
			    animationSpeed: 0,
			    header: 'bergfex.at Snow Report',
				skiareas: [
						'Gerlos - Zillertal Arena',
						'Hauser Kaibling / Schladming - Ski amade',
						'Hochkar',
						'Hochkönig / Maria Alm - Dienten - Mühlbach - Ski amade',
						'Klippitztörl',
						'Koralpe'
					],
				shortenArea: 20,
				cssclassrow: 'normal',
				cssclassheader: 'bright'				
			}
		},
```

The following properties can be configured:

|Option|Description|Values|Default|
|---|---|---|---|
|updateInterval|The update interval. Determines the refresh rate in ms at which sensor is read.<br>**Example:** `updateInterval: 10000`|int|`30*60*1000`ms = 30min|
|animationSpeed|Speed of animation when updates occur.<br>**Example:** `animationSpeed: 0`|int|0|
|header|The name that should be displayed at the top of the module<br>**Example:** `header: 'bergfex.at'`|String|'bergfex.at'|
|skiareas|This is an array with strings of the skiareas to display. String must exactly match the name on http://www.bergfex.at/oesterreich/schneewerte/<br>|array of strings|''|
|shortenArea|number of characters skiarea names will be shortened to.<br>**Example:** `shortenArea: 20`|int|20|
|cssclassheader|CSS class for the table header (bright, normal, etc).<br>**Example:** `cssclassheader: normal`|String|'normal'|
|cssclassrow|CSS class for the table rows (normal, light, etc).<br>**Example:** `cssclassrow: light`|String|'light'|

