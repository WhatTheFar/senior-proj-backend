import * as functions from 'firebase-functions';
import MicroGear = require('microgear');

/**
 *	Constant for NETPIE
 */
const NETPIE_IOT_SYNC_TOPIC = '/iot';
const NETPIE_TEST_TOPIC = '/test';

const NETPIE_CACHE_PATH = '/tmp/microgear-g1.cache';

export const ping = functions
	.region('asia-east2')
	.https.onRequest((request, response) => {
		response.send('pong');
	});

function connectNetpie(): Promise<MicroGear.Microgear> {
	const microgear = MicroGear.create({
		key: functions.config().netpie.key,
		secret: functions.config().netpie.secret,
		alias: 'functions'
	});
	microgear.setCachePath(NETPIE_CACHE_PATH);

	return new Promise((resolve, reject) => {
		microgear.on('connected', () => {
			resolve(microgear);
		});

		microgear.connect(functions.config().netpie.appid);
	});
}

function disconnectNetpie(microgear: MicroGear.Microgear): Promise<void> {
	return new Promise((resolve, reject) => {
		microgear.resetToken((result: any) => {
			resolve();
		});
	});
}

export const testNetpie = functions
	.region('asia-east2')
	.https.onRequest(async (request, response) => {
		const microgear = await connectNetpie();
		microgear.publish(NETPIE_TEST_TOPIC, 'hi');
		await disconnectNetpie(microgear);

		response.send('Test Netpie!');
	});

export const iotSensorSyncronizationCrontab = functions
	.region('asia-east2')
	.pubsub.schedule('*/1 * * * *')
	.onRun(async context => {
		console.log('IoT Syncronization, this will be run every 1 minute!');

		const microgear = await connectNetpie();

		const timeISOString = new Date().toISOString();
		microgear.publish(NETPIE_IOT_SYNC_TOPIC, timeISOString);

		await disconnectNetpie(microgear);
		return null;
	});
