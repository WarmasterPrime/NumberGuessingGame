
import * as readlinePromises from "node:readline/promises";
const rl = readlinePromises.createInterface( { input: process.stdin, output: process.stdout } );

// Number Guessing Game Source Code
// node C:\Files\Programming\UiA\Games\game.mjs


/**
 * Manages the game's operations.
 */
class Game {

	#usersGuesses = [];
	/**
	 * Creates a new instance of the Game object.
	 */
	constructor() {
		this.points = 0;
	}
	/**
	 * Starts the game.
	 */
	start() {
		console.clear();
		const selectedNumber = Game.getRandom(0, 100);
		this.prompt("Pick a number between 0 and 100...");
		let meInstance=this;
		this.getInput().then((userResponse) => {
			console.log(userResponse);
			meInstance.#usersGuesses.push(userResponse);
			if (userResponse === selectedNumber) {
				meInstance.points++;
				meInstance.prompt("Excellent job!!!");
			} else
				meInstance.prompt("Incorrect answer! The correct answer is \"" + selectedNumber.toString() + "\"");
			meInstance.prompt("Continue? \"Yes\" or \"No\"");
			meInstance.getInput().then((userContinue) => {
				const resp=userContinue.toLowerCase();
				if (resp === "yes" || resp === "y")
					meInstance.start();
				else
					meInstance.showResults();
			});
		});
	}
	/**
	 * Displays the player's results.
	 */
	showResults() {
		this.prompt("You scored " + this.points.toString() + " points...");
	}
	/**
	 * Prompts the user a message.
	 * @param {string} text The message to prompt the user with.
	 */
	prompt(text) {
		console.log(text);
	}
	/**
	 * Prompts the user with a query.
	 * @returns
	 */
	async getInput() {
		return await rl.question("Enter guess: ");
	}
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

const gameInstance = new Game();
gameInstance.start();
