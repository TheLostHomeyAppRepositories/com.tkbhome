'use strict';

const Homey = require('homey');
const ZwaveDevice = require('homey-zwavedriver').ZwaveDevice;

class TZ78Switch extends ZwaveDevice {
	async onNodeInit() {
		// Capabilities
		this.registerCapability('onoff', 'SWITCH_BINARY', {
			getOpts: {
				pollInterval: this.getSetting('poll_interval') * 1000,
			}
		});
	}
}

module.exports = TZ78Switch;
