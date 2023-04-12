import React from "react";

import { StyleSheet, View, Image } from 'react-native';

import { createStackNavigator } from '@react-navigation/stack';
import { createBottomTabNavigator } from "@react-navigation/bottom-tabs";

import RegistrationScreen from './Screens/authScreens/RegistrationScreen';
import LoginScreen from './Screens/authScreens/LoginScreen';
import PostsScreen from "./Screens/mainScreen/PostsScreen";
import CreatePostsScreen from "./Screens/mainScreen/CreatePostsScreen";
import ProfileScreen from "./Screens/mainScreen/ProfileScreen";

import { AntDesign } from '@expo/vector-icons';
import { SimpleLineIcons } from '@expo/vector-icons';

const AuthStack = createStackNavigator();
const MainTab = createBottomTabNavigator();

export const useRoute = (isAuth) => {
    if (!isAuth) {
        return (
            <AuthStack.Navigator>
            <AuthStack.Screen
                options={{headerShown: false}}
                name="Login"
                component={LoginScreen}
            />
            <AuthStack.Screen
                options={{ headerShown: false }}
                name="Register"
                component={RegistrationScreen}
            />
            </AuthStack.Navigator>
        );
    }
    return (
        <MainTab.Navigator
            screenOptions={{
                tabBarShowLabel: false,
                tabBarInactiveTintColor: '#BDBDBD',
                tabBarActiveTintColor: '#FF6C00',
                tabBarStyle: {
                    height: 82,
                },
            }}
        >
        <MainTab.Screen
            options={{
                headerShown: false,
                tabBarIcon: ({ focused, size, color }) => (
                <View style={styles.btnPostsScreen}>
                    <AntDesign name="appstore-o" size={24} color={color} />
                </View>
                ),
            }}
            name="PostsScreen"
            component={PostsScreen}
        />

        <MainTab.Screen
            options={{
                headerShown: false,
                tabBarIcon: ({ focused, size, color }) => (
                    <View style={styles.btnCreatePostsScreen}>
                        <Image
                            source={require("./assets/images/new.png")}
                            style={{
                                width: 35,
                                height: 35,
                            }}
                        />
                    </View>
                ),
            }}
            name="CreatePostsScreen"
            component={CreatePostsScreen}
        />
        <MainTab.Screen
            options={{
                headerShown: false,
                tabBarIcon: ({ focused, size, color }) => (
                    <View style={styles.btnProfileScreen}>
                        <SimpleLineIcons name="user" size={24} color={color} />
                    </View>
                ),
            }}
            name="ProfileScreen"
            component={ProfileScreen}
        />
    </MainTab.Navigator>
    );
};

const styles = StyleSheet.create({
    btnPostsScreen: {
        marginRight: -39
    },

    btnCreatePostsScreen: {
        width: 70,
        height: 40,
        justifyContent: "center",
        alignItems: "center",
        color: "#FFFFFF",
        borderRadius: 20,
        backgroundColor: "#FF6C00",
    },

    btnProfileScreen: {
        marginLeft: -39
    }
});