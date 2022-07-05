import { Response } from 'express';
import { Result } from './result';

export type HTTPError = {
	message: string;
};

export function createResponse<T, E>(
	res: Response,
	statusCode: number,
	body?: Result<T, E>
): Response<Result<T, E>> {
	res.status(statusCode).json(body);
	return res;
}
