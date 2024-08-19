
import VNumber from "vNumber.mjs";
import * as readlinePromises from "node:readline/promises";
const rl = readlinePromises.createInterface( { input: process.stdin, output: process.stdout } );

// Number Guessing Game Source Code

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
		let selectedNumber = VNumber.getRandom(0, 100);
		this.prompt("Pick a number between 0 and 100...");
		let userResponse = await this.getInput();
		this.#usersGuesses.push(userResponse);
		if (userResponse === selectedResponse) {
			this.points++;
			this.prompt("Excellent job!!!");
		}
		this.prompt("Continue? \"Yes\" or \"No\"");
		let userContinue = this.getInput().toLowerCase();
		if (userContinue === "yes")
			start();
		else
			this.showResults();
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

}

const gameInstance = new Game();
gameInstance.start();
