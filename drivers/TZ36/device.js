'use strict';

const Homey = require('homey');
const ZwaveDevice = require('homey-zwavedriver').ZwaveDevice;

class TZ36Switch extends ZwaveDevice {
	async onNodeInit() {
		//this.printNode();
		//this.enableDebug();

		// Capabilities
		this.registerCapability('onoff', 'SWITCH_BINARY');

		// Flows
		let TZ36RightSingleOn = this.homey.flow.getDeviceTriggerCard('TZ36D_s2_single_on');

		let TZ36RightSingleOff = this.homey.flow.getDeviceTriggerCard('TZ36D_s2_single_off');

		let TZ36RightDoubleOn = this.homey.flow.getDeviceTriggerCard('TZ36D_s2_double_on');

		let TZ36RightDoubleOff = this.homey.flow.getDeviceTriggerCard('TZ36D_s2_double_off');

		// Single/double press function
		let singlePress = false;

		this.node.on('nif', nodeInformationFrame => {

			const CC_MultilevelSwitch = this.getCommandClass('SWITCH_MULTILEVEL');
			if (!(CC_MultilevelSwitch instanceof Error) && typeof CC_MultilevelSwitch.SWITCH_MULTILEVEL_GET === 'function') {
				setTimeout(() => {
					try {
						CC_MultilevelSwitch.SWITCH_MULTILEVEL_GET()
							.then(result => {
								this.log(result);
								if (result.hasOwnProperty('Value (Raw)')) {
									this.setCapabilityValue('onoff', result['Value (Raw)'][0] > 0);
									this.setCapabilityValue('dim', (result['Value (Raw)'][0] === 255) ? 1 : result['Value (Raw)'][0] / 99);
								}
							})
							.catch(err => {
								// timeout seems to be a common issue with multilevel get
							});
					} catch(err) {
						// timeout seems to be a common issue with multilevel get
					}
				}, 2000);
			}

			singlePress = true;
			setTimeout(() => {
				singlePress = false;
			}, 200);
		});

		this.node.on('_applicationUpdate', nodeInformationFrame => {

			const CC_MultilevelSwitch = this.getCommandClass('SWITCH_MULTILEVEL');
			if (!(CC_MultilevelSwitch instanceof Error) && typeof CC_MultilevelSwitch.SWITCH_MULTILEVEL_GET === 'function') {
				setTimeout(() => {
					try {
						CC_MultilevelSwitch.SWITCH_MULTILEVEL_GET()
							.then(result => {
								this.log(result);
								if (result.hasOwnProperty('Value (Raw)')) {
									this.setCapabilityValue('onoff', result['Value (Raw)'][0] > 0);
									this.setCapabilityValue('dim', (result['Value (Raw)'][0] === 255) ? 1 : result['Value (Raw)'][0] / 99);
								}
							})
							.catch(err => {
							// timeout seems to be a common issue with multilevel get
						});

					} catch(err) {
						// timeout seems to be a common issue with multilevel get
					}
				}, 2000);
			}

			singlePress = true;
			setTimeout(() => {
				singlePress = false;
			}, 200);
		});

		// Report listereners
		this.registerReportListener('BASIC', 'BASIC_SET', report => {

			if (report.hasOwnProperty('Value')) {

				if (singlePress) {
					if (report.Value === 255) TZ36RightSingleOn.trigger(this, null, null);
					if (report.Value === 0) TZ36RightSingleOff.trigger(this, null, null);
				} else {
					if (report.Value === 255) TZ36RightDoubleOn.trigger(this, null, null);
					if (report.Value === 0) TZ36RightDoubleOff.trigger(this, null, null);
				}
			}
		});
	}
}

module.exports = TZ36Switch;
