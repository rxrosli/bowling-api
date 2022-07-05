type pinScoreSymbols = 'X' | '/' | number;

export type Frame = {
	id: number;
	pins_knocked_down: pinScoreSymbols[];
	score: number | null;
};

export interface IBowling {
	readonly name: string;
	readonly frames: Frame[];
	readonly rolls: number[];
	roll(pins: number): void;
}

export const generateBowlingGame = (name: string): IBowling => {
	if (name === '') throw Error('name should not be empty');
	const rolls: number[] = [];
	let pinsRemaining = 10;
	let rollAttempt = 0;
	let bonusRoll = 0;
	let frame = 1;

	const roll = (pins: number) => {
		const pinReset = () => {
			pinsRemaining = 10;
		};
		const nextFrame = () => {
			rollAttempt = 0;
			pinReset();
			++frame;
		};
		if (rollAttempt >= 2 && bonusRoll === 0) throw Error('game has concluded');
		if (pins > pinsRemaining) throw Error('input pins above remaining pins');
		rolls.push(pins);
		++rollAttempt;
		pinsRemaining -= pins;
		if (frame < 10) {
			if (pinsRemaining === 0 || rollAttempt > 1) nextFrame();
		} else {
			if (rollAttempt <= 2 && pinsRemaining === 0) {
				if (rollAttempt === 1) bonusRoll += 1;
				if (rollAttempt === 2 && bonusRoll === 0) bonusRoll += 1;
				pinReset();
			}
			if (rollAttempt > 2 && bonusRoll > 0) {
				bonusRoll -= 1;
			}
		}
	};
	const frames = () => {
		let frames: Frame[] = [];
		let pinsRemaining = 10;
		let rollAttempt = 0;
		let bonusRoll = 0;
		const pinReset = () => {
			pinsRemaining = 10;
		};
		const insertMidFrame = (frame: Frame) => {
			frames.push(frame);
		};
		const insertFrame = (frame: Frame) => {
			frames.push(frame);
			pinsRemaining = 10;
			rollAttempt = 0;
		};
		rolls.forEach((pins, index) => {
			++rollAttempt;
			pinsRemaining -= pins;
			const isLastRoll = index + 1 === rolls.length;
			if (frames.length < 9) {
				if (pinsRemaining === 0) {
					if (rollAttempt < 2)
						insertFrame({
							id: frames.length + 1,
							pins_knocked_down: ['X'],
							score: score(frames.length + 1)
						});
					else
						insertFrame({
							id: frames.length + 1,
							pins_knocked_down: [rolls[index - 1], '/'],
							score: score(frames.length + 1)
						});
				} else {
					if (rollAttempt < 2 && isLastRoll)
						insertMidFrame({
							id: frames.length + 1,
							pins_knocked_down: [pins],
							score: score(frames.length + 1)
						});
					if (rollAttempt === 2)
						insertFrame({
							id: frames.length,
							pins_knocked_down: [rolls[index - 1], pins],
							score: score(frames.length + 1)
						});
				}
			} else {
				if (frames.length < 10)
					frames.push({ id: frames.length + 1, pins_knocked_down: [], score: score(frames.length + 1) });
				if (rollAttempt <= 2 && bonusRoll < 1 && pinsRemaining === 0) bonusRoll = 1;
				if (rollAttempt <= 2 || bonusRoll > 0) {
					if (rollAttempt > 2) bonusRoll = 0;
					if (pins === 10) {
						frames[9].pins_knocked_down.push('X');
						pinReset();
					} else if (pinsRemaining === 0) {
						frames[9].pins_knocked_down.push('/');
						pinReset();
					} else frames[9].pins_knocked_down.push(pins);
				}
			}
		});
		return frames;
	};
	const score = (frame: number) => {
		let rollIndex = 0;
		let runningFrameIndex = 0;
		let score = 0;
		let isScoreNull = false;
		const spareBonus = (rollIndex: number) => {
			return 10 + rolls[rollIndex + 2];
		};
		const strikeBonus = (rollIndex: number) => {
			return 10 + rolls[rollIndex + 1] + rolls[rollIndex + 2];
		};
		const isAbleToComputeStrike = (rollIndex: number) => {
			return rolls.length > rollIndex + 2;
		};
		const isAbleToComputeSpare = (rollIndex: number) => {
			return rolls.length > rollIndex + 2;
		};
		const isAbleToComputeOpen = (rollIndex: number) => {
			return rolls.length > rollIndex + 1;
		};
		const isPinWipeout = (pins_knocked_down: number) => {
			return pins_knocked_down === 10;
		};
		while (!isScoreNull && runningFrameIndex < frame) {
			// strike
			if (isPinWipeout(rolls[rollIndex])) {
				if (!isAbleToComputeStrike(rollIndex)) isScoreNull = true;
				score += strikeBonus(rollIndex);
				rollIndex++;
			}
			// spare
			else if (isPinWipeout(rolls[rollIndex] + rolls[rollIndex + 1])) {
				if (!isAbleToComputeSpare(rollIndex)) isScoreNull = true;
				score += spareBonus(rollIndex);
				rollIndex += 2;
			}
			// open
			else {
				if (!isAbleToComputeOpen(rollIndex)) isScoreNull = true;
				score += rolls[rollIndex] + rolls[rollIndex + 1];
				rollIndex += 2;
			}
			++runningFrameIndex;
		}
		return isScoreNull ? null : score;
	};

	return {
		get name() {
			return name;
		},
		get frames() {
			return frames();
		},
		get rolls() {
			return rolls;
		},
		roll
	};
};
export const generateBowlingGameFromRolls = (name: string, rolls: number[]) => {
	const bowlingGame = generateBowlingGame(name);
	rolls.forEach(pins_knocked_down => bowlingGame.roll(pins_knocked_down));
	return bowlingGame;
};
