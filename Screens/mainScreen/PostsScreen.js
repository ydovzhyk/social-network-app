import React from "react";
import { createStackNavigator } from "@react-navigation/stack";

import DefaultScreen from "../nestedScreens/DefaultScreen";
import MapScreen from "../nestedScreens/MapScreen";
import CommentsScreen from "../nestedScreens/CommentsScreen";

const NestedScreen = createStackNavigator();

const PostsScreen = () => {
    return (
    <NestedScreen.Navigator
    screenOptions={{
        headerShown: false,
        tabBarShowLabel: false,
        lazyLoad: true,
        tabBarStyle: {
            borderTopWidth: 1,
            position: 'absolute',
            height: 83
        },
    }}
        >
        <NestedScreen.Screen name="DefaultScreen" component={DefaultScreen} />
        <NestedScreen.Screen name="MapScreen" component={MapScreen} />
        <NestedScreen.Screen name="CommentsScreen" component={CommentsScreen} />
    </NestedScreen.Navigator>
    )
}

export default PostsScreen;

