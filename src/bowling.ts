import { Roll } from './mixins/roll';
import { Score } from './mixins/score';
import { Frame } from './mixins/frame';

class GameError extends Error {}

class Game {
	readonly name: string;
	constructor(name: string) {
		if (!name) throw new GameError('name should not be empty');
		this.name = name;
	}
}

export class BowlingGame extends Frame(Score(Roll(Game))) {}

export function generateBowlingGameFromRolls(name: string, rolls: number[]) {
	const bowlingGame = new BowlingGame(name);
	rolls.forEach(pins => bowlingGame.roll(pins));
	return bowlingGame;
}
