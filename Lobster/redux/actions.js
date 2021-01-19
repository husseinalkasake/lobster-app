import {
	UPDATE_AGE,
	UPDATE_SEX,
	UPDATE_HEIGHT,
	UPDATE_WEIGHT,
	UPDATE_ACTIVITY_LEVEL,
	UPDATE_DESIRED_DIFFICULTY,
	UPDATE_FITNESS_GOALS,
	UPDATE_APP_FIRST_TIME_USAGE,
} from "./action_types";

export const updateAge = (age) => ({
	type: UPDATE_AGE,
	age,
});

export const updateSex = (sex) => ({
	type: UPDATE_SEX,
	sex,
});

export const updateWeight = (weight) => ({
	type: UPDATE_WEIGHT,
	weight,
});

export const updateHeight = (height) => ({
	type: UPDATE_HEIGHT,
	height,
});

export const updateActivityLevel = (activityLevel) => ({
	type: UPDATE_ACTIVITY_LEVEL,
	activityLevel,
});

export const updateDesiredDifficulty = (desiredDifficulty) => ({
	type: UPDATE_DESIRED_DIFFICULTY,
	desiredDifficulty,
});

export const updateFitnessGoals = (fitnessGoals) => ({
	type: UPDATE_FITNESS_GOALS,
	fitnessGoals,
});

export const updateAppFirstTimeUsage = () => ({
	type: UPDATE_APP_FIRST_TIME_USAGE,
});
