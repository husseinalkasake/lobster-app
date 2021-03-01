import {
	UPDATE_KEYBOARD,
	UPDATE_EMAIL,
	UPDATE_NAME,
	UPDATE_HEIGHT,
	SIGN_IN_USER,
	UPDATE_SESSION_ID,
	LOG_OUT,
} from "./action_types";

export const updateKeyboard = (keyboardShowing) => ({
	type: UPDATE_KEYBOARD,
	keyboardShowing,
});

export const updateEmail = (email) => ({
	type: UPDATE_EMAIL,
	email,
});

export const updateName = (name) => ({
	type: UPDATE_NAME,
	name,
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

export const updateSessionId = (sessionId) => ({
	type: UPDATE_SESSION_ID,
	sessionId,
});

export const logOut = () => ({
	type: LOG_OUT,
})