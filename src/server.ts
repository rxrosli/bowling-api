import 'dotenv/config';
import express from 'express';
import cors from 'cors';
import endpoints from './endpoints';
import { Server } from 'http';

export let server: Server;
export const app = express();

const PORT = process.env.PORT || '3000';

const corsOptions = {
	origin: '*',
	methods: 'GET,HEAD,PUT,POST,DELETE',
	preflightContinue: false,
	optionsSuccessStatus: 204
};

app.use(cors(corsOptions));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use('/api', endpoints);

async function main() {
	server = app.listen(PORT, () => {
		console.info(`Server ready at port ${PORT}`);
	});
}
main().catch(console.error);
