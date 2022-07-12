import { Rolling } from './roll';
import { Constructor } from '../utilities/mixins';

export interface Scoring {
	score(frame: number): number | null;
}

export function Score<T extends Constructor<Rolling>>(Base: T) {
	return class Scoring extends Base {
		#spareBonus(rollIndex: number) {
			return 10 + this.rolls[rollIndex + 2];
		}
		#strikeBonus = (rollIndex: number) => {
			return 10 + this.rolls[rollIndex + 1] + this.rolls[rollIndex + 2];
		};
		#isAbleToComputeStrike = (rollIndex: number) => {
			return this.rolls.length > rollIndex + 2;
		};
		#isAbleToComputeSpare = (rollIndex: number) => {
			return this.rolls.length > rollIndex + 2;
		};
		#isAbleToComputeOpen = (rollIndex: number) => {
			return this.rolls.length > rollIndex + 1;
		};
		#isPinWipeout = (pins_knocked_down: number) => {
			return pins_knocked_down === 10;
		};
		score(frame: number) {
			let rollIndex = 0;
			let runningFrameIndex = 0;
			let score = 0;
			let isScoreNull = false;

			for (let i = 0; !isScoreNull && i < frame; ) {
				// strike
				if (this.#isPinWipeout(this.rolls[rollIndex])) {
					if (!this.#isAbleToComputeStrike(rollIndex)) isScoreNull = true;
					score += this.#strikeBonus(rollIndex);
					rollIndex++;
				}
				// spare
				else if (this.#isPinWipeout(this.rolls[rollIndex] + this.rolls[rollIndex + 1])) {
					if (!this.#isAbleToComputeSpare(rollIndex)) isScoreNull = true;
					score += this.#spareBonus(rollIndex);
					rollIndex += 2;
				}
				// open
				else {
					if (!this.#isAbleToComputeOpen(rollIndex)) isScoreNull = true;
					score += this.rolls[rollIndex] + this.rolls[rollIndex + 1];
					rollIndex += 2;
				}
				i += 1;
			}
			return isScoreNull ? null : score;
		}
	};
}
