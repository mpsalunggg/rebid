import { createSlice, type PayloadAction } from "@reduxjs/toolkit";
import type { ReactNode } from "react";

type DialogState = {
	isOpen: boolean;
	dialogId: string | null;
	component: ReactNode | null;
	maxWidth?: string;
};

const initialState: DialogState = {
	isOpen: false,
	dialogId: null,
	component: null,
	maxWidth: undefined,
};

type OpenDialogPayload = {
	id: string;
	component: ReactNode;
	maxWidth?: string;
};

const dialogSlice = createSlice({
	name: "dialog",
	initialState,
	reducers: {
		openDialog: (state, action: PayloadAction<OpenDialogPayload>) => {
			state.isOpen = true;
			state.dialogId = action.payload.id;
			state.component = action.payload.component;
			state.maxWidth = action.payload.maxWidth || "max-w-lg";
		},
		closeDialog: (state) => {
			state.isOpen = false;
		},
		resetDialog: (state) => {
			state.dialogId = null;
			state.component = null;
			state.maxWidth = undefined;
		},
	},
});

export const { openDialog, closeDialog, resetDialog } = dialogSlice.actions;
export default dialogSlice.reducer;
