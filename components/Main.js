import React, { useEffect } from "react";
import { useSelector, useDispatch } from "react-redux";
import { useRoute } from '../router';
import { NavigationContainer } from '@react-navigation/native';
import { StatusBar } from 'expo-status-bar';
import { authStateChangeUser } from "../redux/auth/authOperations";

const Main = () => {
    const {stateChange} = useSelector((state) => state.auth);

    const dispatch = useDispatch();
    useEffect(() => {
        dispatch(authStateChangeUser());
    }, []);

    const routing = useRoute(stateChange);
    
    return <NavigationContainer>
        {routing}
        <StatusBar style="auto" />
    </NavigationContainer>
};

export default Main;