declare module 'microgear' {
	export interface Microgear {
		/**
		 *
		 * @param {string} appid - a group of application that microgear will connect to.
		 */
		connect(appid: string): void;

		/**
		 * microgear can set its own alias, which to be used for others make a function call chat().
		 * The alias will appear on the key management portal of netpie.io .
		 *
		 * @param {string} alias - name of this microgear.
		 */
		setAlias(alias: string): void;

		/**
		 * By default, a microgear token cache file is stored in the same directory
		 * as the application within a file name of this format : 'microgear-.cache'.
		 * This function is for setting a path of microgear token cache file.
		 * It will be useful when you want to run multiple microgears of the same device key on the same location.
		 *
		 * @param {string} path - file path
		 */
		setCachePath(path: string): void;

		/**
		 *
		 * @param {string} gearname - name of microgear to which to send a message.
		 * @param {string} message - message to be sent.
		 */
		chat(gearname: string, message: string): void;

		/**
		 *
		 * @param {string} topic - name of topic to be send a message to.
		 * @param {string} message - message to be sent.
		 * @param {string} [retained] - retain a message or not (the default is false)
		 */
		publish(topic: string, message: string, retained?: boolean): void;

		/**
		 *
		 * @param {string} topic - name of topic to be send a message to.
		 */
		subscribe(topic: string): void;

		/**
		 * send a revoke token control message to NETPIE and delete the token from cache.
		 * As a result, the microgear will need to request a new token for the next connection.
		 *
		 * @param {function} callback - this function will be called when the token reset is finished.
		 *
		 * @example
		 *      microgear.resetToken(function(result){
		 *          microgear.connect(APPID);
		 *      });
		 */
		resetToken(callback: (result: any) => void): void;
		/**
		 * Enable or disable TLS. For microgear-nodejs, TLS is disabled by default.
		 *
		 * @param {boolean} tlsmode - The default is true (use TLS).
		 */
		useTLS(tlsmode: boolean): void;

		/**
		 *
		 * @param {string} event - name of an event
		 * @param {function} callback - callback function
		 */
		on(event: string, callback: () => void): void;
		on(event: string, callback: (error: Error) => void): void;
		on(event: string, callback: (msg: string) => void): void;
		on(event: string, callback: (topic: string, msg: string) => void): void;
		on(event: string, callback: (event: Event) => void): void;
	}

	export interface Event {
		type: 'online' | 'offline' | 'alias';
		gear: string;
		alias: string;
	}

	function create(config: {
		key: string;
		secret: string;
		alias: string;
	}): Microgear;
}
