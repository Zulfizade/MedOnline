import { configureStore } from '@reduxjs/toolkit';

import authReducer from './reducers/authSlice';
import userReducer from './reducers/userSlice';
import patientRegisterReducer from './reducers/patientRegisterSlice';
import doctorRegisterReducer from './reducers/doctorRegisterSlice';
import notificationReducer from './reducers/notificationSlice';
import chatReducer from './reducers/chatSlice';
import tipsReducer from './reducers/tipsSlice';

export const store = configureStore({
  reducer: {
    auth: authReducer,
    user: userReducer,
    patientRegister: patientRegisterReducer,
    doctorRegister: doctorRegisterReducer,
    notifications: notificationReducer,
    chat: chatReducer,
    tips: tipsReducer,
  },
});