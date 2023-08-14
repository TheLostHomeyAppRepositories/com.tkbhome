'use strict';

const Homey = require('homey');
const ZwaveDevice = require('homey-zwavedriver').ZwaveDevice;

class TZ35Dimmer extends ZwaveDevice {
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
							CC_MultilevelSwitch.SWITCH_MULTILEVEL_GET();
						}, 2000);
					} catch (err) {
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

		// Flows
		let TZ35RightSingleOn = this.homey.flow.getDeviceTriggerCard('TZ35D_s2_single_on');

		let TZ35RightSingleOff = this.homey.flow.getDeviceTriggerCard('TZ35D_s2_single_off');

		let TZ35RightDoubleOn = this.homey.flow.getDeviceTriggerCard('TZ35D_s2_double_on');

		let TZ35RightDoubleOff = this.homey.flow.getDeviceTriggerCard('TZ35D_s2_double_off');

		// Single/Double press function
		let singlePress = false;

		this.node.on('nif', nodeInformationFrame => {

			const CC_MultilevelSwitch = this.getCommandClass('SWITCH_MULTILEVEL');
			if (!(CC_MultilevelSwitch instanceof Error) && typeof CC_MultilevelSwitch.SWITCH_MULTILEVEL_GET === 'function') {
				try {
					setTimeout(() => {
						CC_MultilevelSwitch.SWITCH_MULTILEVEL_GET()
							.then(result => {
								this.log(result);
								if (result.hasOwnProperty('Value (Raw)')) {
									let raw = result['Value (Raw)'][0]
									this.setCapabilityValue('onoff', raw > 0);
									raw = (raw === 255) ? 1 : raw / 99
									raw = raw > 1 ? 1 : raw
									this.setCapabilityValue('dim', raw);
								}
							})
							.catch(err => {
								// timeout seems to be a common issue with multilevel get
							});
					}, 2000);
				} catch(err) {
					// timeout seems to be a common issue with multilevel get
				}
			}

			singlePress = true;
			setTimeout(() => {
				singlePress = false;
			}, 200);
		});

		this.node.on('_applicationUpdate', nodeInformationFrame => {

			const CC_MultilevelSwitch = this.getCommandClass('SWITCH_MULTILEVEL');
			if (!(CC_MultilevelSwitch instanceof Error) && typeof CC_MultilevelSwitch.SWITCH_MULTILEVEL_GET === 'function') {
				try {
					setTimeout(() => {
						CC_MultilevelSwitch.SWITCH_MULTILEVEL_GET()
							.then(result => {
								this.log(result);
								if (result.hasOwnProperty('Value (Raw)')) {
									let raw = result['Value (Raw)'][0]
									this.setCapabilityValue('onoff', raw > 0);
									raw = (raw === 255) ? 1 : raw / 99
									raw = raw > 1 ? 1 : raw
									this.setCapabilityValue('dim', raw);
								}
							})
							.catch(err => {
								// timeout seems to be a common issue with multilevel get
							});
					}, 2000);
				} catch (err) {
					// timeout seems to be a common issue with multilevel get
				}
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
					if (report.Value === 255) TZ35RightSingleOn.trigger(this, null, null);
					if (report.Value === 0) TZ35RightSingleOff.trigger(this, null, null);
				} else {
					if (report.Value === 255) TZ35RightDoubleOn.trigger(this, null, null);
					if (report.Value === 0) TZ35RightDoubleOff.trigger(this, null, null);
				}
			}
		});
	}
}

module.exports = TZ35Dimmer;
