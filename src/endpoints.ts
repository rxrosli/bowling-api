import { randomUUID } from 'crypto';
import { Router } from 'express';
import { createResponse } from './utilities/response';
import { BowlingDAO, bowlingCollection } from './collections';
import { generateBowlingGameFromRolls } from './bowling';

type FrameRequestParams = { pinsKnockedDown: number[] };
const router: Router = Router();

router.route('/').get((req, res) => {
	return res.status(200).json({ data: 'Success!' });
});

router
	.route('/games')
	.post((req, res) => {
		const { name }: BowlingDAO = req.body;
		if (!name) return createResponse(res, 400);
		try {
			const id = randomUUID().substring(0, 7);
			bowlingCollection.push({ id, name, rolls: [] });
			return createResponse(res, 200, { data: { id, name } });
		} catch (error) {
			console.log(error);
			return createResponse(res, 500);
		}
	})
	.get((req, res) => {
		try {
			return createResponse(res, 200, {
				data: bowlingCollection.map(({ rolls, ...bowlingObj }) => bowlingObj)
			});
		} catch (error) {
			console.log(error);
			return createResponse(res, 500);
		}
	});

router
	.route('/games/:id')
	.delete((req, res) => {
		const id: string = req.params.id;
		try {
			const bowlingObjIndex = bowlingCollection.findIndex(bowlingObj => bowlingObj.id === id);
			if (bowlingObjIndex === -1) return createResponse(res, 404);
			bowlingCollection.splice(bowlingObjIndex, 1);
			return createResponse(res, 204);
		} catch (error) {
			console.log(error);
			return createResponse(res, 500);
		}
	})
	.get((req, res) => {
		const id: string = req.params.id;
		try {
			const bowlingObj: BowlingDAO | undefined = bowlingCollection.find(bowlingObj => bowlingObj.id === id);
			if (!bowlingObj) return createResponse(res, 404);

			return createResponse(res, 200, {
				data: { id: bowlingObj.id, name: bowlingObj.name }
			});
		} catch (error) {
			console.log(error);
			return createResponse(res, 500);
		}
	})
	.put((req, res) => {
		const id: string = req.params.id;
		const { name }: BowlingDAO = req.body;
		try {
			const bowlingObjIndex = bowlingCollection.findIndex(bowlingObj => bowlingObj.id === id);
			if (bowlingObjIndex === -1) return createResponse(res, 404);
			let currentBowlingObj = bowlingCollection[bowlingObjIndex];
			bowlingCollection.splice(bowlingObjIndex, 1, { ...currentBowlingObj, name });
			return createResponse(res, 204);
		} catch (error) {
			console.log(error);
			return createResponse(res, 500);
		}
	});

router
	.route('/games/:game_id/shots')
	.post((req, res) => {
		const game_id: string = req.params.game_id;
		const { pinsKnockedDown }: FrameRequestParams = req.body;
		if (!Array.isArray(pinsKnockedDown)) return createResponse(res, 404);
		try {
			const bowlingData: BowlingDAO | undefined = bowlingCollection.find(
				bowlingDAO => bowlingDAO.id === game_id
			);
			if (!bowlingData) return createResponse(res, 404);
			const bowlingObj = generateBowlingGameFromRolls(bowlingData.name, bowlingData.rolls);
			const frameLimit = bowlingObj.frames.length + 1;
			pinsKnockedDown.forEach(pins => bowlingObj.roll(pins));
			if (bowlingObj.frames.length > frameLimit) return createResponse(res, 400);
			const bowlingObjIndex = bowlingCollection.findIndex(bowlingObj => bowlingObj.id === game_id);
			bowlingCollection.splice(bowlingObjIndex, 1, { ...bowlingData, rolls: bowlingObj.rolls });
			return createResponse(res, 201);
		} catch (error) {
			console.log(error);
			if ((error as Error).message === 'input pins above remaining pins')
				return createResponse(res, 400, { error: { message: (error as Error).message } });
			return createResponse(res, 500);
		}
	})
	.get((req, res) => {
		const game_id: string = req.params.game_id;
		try {
			const bowlingData: BowlingDAO | undefined = bowlingCollection.find(
				bowlingDAO => bowlingDAO.id === game_id
			);
			if (!bowlingData) return createResponse(res, 404);
			const bowlingObj = generateBowlingGameFromRolls(bowlingData.name, bowlingData.rolls);
			return createResponse(res, 200, { data: bowlingObj.frames });
		} catch (error) {
			console.log(error);
			return createResponse(res, 500);
		}
	});

