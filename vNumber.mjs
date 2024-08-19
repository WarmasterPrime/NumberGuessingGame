/**
 * Manages number generation.
 */
export default class VNumber {
	/**
	 * Generates a random number within a given range.
	 * @param {int|float} min The minimum numerical value that the random number can be.
	 * @param {int|float} max The maximum numerical value that the random number can be.
	 * @returns {int|float}
	 */
	static getRandom(min, max) {
		return (Math.random() + min) * max;
	}

}