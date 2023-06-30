'use strict';

const Homey = require('homey');

class TKBHomeApp extends Homey.App {
	onInit() {
		// Start debuger
		if (process.env.DEBUG === '1') {
			//require(“inspector”).open(9229, “0.0.0.0”, true);
		}
		this.log(`${Homey.manifest.id} running...`);
	}
}

module.exports = TKBHomeApp;