router
	.route('/games/:game_id/shots/:shot_id')
	.delete((req, res) => {
		const game_id: string = req.params.game_id;
		const shot_id: number = parseInt(req.params.shot_id);
		if (isNaN(shot_id)) return createResponse(res, 400);
		try {
			const bowlingData: BowlingDAO | undefined = bowlingCollection.find(
				bowlingDAO => bowlingDAO.id === game_id
			);
			if (!bowlingData) return createResponse(res, 404);
			const bowlingObj = generateBowlingGameFromRolls(bowlingData.name, bowlingData.rolls);
			if (bowlingObj.frames.length < shot_id) return createResponse(res, 404);

			const frameIndex = shot_id - 1;
			const targetFrameRollsLength = bowlingObj.frames[frameIndex].pinsKnockedDown.length;
			const frameRollsUpperIndex = bowlingObj.frames[frameIndex].rollRef;
			const frameRollsLowerIndex = frameRollsUpperIndex + targetFrameRollsLength;
			const precursorRollSet = bowlingObj.rolls.slice(0, frameRollsUpperIndex);
			const postcursorRollSet = bowlingObj.rolls.slice(frameRollsLowerIndex);

			const updatedRolls = [...precursorRollSet, ...postcursorRollSet];
			const updatedBowlingObj = generateBowlingGameFromRolls(bowlingData.name, updatedRolls);
			const bowlingObjIndex = bowlingCollection.findIndex(bowlingObj => bowlingObj.id === game_id);

			bowlingCollection.splice(bowlingObjIndex, 1, { ...bowlingData, rolls: updatedBowlingObj.rolls });

			return createResponse(res, 204);
		} catch (error) {
			console.log(error);
			return createResponse(res, 500);
		}
	})
	.get((req, res) => {
		const game_id: string = req.params.game_id;
		const shot_id: number = parseInt(req.params.shot_id);
		if (isNaN(shot_id)) return createResponse(res, 400);
		try {
			const bowlingData: BowlingDAO | undefined = bowlingCollection.find(
				bowlingDAO => bowlingDAO.id === game_id
			);
			if (!bowlingData) return createResponse(res, 404);
			const bowlingObj = generateBowlingGameFromRolls(bowlingData.name, bowlingData.rolls);
			if (bowlingObj.frames.length < shot_id) return createResponse(res, 404);
			return createResponse(res, 200, { data: bowlingObj.frames[shot_id - 1] });
		} catch (error) {
			console.log(error);
			return createResponse(res, 500);
		}
	})
	.put((req, res) => {
		const game_id: string = req.params.game_id;
		const shot_id: number = parseInt(req.params.shot_id);
		const { pinsKnockedDown }: FrameRequestParams = req.body;
		if (!Array.isArray(pinsKnockedDown)) return createResponse(res, 400);
		if (isNaN(shot_id)) return createResponse(res, 400);
		try {
			const bowlingData: BowlingDAO | undefined = bowlingCollection.find(
				bowlingDAO => bowlingDAO.id === game_id
			);

			if (!bowlingData) return createResponse(res, 404);

			const bowlingObj = generateBowlingGameFromRolls(bowlingData.name, bowlingData.rolls);

			if (bowlingObj.frames.length < shot_id) return createResponse(res, 404);
			if (shot_id < 10 && pinsKnockedDown.length > 2) return createResponse(res, 400);

			const frameIndex = shot_id - 1;
			const targetFrameRollsLength = bowlingObj.frames[frameIndex].pinsKnockedDown.length;
			const frameRollsUpperIndex = bowlingObj.frames[frameIndex].rollRef;
			const frameRollsLowerIndex = frameRollsUpperIndex + targetFrameRollsLength;
			const precursorRollSet = bowlingObj.rolls.slice(0, frameRollsUpperIndex);
			const postcursorRollSet = bowlingObj.rolls.slice(frameRollsLowerIndex);

			const updatedRolls = [...precursorRollSet, ...pinsKnockedDown, ...postcursorRollSet];
			const updatedBowlingObj = generateBowlingGameFromRolls(bowlingData.name, updatedRolls);
			const bowlingObjIndex = bowlingCollection.findIndex(bowlingObj => bowlingObj.id === game_id);

			bowlingCollection.splice(bowlingObjIndex, 1, { ...bowlingData, rolls: updatedBowlingObj.rolls });

			return createResponse(res, 204);
		} catch (error) {
			console.log(error);
			if ((error as Error).message === 'input pins above remaining pins')
				return createResponse(res, 400, { error: { message: (error as Error).message } });
			return createResponse(res, 500);
		}
	});

export default router;
