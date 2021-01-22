import axios from 'axios';

// API Base
const baseUrl = "https://posture.spottscheduler.com/";

// User Related Operations
const userPath = 'user/';
getUser = email => axios.get(`${baseUrl}${userPath}`, {headers: {email}});
createUser = (name, email, height) => axios.post(`${baseUrl}${userPath}`, {name, email, height});

// Session Related Operations
const sessionPath = 'session/';
startSession = user_id => axios.get(`${baseUrl}${sessionPath}`, {headers: {user_id}});
sendImage = (user_id, session_id, image) => axios.post(`${baseUrl}${sessionPath}`, {user_id, id: session_id, image});

export default {
    getUser,
    createUser,
    startSession,
    sendImage,
}