import { BowlingGame } from '../src/bowling';

describe('Given a Bowling Game Factory', () => {
	describe('When a user creates a game', () => {
		it('Should be able to create a game', () => {
			expect(new BowlingGame('Anonymous')).toHaveProperty('name', 'Anonymous');
		});
		it('Should reject if name attribute is empty', () => {
			expect(() => new BowlingGame('')).toThrowError('name should not be empty');
		});
	});
});

describe('Given a Bowling Game', () => {
	describe('When a user enters a roll', () => {
		let bowlingGame: BowlingGame;
		beforeEach(() => (bowlingGame = new BowlingGame('Anonymous')));
		it('Should reject roll if pins knocked down is higher than 10', () => {
			expect(() => bowlingGame.roll(11)).toThrowError('input pins above remaining pin');
		});
		it('Should reject roll if pins knocked down is higher than pins remaining', () => {
			bowlingGame.roll(5);
			expect(() => bowlingGame.roll(6)).toThrowError('input pins above remaining pin');
		});
		it('Should reject roll if game has concluded', () => {
			const rolls = [10, 10, 10, 10, 10, 10, 10, 10, 10, 0, 0];
			rolls.forEach(pins_knocked_down => bowlingGame.roll(pins_knocked_down));
			expect(() => bowlingGame.roll(0)).toThrowError('game has concluded');
		});
		it('Should detect if game has bonus rolls', () => {
			const rolls = [10, 10, 10, 10, 10, 10, 10, 10, 10, 10, 10];
			rolls.forEach(pins_knocked_down => bowlingGame.roll(pins_knocked_down));
			expect(() => bowlingGame.roll(10)).not.toThrowError('game has concluded');
		});
	});
	describe('When a user views the frames', () => {
		let bowlingGame: BowlingGame;
		beforeEach(() => (bowlingGame = new BowlingGame('Anonymous')));
		it('Should display the correct number of frames', () => {
			let rolls = [10, 10, 10, 10, 10];
			rolls.forEach(pins_knocked_down => bowlingGame.roll(pins_knocked_down));
			expect(bowlingGame.frames.length).toBe(5);

			bowlingGame = new BowlingGame('Anonymous');
			rolls = [10, 10, 10, 9, 1];
			rolls.forEach(pins_knocked_down => bowlingGame.roll(pins_knocked_down));
			expect(bowlingGame.frames.length).toBe(4);

			bowlingGame = new BowlingGame('Anonymous');
			rolls = [10, 10, 10, 9, 0];
			rolls.forEach(pins_knocked_down => bowlingGame.roll(pins_knocked_down));
			expect(bowlingGame.frames.length).toBe(4);

			bowlingGame = new BowlingGame('Anonymous');
			rolls = [10, 10, 10, 10, 10, 10, 10, 10, 10, 10, 10, 10];
			rolls.forEach(pins_knocked_down => bowlingGame.roll(pins_knocked_down));
			expect(bowlingGame.frames.length).toBe(10);

			bowlingGame = new BowlingGame('Anonymous');
			rolls = [10, 10, 10, 10, 10, 10, 10, 10, 10, 9, 0];
			rolls.forEach(pins_knocked_down => bowlingGame.roll(pins_knocked_down));
			expect(bowlingGame.frames.length).toBe(10);
		});
	});
});

