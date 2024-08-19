
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

	promptForModeSelection() {
		const meInstance=this;
		this.prompt("Please select a mode from the list below...\n\n1.) Normal\n2.) Hint (Warm/Cold)\n");
		this.getInput().then((userResponse) => {
			switch(parseFloat(userResponse)) {
				case 1:
					meInstance.mode="normal";
					break;
				case 2:
					meInstance.mode="hint";
					break;
				default:
					meInstance.mode="normal";
					break;
			}
			meInstance.prompt("The mode has been successfully changed to \"" + meInstance.mode.toString() + "\"...\n\n");
			meInstance.getInput("Press the enter key to return to the main menu...").then(() => {
				meInstance.mainMenu();
			});
		});
	}
	/**
	 * Provides the main menu controls for the user.
	 */
	mainMenu() {
		this.clear();
		const meIns=this;
		this.prompt("Number Guesser\n\nMAIN MENU\n---------\n\n0.) Exit\n1.) Start\n2.) Change Mode\n\n");
		this.getInput("Please enter the number associated with the menu option: ").then((input) => {
			switch(parseFloat(input)) {
				case 0:
					meIns.exit();
					break;
				case 1:
					meIns.start();
					break;
				case 2:
					meIns.promptForModeSelection();
					break;
				default:
					meIns.mainMenu();
					break;
			}
		});
	}
	/**
	 * Displays options for range adjustments.
	 */
	updateRangeMenu() {
		this.clear();
		const meIns=this;
		this.prompt("0.) Back\n1.) Set minimum value (" + this.#min.toString() + ")\n2.) Set maximum value (" + this.#max.toString() + ")");
		this.getInput("Please enter the number associated with the menu option: ").then((input) => {
			switch(parseFloat(input)) {
				case 0:
					meIns.mainMenu();
					break;
				case 1:
					meIns.promptForMinSet();
					break;
				case 2:
					meIns.promptForMaxSet();
					break;
				default:
					meIns.updateRangeMenu();
					break;
			}
		});
	}
	/**
	 * Prompts the user to set the minimum value for the range selection.
	 */
	promptForMinSet() {
		this.clear();
		const meIns=this;
		this.getInput("Enter the minimum value for the range: ").then((input) => {
			meIns.#min=parseFloat(input);
			meIns.updateRangeMenu();
		});
	}
	/**
	 * Prompts the user to set the maximum value for the range selection.
	 */
	promptForMaxSet() {
		this.clear();
		const meIns=this;
		this.getInput("Enter the maximum value for the range: ").then((input) => {
			meIns.#max=parseFloat(input);
			meIns.updateRangeMenu();
		});
	}
	/**
	 * Clears the interface.
	 */
	clear() {
		console.clear();
	}
	/**
	 * Starts the game.
	 */
	start() {
		console.clear();
		if(this.mode==="hint" && this.#usersGuesses.length===0)
			this.selectedNumber=Math.floor(Game.getRandom(this.#min, this.#max));
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
	 * Exists the game.
	 */
	exit() {
		process.exit();
	}
	/**
	 * Displays the player's results.
	 */
	showResults() {
		this.prompt("You scored " + this.points.toString() + " points...\n\nYou've given the following responses to the number guesses...\n\n" + this.getGuesses());
		this.exit();
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
	async getInput(text="Enter response: ") {
		return await rl.question(text);
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