export type Success<T> = {
	data: T;
	error?: never;
};

export type Error<T> = {
	data?: never;
	error: T;
};

export type Result<T, E> = Success<T> | Error<E>;
