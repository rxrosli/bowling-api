import { Roll } from './mixins/roll';
import { Score } from './mixins/score';
import { Frame } from './mixins/frame';

class Game {
	readonly name: string;
	constructor(name: string) {
		this.name = name;
	}
}

export class BowlingGame extends Frame(Score(Roll(Game))) {}

export function generateBowlingGameFromRolls(name: string, rolls: number[]) {
	const bowlingGame = new BowlingGame(name);
	rolls.forEach(pins => bowlingGame.roll(pins));
	return bowlingGame;
}