describe('Given a frame', () => {
	let bowlingGame: BowlingGame;
	beforeEach(() => (bowlingGame = new BowlingGame('Anonymous')));
	describe('When frame is a strike', () => {
		it('Should have a null score if score requirements is not met', () => {
			bowlingGame.roll(10);
			bowlingGame.roll(10);
			expect(bowlingGame.frames[0].score).toBe(null);
		});
		it('Should have correct score for strike', () => {
			bowlingGame.roll(10);
			bowlingGame.roll(2);
			bowlingGame.roll(3);
			expect(bowlingGame.frames[0].score).toBe(15);
		});
		it('Should display roll properly', () => {
			bowlingGame.roll(10);
			expect(bowlingGame.frames[0].pinsKnockedDown[0]).toBe('X');
		});
	});
	describe('When frame is a spare', () => {
		it('Should have a null score if spare score requirements is not met', () => {
			bowlingGame.roll(9);
			bowlingGame.roll(1);
			expect(bowlingGame.frames[0].score).toBe(null);
		});
		it('Should have correct score for spare', () => {
			bowlingGame.roll(9);
			bowlingGame.roll(1);
			bowlingGame.roll(5);
			expect(bowlingGame.frames[0].score).toBe(15);
		});
		it('Should display spare rolls properly', () => {
			bowlingGame.roll(9);
			bowlingGame.roll(1);
			expect(bowlingGame.frames[0].pinsKnockedDown[0]).toBe(9);
			expect(bowlingGame.frames[0].pinsKnockedDown[1]).toBe('/');
		});
	});
	describe('When frame is open', () => {
		it('Should display open rolls properly', () => {
			bowlingGame.roll(9);
			bowlingGame.roll(0);
			expect(bowlingGame.frames[0].pinsKnockedDown[0]).toBe(9);
			expect(bowlingGame.frames[0].pinsKnockedDown[1]).toBe(0);
		});
		it('Should have correct score for open frames', () => {
			bowlingGame.roll(9);
			bowlingGame.roll(0);
			expect(bowlingGame.frames[0].score).toBe(9);
		});
	});
	describe('When frame is incomplete', () => {
		it('Should dispaly rolls properly', () => {
			bowlingGame.roll(3);
			expect(bowlingGame.frames[0].pinsKnockedDown.length).toBe(1);
			expect(bowlingGame.frames[0].pinsKnockedDown[0]).toBe(3);
		});
		it('Should have a null score', () => {
			bowlingGame.roll(3);
			expect(bowlingGame.frames[0].score).toBe(null);
		});
	});
	describe('When tenth frame', () => {
		it('Should have a null score if incomplete', () => {
			const rolls = [10, 10, 10, 10, 10, 10, 10, 10, 10, 9];
			rolls.forEach(pins_knocked_down => bowlingGame.roll(pins_knocked_down));
			expect(bowlingGame.frames[9].score).toBe(null);
		});
		it('Should score open frames properly', () => {
			const rolls = [10, 10, 10, 10, 10, 10, 10, 10, 10, 9, 0];
			rolls.forEach(pins_knocked_down => bowlingGame.roll(pins_knocked_down));
			expect(bowlingGame.frames[9].score).toBe(267);
		});
		it('Should score bonus rolls properly', () => {
			let rolls = [10, 10, 10, 10, 10, 10, 10, 10, 10, 9, 1, 5];
			rolls.forEach(pins_knocked_down => bowlingGame.roll(pins_knocked_down));
			expect(bowlingGame.frames[9].score).toBe(274);

			bowlingGame = new BowlingGame('Anonymous');
			rolls = [10, 10, 10, 10, 10, 10, 10, 10, 10, 9, 1, 10];
			rolls.forEach(pins_knocked_down => bowlingGame.roll(pins_knocked_down));
			expect(bowlingGame.frames[9].score).toBe(279);

			bowlingGame = new BowlingGame('Anonymous');
			rolls = [10, 10, 10, 10, 10, 10, 10, 10, 10, 10, 10, 10];
			rolls.forEach(pins_knocked_down => bowlingGame.roll(pins_knocked_down));
			expect(bowlingGame.frames[9].score).toBe(300);
		});
		it('Should display rolls properly', () => {
			let rolls = [10, 10, 10, 10, 10, 10, 10, 10, 10, 9, 1, 5];
			rolls.forEach(pins_knocked_down => bowlingGame.roll(pins_knocked_down));
			expect(bowlingGame.frames[9].pinsKnockedDown[0]).toBe(9);
			expect(bowlingGame.frames[9].pinsKnockedDown[1]).toBe('/');
			expect(bowlingGame.frames[9].pinsKnockedDown[2]).toBe(5);

			bowlingGame = new BowlingGame('Anonymous');
			rolls = [10, 10, 10, 10, 10, 10, 10, 10, 10, 10, 10, 5];
			rolls.forEach(pins_knocked_down => bowlingGame.roll(pins_knocked_down));
			expect(bowlingGame.frames[9].pinsKnockedDown[0]).toBe('X');
			expect(bowlingGame.frames[9].pinsKnockedDown[1]).toBe('X');
			expect(bowlingGame.frames[9].pinsKnockedDown[2]).toBe(5);

			bowlingGame = new BowlingGame('Anonymous');
			rolls = [10, 10, 10, 10, 10, 10, 10, 10, 10, 10, 10, 10];
			rolls.forEach(pins_knocked_down => bowlingGame.roll(pins_knocked_down));
			expect(bowlingGame.frames[9].pinsKnockedDown[0]).toBe('X');
			expect(bowlingGame.frames[9].pinsKnockedDown[1]).toBe('X');
			expect(bowlingGame.frames[9].pinsKnockedDown[2]).toBe('X');
		});
	});
});
