import React, {useState, useEffect} from 'react';
import { StyleSheet, Text, View, } from 'react-native';
import MapView, {Marker} from 'react-native-maps';
import urid from 'urid'; 

import { MaterialCommunityIcons } from '@expo/vector-icons';
const { LATITUDE, LONGITUDE } = process.env;

const initialRegionState = {
    latitude: '',
    longitude: '',
}

const MapScreen = ({route, navigation}) => {

    const [posts, setPosts] = useState([]);

    useEffect(() => {
        if(route.params) {
            setPosts(prevState => [...prevState, ...route.params.posts]);
        }
    }, [route.params]);

    const dataInfo = () => {
        if(posts.length === 0) {
            return;
        } else {
            const dataForRender = [];
            for(let i = 0; i < posts.length; i++) {
                const arrData = [];
                arrData.push(`${posts[i].latitude}` ? parseFloat(posts[i].latitude) : LATITUDE, `${posts[i].longitude}` ? parseFloat(posts[i].longitude) : LONGITUDE, `${posts[i].postName}` ? posts[i].postName.replace(/["']/g,'') : "No name");

                dataForRender.push(arrData);
                initialRegionState.latitude = `${posts[posts.length - 1].latitude}` ? parseFloat(posts[posts.length - 1].latitude) : LATITUDE;
                initialRegionState.longitude = `${posts[posts.length - 1].longitude}` ? parseFloat(posts[posts.length - 1].longitude) : LONGITUDE;
            }
                return dataForRender;
        }
    }

    const newData = dataInfo();

    const clearState = () => {
        setPosts([]);
    }

    return (
    <View style={styles.container}>
        <View style= {styles.pageTitle}>
            <Text style= {styles.textTitle}>Map</Text>
        </View>
        <View style= {styles.iconArrowLeft}>
            <MaterialCommunityIcons name="arrow-left" size={24} color="#BDBDBD" onPress={() => {navigation.goBack(), clearState()}}/>  
        </View>
        <MapView style={styles.map} initialRegion={{
            latitude: initialRegionState.latitude,
            longitude: initialRegionState.longitude,
            latitudeDelta: 0.0922,
            longitudeDelta: 0.0421,
            }}
        >   
            {newData && newData.map((m)=><Marker
                key={urid()}
                coordinate={{
                    latitude: m[0],
                    longitude: m[1],
                }}
                title={`${m[2]}`}
                ></Marker>)}            
        </MapView>

    </View>
    )
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
        justifyContent: 'flex-start',
        position: "relative",
        backgroundColor: '#FFFFFF',
    },
    pageTitle: {
        position: "relative",
        display: "flex",
        justifyContent: 'center',
        alignItems: 'center',
        height: 88,
        backgroundColor: '#FFFFFF',
        borderBottomWidth: 2,
        borderBottomColor: '#E8E8E8',
    },
    textTitle: {
        marginTop: 50,
        fontSize: 18,
    },
    iconArrowLeft: {
        position: 'absolute',
        top: 50,
        left: 10,
    },
    map: {
        flex: 1,
    }
})

export default MapScreen;