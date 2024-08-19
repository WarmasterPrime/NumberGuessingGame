
import * as readlinePromises from "node:readline/promises";
const rl = readlinePromises.createInterface( { input: process.stdin, output: process.stdout } );

// Number Guessing Game Source Code
// node C:\Files\Programming\UiA\Games\game.mjs

/**
 * Stores guessing information.
 */
class Guess {
	/**
	 * Creates a pair between the user's guess and the computer's actual value.
	 * @param {any} userGuess
	 * @param {any} actualValue
	 */
	constructor(userGuess, actualValue, mode="hint") {
		this.userGuess=parseFloat(userGuess);
		this.actualValue=parseFloat(actualValue);
		this.mode=mode;
	}
	/**
	 * Gets the string representation of this object.
	 * @returns {string}
	 */
	toString() {
		return this.userGuess.toString() + " -> " + this.actualValue.toString() + " (" + (this.userGuess===this.actualValue ? "Correct" : "Incorrect") + ")";
	}

}

/**
 * Manages the game's operations.
 */
class Game {

	#usersGuesses = [];
	#min=0;
	#max=10;
	/**
	 * Creates a new instance of the Game object.
	 * @param {int|float} min The minimum value of the range to select from.
	 * @param {int|float} max The maximum value of the range to select from.
	 */
	constructor(min, max, mode="hint") {
		this.points = 0;
		this.#min=min;
		this.#max=max;
		this.mode=mode;
		this.selectedNumber;
	}
	/**
	 * Starts the game.
	 */
	start() {
		console.clear();
		//const selectedNumber = Math.floor(Game.getRandom(this.#min, this.#max));
		if(this.mode==="hint" && this.#usersGuesses.length===0)
			this.selectedNumber=Math.floor(Game.getRandom(this.#min, this.#max));
		//this.selectedNumber=Math.floor(Game.getRandom(this.#min, this.#max));
		const selectedNumber=this.selectedNumber;
		this.prompt("Pick a number between " + this.#min.toString() + " and " + this.#max.toString() + "...");
		let meInstance=this;
		this.getInput().then((userResponse) => {
			console.log(userResponse);
			meInstance.#usersGuesses.push(new Guess(userResponse, selectedNumber));
			if(parseFloat(userResponse)===selectedNumber) {
				meInstance.points++;
				meInstance.prompt("Excellent job!!!\nYour score is \""+meInstance.points.toString()+"\"");
				if(this.mode==="hint")
					meInstance.selectedNumber=Math.floor(Game.getRandom(this.#min, this.#max));
			} else {
				if(this.mode==="hint")
					meInstance.prompt("Try a " + (parseFloat(userResponse)<selectedNumber ? "higher" : "lower") + " number");
				else
					meInstance.prompt("Incorrect answer! The correct answer is \""+selectedNumber.toString()+"\"\nYour score is \""+meInstance.points.toString()+"\"");
			}
			meInstance.prompt("Continue? \"Yes\" or \"No\"");
			meInstance.getInput().then((userContinue) => {
				const resp=userContinue.toLowerCase();
				if (resp === "no" || resp === "n")
					meInstance.showResults();
				else
					meInstance.start();
			});
		});
	}
	/**
	 * Displays the player's results.
	 */
	showResults() {
		this.prompt("You scored " + this.points.toString() + " points...\n\nYou've given the following responses to the number guesses...\n\n" + this.getGuesses());
		process.exit();
	}
	/**
	 * Generates a string table of the guesses.
	 * @returns {string}
	 */
	getGuesses() {
		let res="";
		for(let i=0;i<this.#usersGuesses.length;i++)
			res+=(res.length>0 ? "\n" : "") + this.#usersGuesses[i].toString();
		return "User's Guess    |    Actual Value\n---------------------------------\n" + res;
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
		return await rl.question("Enter response: ");
	}
	/**
	 * Generates a random number within a given range.
	 * @param {int|float} min The minimum numerical value that the random number can be.
	 * @param {int|float} max The maximum numerical value that the random number can be.
	 * @returns {int|float}
	 */
	static getRandom(min, max) {
		return (Math.random() * (max+1)) + min;
	}
}

const gameInstance = new Game(1, 100);
gameInstance.start();