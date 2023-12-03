'use strict';

const Homey = require('homey');
const ZwaveDevice = require('homey-zwavedriver').ZwaveDevice;

class TZ67PlusPlugDimmer extends ZwaveDevice {
	async onNodeInit() {
		//this.printNode();
		//this.enableDebug();

		// Capabilities
		this.registerCapability('onoff', 'SWITCH_MULTILEVEL', {
			setParser: value => {

				const CC_MultilevelSwitch = this.getCommandClass('SWITCH_MULTILEVEL');
				if (!(CC_MultilevelSwitch instanceof Error) && typeof CC_MultilevelSwitch.SWITCH_MULTILEVEL_GET === 'function') {
					try {
						setTimeout(() => {
							CC_MultilevelSwitch.SWITCH_MULTILEVEL_GET()
								.catch(err => {
									// timeout seems to be a common issue with multilevel get
								});
						}, 2000);
					} catch (unused) {
						console.log("Timeout calling SWITCH_MULTILEVEL_GET()");
						// timeout seems to be a common issue with multilevel get
					}
				}

				return {
					Value: (value) ? 'on/enable' : 'off/disable',
				};
			},
		});

		this.registerCapability('dim', 'SWITCH_MULTILEVEL', {
			getOpts: {
				pollInterval: this.getSetting('poll_interval') * 1000,
			},
		});
	}
}

module.exports = TZ67PlusPlugDimmer;
