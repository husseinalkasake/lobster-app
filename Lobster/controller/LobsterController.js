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
getUserSessions = user_id => axios.get(`${baseUrl}${sessionPath}history`, {headers: {user_id}});
sendImage = (user_id, session_id, image) => axios.post(`${baseUrl}${sessionPath}`, {user_id, id: session_id, image});
getSessionSummary = (user_id, session_id) => axios.get(`${baseUrl}${sessionPath}summary`, {headers: {user_id, session_id}});
getLastFiveMinSummary = (user_id, session_id) => axios.get(`${baseUrl}${sessionPath}summary/interval`, {headers: {user_id, session_id}});

export default {
    getUser,
    createUser,
    startSession,
    sendImage,
    getSessionSummary,
    getLastFiveMinSummary,
    getUserSessions,
}