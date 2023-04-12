import React from "react";

import { StyleSheet, View, Image } from 'react-native';

import { createStackNavigator } from '@react-navigation/stack';
import { createBottomTabNavigator } from "@react-navigation/bottom-tabs";

import RegistrationScreen from "./Screens/RegistrationScreen";
import LoginScreen from "./Screens/LoginScreen";
import PostsScreen from "./Screens/PostsScreen";
import CreatePostsScreen from "./Screens/CreatePostsScreen";
import ProfileScreen from "./Screens/ProfileScreen";
import { AntDesign } from '@expo/vector-icons';
import { SimpleLineIcons } from '@expo/vector-icons';

//! Icons
import { MaterialCommunityIcons } from "@expo/vector-icons";
import { Ionicons } from "@expo/vector-icons";
import { Octicons } from "@expo/vector-icons";

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