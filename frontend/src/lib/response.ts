export type ApiResponse<T = unknown> = {
	error: boolean;
	message: string;
	data?: T;
};

export type ApiSuccessResponse<T> = ApiResponse<T> & {
	error: false;
	data: T;
};

export type ApiErrorResponse = ApiResponse<never> & {
	error: true;
	message: string;
	status: number;
};
