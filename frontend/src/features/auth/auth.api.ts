import { createApi } from "@reduxjs/toolkit/query/react";
import type { User } from "./auth.slice";
import { ApiSuccessResponse } from "@/lib/response";
import { customBaseQuery } from "@/lib/baseQuery";

export type LoginRequest = {
	email: string;
	password: string;
};

export type LoginResponse = {
	token: string;
	user: User;
};

export const authApi = createApi({
	reducerPath: "authApi",
	baseQuery: customBaseQuery,
	tagTypes: ["User"],
	endpoints: (builder) => ({
		login: builder.mutation<ApiSuccessResponse<LoginResponse>, LoginRequest>({
			query: (body) => ({
				url: "/api/v1/users/login",
				method: "POST",
				body,
			}),
			async onQueryStarted(_arg, { dispatch, queryFulfilled }) {
				try {
					const { data } = await queryFulfilled;
					dispatch(
						authApi.util.upsertQueryData("getUserMe", undefined, {
							error: false,
							message: "User data retrieved",
							data: data.data.user,
						}),
					);
				} catch {}
			},
		}),
		logout: builder.mutation<void, void>({
			query: () => ({
				url: "/api/v1/users/logout",
				method: "POST",
			}),
		}),
		googleLogin: builder.mutation<
			ApiSuccessResponse<LoginResponse>,
			{ code: string }
		>({
			query: (body) => ({
				url: "/api/v1/auth/google",
				method: "POST",
				body,
			}),
			async onQueryStarted(_arg, { dispatch, queryFulfilled }) {
				try {
					const { data } = await queryFulfilled;
					dispatch(
						authApi.util.upsertQueryData("getUserMe", undefined, {
							error: false,
							message: "User data retrieved",
							data: data.data.user,
						}),
					);
				} catch {}
			},
		}),
		googleOneTapLogin: builder.mutation<
			ApiSuccessResponse<LoginResponse>,
			{ credential: string }
		>({
			query: (body) => ({
				url: "/api/v1/auth/google/one-tap",
				method: "POST",
				body,
			}),
			async onQueryStarted(_arg, { dispatch, queryFulfilled }) {
				try {
					const { data } = await queryFulfilled;
					dispatch(
						authApi.util.upsertQueryData("getUserMe", undefined, {
							error: false,
							message: "User data retrieved",
							data: data.data.user,
						}),
					);
				} catch {}
			},
		}),
		getUserMe: builder.query<ApiSuccessResponse<User>, void>({
			query: () => ({
				url: "/api/v1/users/me",
				method: "GET",
			}),
			providesTags: ["User"],
		}),
	}),
});

export const {
	useLoginMutation,
	useLogoutMutation,
	useGoogleLoginMutation,
	useGoogleOneTapLoginMutation,
	useGetUserMeQuery,
} = authApi;
