import {
	UPDATE_KEYBOARD,
	UPDATE_EMAIL,
	UPDATE_PASSWORD,
	UPDATE_FIRST_NAME,
	UPDATE_LAST_NAME,
	UPDATE_HEIGHT,
	SIGN_IN_USER,
} from "./action_types";

export const updateKeyboard = (keyboardShowing) => ({
	type: UPDATE_KEYBOARD,
	keyboardShowing,
});

export const updateEmail = (email) => ({
	type: UPDATE_EMAIL,
	email,
});

export const updatePassword = (password) => ({
	type: UPDATE_PASSWORD,
	password,
});

export const updateFirstName = (firstName) => ({
	type: UPDATE_FIRST_NAME,
	firstName,
});

export const updateLastName = (lastName) => ({
	type: UPDATE_LAST_NAME,
	lastName,
});

export const updateHeight = (height) => ({
	type: UPDATE_HEIGHT,
	height,
});

export const signInUser = (userId, height, fullName) => ({
	type: SIGN_IN_USER,
	userId,
	height,
	fullName,
});