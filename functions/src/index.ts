import * as functions from 'firebase-functions';
import MicroGear = require('microgear');

// // Start writing Firebase Functions
// // https://firebase.google.com/docs/functions/typescript
//
export const helloWorld = functions
	.region('asia-east2')
	.https.onRequest((request, response) => {
		response.send('Hello from Firebase!');
	});

function connectNetpie(): Promise<any> {
	const microgear = MicroGear.create({
		key: functions.config().netpie.key,
		secret: functions.config().netpie.secret,
		alias: 'functions'
	});
	microgear.setCachePath('/tmp/microgear-g1.cache');

	return new Promise((resolve, reject) => {
		microgear.on('connected', function() {
			resolve(microgear);
		});

		microgear.connect(functions.config().netpie.appid);
	});
}

function disconnectNetpie(microgear: any): Promise<void> {
	return new Promise((resolve, reject) => {
		microgear.resetToken(function(result: any) {
			resolve();
		});
	});
}

export const testNetpie = functions
	.region('asia-east2')
	.https.onRequest(async (request, response) => {
		const microgear = await connectNetpie();
		microgear.publish('/test', 'hi');
		await disconnectNetpie(microgear);

		response.send('Test Netpie!');
	});

// export const scheduledFunctionCrontab = functions
// 	.region('asia-east2')
// 	.pubsub.schedule('*/1 * * * *')
// 	.onRun(context => {
// 		console.log('This will be run every 1 minute!');

// 		return null;
// 	});
