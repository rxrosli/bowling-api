import { Router } from 'express';

const router: Router = Router();

router.route('/').get((req, res) => {
	return res.status(200).json({ data: 'Success!' });
});

router
	.route('/games')
	.post((req, res) => {
		return res.status(200).json({ data: 'Success!' });
	})
	.get((req, res) => {
		return res.status(200).json({ data: 'Success!' });
	});

router
	.route('/games/:id')
	.delete((req, res) => {
		return res.status(200).json({ data: 'Success!' });
	})
	.get((req, res) => {
		return res.status(200).json({ data: 'Success!' });
	})
	.put((req, res) => {
		return res.status(200).json({ data: 'Success!' });
	});

router
	.route('/games/:game_id/shots')
	.post((req, res) => {
		return res.status(200).json({ data: 'Success!' });
	})
	.get((req, res) => {
		return res.status(200).json({ data: 'Success!' });
	});

router
	.route('/games/:game_id/shots/:shot_id')
	.delete((req, res) => {
		return res.status(200).json({ data: 'Success!' });
	})
	.get((req, res) => {
		return res.status(200).json({ data: 'Success!' });
	})
	.put((req, res) => {
		return res.status(200).json({ data: 'Success!' });
	});

export default router;
