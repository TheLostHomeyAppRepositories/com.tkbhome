'use strict';

const ZwaveDevice = require('homey-zwavedriver').ZwaveDevice;


class TZE93 extends ZwaveDevice {

	onNodeInit() {

		// Display debugging information in the console
		this.enableDebug();
		this.printNode();

		// 1. ONOFF REGISTRATION WITH FAST BURST SYNCHRONIZATION MODE
		this.registerCapability('onoff', 'BASIC', {
			getOpts: {
				getOnStart: true,
			},
			get: 'BASIC_GET',
			set: 'BASIC_SET',
			setParser: value => {
				return {
					'Value': value ? 255 : 0
				};
			},
			report: 'BASIC_REPORT',
			reportParser: report => {
				if (report && report.hasOwnProperty('Value')) {
					const isTurnedOn = report['Value'] > 0;
					this.log('[TZE93] Physical status of the thermostat has changed. Turned on?:', isTurnedOn);

					if (isTurnedOn) {
						try {
							const mobileSetpoint = this.getCapabilityValue('target_temperature');
							this.log('[TZE93] Turning on detected. Value in the mobile app is:', mobileSetpoint);

							if (mobileSetpoint && this.node.CommandClass.COMMAND_CLASS_THERMOSTAT_SETPOINT) {

								// COMMON WRITE FUNCTION (To avoid code duplication)
								const sendTemperatureToHardware = async () => {
									try {
										await this.node.CommandClass.COMMAND_CLASS_THERMOSTAT_SETPOINT.THERMOSTAT_SETPOINT_SET({
											'Level': { 'Setpoint Type': 'Heating 1' },
											'Level2': { 'Size': 2, 'Scale': 0, 'Precision': 1 },
											'Value': Buffer.from([0, mobileSetpoint * 10])
										});
										this.log('[TZE93] Z-Wave command sent successfully at ' + mobileSetpoint + '°C.');
									} catch (err) {
										this.error('[TZE93] Failed to write temperature in burst sequence:', err);
									}
								};

								// --- BURST SEQUENCE FOR MAXIMUM SPEED AND STABILITY ---

								// 1st ATTEMPT: Lightning fast (only 300ms after pressing). If the chip keeps up, the change happens immediately.
								setTimeout(() => {
									this.log('[TZE93] Launching 1st attempt at lightning-fast temperature overwrite (300ms)...');
									sendTemperatureToHardware();
								}, 300);

								// 2nd ATTEMPT: Backup (1200ms after pressing). Ensures transmission if the processor missed processing the 1st attempt.
								setTimeout(() => {
									this.log('[TZE93] Launching 2nd backup attempt at temperature overwrite (1200ms)...');
									sendTemperatureToHardware();
								}, 1200);

							}
						} catch (e) {
							this.error('[TZE93] Failed to retrieve value from mobile memory:', e);
						}
					}
					return isTurnedOn;
				}
				return 0;
			}
		});

		this.registerCapability('thermostat_mode', 'THERMOSTAT_MODE');

		this.registerCapability('measure_temperature', 'SENSOR_MULTILEVEL', {
			getOpts: {
				getOnStart: true,
			},
		});

		this.registerCapability('target_temperature', 'THERMOSTAT_SETPOINT', {
			getOpts: {
				getOnStart: true,
			},
		});
	}

}

module.exports = TZE93;
