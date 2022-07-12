import { Rolling } from './roll';
import { Scoring } from './score';
import { Constructor } from '../utilities/mixins';

type pinScoreSymbols = 'X' | '/' | number;

type Frame = {
	id: number;
	rollRef: number;
	pinsKnockedDown: pinScoreSymbols[];
	score: number | null;
};

export interface Framing {
	readonly frames: Frame[];
}

export function Frame<T extends Constructor<Rolling & Scoring>>(Base: T) {
	return class Framing extends Base {
		#buildFrame(id: number, rollRef: number, pins: number[], score: number | null): Frame {
			let pinsKnockedDown: pinScoreSymbols[] = [];

			// Tenth Frame
			if (id === 10) {
				for (let i = 0; i < pins.length; ) {
					if (pins[i] === 10) {
						pinsKnockedDown.push('X');
						i += 1;
					} else if (i < 3 && pins[i] + pins[i + 1] === 10) {
						pinsKnockedDown.push(pins[i]);
						pinsKnockedDown.push('/');
						i += 2;
					} else {
						pinsKnockedDown.push(pins[i]);
						i += 1;
					}
				}
			} else if (pins[0] === 10) pinsKnockedDown = ['X'];
			else if (pins[0] + pins[1] === 10) pinsKnockedDown = [pins[0], '/'];
			else pinsKnockedDown = pins;

			return { id, rollRef, pinsKnockedDown, score };
		}
		get frames() {
			let frames: Frame[] = [];
			for (let r = 0; r < this.rolls.length; ) {
				const id = frames.length + 1;
				if (frames.length === 9) {
					const remaining = this.rolls.slice(r, this.rolls.length);
					frames.push(this.#buildFrame(id, r, remaining, this.score(id)));
					r += remaining.length;
				} else if (this.rolls[r] > 9) {
					frames.push(this.#buildFrame(id, r, this.rolls.slice(r, r + 1), this.score(id)));
					r += 1;
				} else {
					frames.push(this.#buildFrame(id, r, this.rolls.slice(r, r + 2), this.score(id)));
					r += 2;
				}
			}

			return frames;
		}
	};
}
