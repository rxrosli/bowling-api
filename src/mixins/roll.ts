import { Constructor } from '../utilities/mixins';

export interface Rolling {
	rolls: number[];
	roll(pins: number): void;
}

export class RollingError extends Error {}

export function Roll<T extends Constructor>(Base: T) {
	return class Rolling extends Base {
		#bonusRoll = 0;
		#rollAttempt = 0;
		#currentFrame = 1;
		#pinsRemaining = 10;
		rolls: number[] = [];

		#resetPins(): void {
			this.#pinsRemaining = 10;
		}
		#nextFrame(): void {
			this.#rollAttempt = 0;
			this.#currentFrame += 1;
			this.#resetPins();
		}
		#pushRoll(pins: number): void {
			this.#pinsRemaining -= pins;
			this.#rollAttempt += 1;
			this.rolls.push(pins);
		}
		#isSpare(): boolean {
			return this.#pinsRemaining === 0 && this.#rollAttempt === 2;
		}
		#isStrike(): boolean {
			return this.#pinsRemaining === 0 && this.#rollAttempt === 1;
		}
		roll(pins: number): void {
			if (this.#rollAttempt >= 2 && this.#bonusRoll === 0) throw new RollingError('game has concluded');
			if (pins > this.#pinsRemaining) throw new RollingError('input pins above remaining pins');
			this.#pushRoll(pins);
			if (this.#currentFrame < 10) {
				if (this.#pinsRemaining === 0 || this.#rollAttempt > 1) this.#nextFrame();
			} else {
				// Give bonus point if strike or spare.
				if (this.#isStrike() || this.#isSpare()) {
					if (this.#bonusRoll === 0) this.#bonusRoll += 1;
					this.#resetPins();
				}
				// Allow third attempt if it has a bonus roll.
				if (this.#rollAttempt > 2 && this.#bonusRoll > 0) {
					this.#bonusRoll -= 1;
				}
			}
		}
	};
}
