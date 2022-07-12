import request from 'supertest';
import { app, server } from '../src/server';

afterEach(() => {
	server.close();
});

describe('Given a bowling game service', () => {
	it('Should allow to create a game.', async () => {
		const response = await request(app).post('/api/games').send({ name: 'Anonymous' });
		expect(response.statusCode).toBe(200);
		expect(response.body.data).toHaveProperty('id');
		expect(response.body.data.name).toBe('Anonymous');
	});
	it('Should allow to read a game', async () => {
		let response = await request(app).post('/api/games').send({ name: 'Anonymous' });
		const id = response.body.data.id;

		response = await request(app)
			.get('/api/games/' + id)
			.send();

		expect(response.statusCode).toBe(200);
		expect(response.body.data.id).toBe(id);
	});
	it('Should allow to delete a game', async () => {
		let response = await request(app).post('/api/games').send({ name: 'Anonymous' });
		const id = response.body.data.id;

		response = await request(app)
			.delete('/api/games/' + id)
			.send();
		expect(response.statusCode).toBe(204);

		response = await request(app)
			.get('/api/games/' + id)
			.send();
		expect(response.statusCode).toBe(404);
	});
	it('Should allow to update a game', async () => {
		let response = await request(app).post('/api/games').send({ name: 'Anonymous' });
		const id = response.body.data.id;

		response = await request(app)
			.put('/api/games/' + id)
			.send({ name: 'Lorem Ipsum' });
		expect(response.statusCode).toBe(204);

		response = await request(app)
			.get('/api/games/' + id)
			.send();
		expect(response.statusCode).toBe(200);
		expect(response.body.data.id).toBe(id);
		expect(response.body.data.name).toBe('Lorem Ipsum');
	});

	describe('When a bowling game exists in service', () => {
		let game_id: string;
		let response: request.Response;
		beforeEach(async () => {
			response = await request(app).post('/api/games').send({ name: 'Anonymous' });
			game_id = response.body.data.id;
		});
		it('Should allow to create and read of a frame score', async () => {
			response = await request(app)
				.post('/api/games/' + game_id + '/shots')
				.send({ pins_knocked_down: [10] });
			expect(response.statusCode).toBe(201);

			response = await request(app)
				.get('/api/games/' + game_id + '/shots/1')
				.send();
			expect(response.statusCode).toBe(200);
			expect(response.body.data.pins_knocked_down[0]).toBe('X');
		});
		it('Should allow to delete a frame score', async () => {
			/**
			 * Assuming the proper behavior is by deletion of the frame object in the collection
			 * and shifting the succeeding frames left.
			 *
			 * ex. remove frame 1
			 * [{id: 1, pins_knocked_down: [X]}, {id: 2, pins_knocked_down: [9,/]}] => [{id: 1, pins_knocked_down: [9,/]}]
			 */
			response = await request(app)
				.post('/api/games/' + game_id + '/shots')
				.send({ pins_knocked_down: [10] });
			response = await request(app)
				.post('/api/games/' + game_id + '/shots')
				.send({ pins_knocked_down: [9, 1] });

			response = await request(app)
				.delete('/api/games/' + game_id + '/shots/1')
				.send();
			expect(response.statusCode).toBe(204);

			response = await request(app)
				.get('/api/games/' + game_id + '/shots/1')
				.send();
			expect(response.statusCode).toBe(200);
			expect(response.body.data.pins_knocked_down[0]).toBe(9);
			expect(response.body.data.pins_knocked_down[1]).toBe('/');
		});
		it('Should allow to update a frame score', async () => {
			/**
			 * ex. update frame 2 pins_knocked_down to [5,5]
			 * [{id: 1, pins_knocked_down: [X]}, {id: 2, pins_knocked_down: [9,/]}] => [{id: 1, pins_knocked_down: [X]}, {id: 2, pins_knocked_down: [5,/]}]}]
			 */
			response = await request(app)
				.post('/api/games/' + game_id + '/shots')
				.send({ pins_knocked_down: [10] });
			response = await request(app)
				.post('/api/games/' + game_id + '/shots')
				.send({ pins_knocked_down: [9, 1] });

			response = await request(app)
				.put('/api/games/' + game_id + '/shots/2')
				.send({ pins_knocked_down: [5, 5] });
			expect(response.statusCode).toBe(204);

			response = await request(app)
				.get('/api/games/' + game_id + '/shots/2')
				.send();

			expect(response.statusCode).toBe(200);
			expect(response.body.data.pins_knocked_down[0]).toBe(5);
			expect(response.body.data.pins_knocked_down[1]).toBe('/');
		});
	});
});
