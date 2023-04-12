import React, {useState, useEffect} from 'react';
import { Camera, CameraType } from 'expo-camera';
import { useSelector } from 'react-redux';

import * as Location from 'expo-location';

import { useIsFocused } from '@react-navigation/native';

import { storage, db } from '../../firebase/config';
import { ref, uploadBytes, getDownloadURL } from "firebase/storage";
import { collection, addDoc } from "firebase/firestore";

import urid from 'urid'; 

import { MaterialCommunityIcons } from '@expo/vector-icons';
import { SimpleLineIcons } from '@expo/vector-icons';
import { Fontisto } from '@expo/vector-icons';
import { Ionicons } from '@expo/vector-icons';

import { StyleSheet, Image, Text, View, TextInput, TouchableOpacity, Platform, KeyboardAvoidingView, Keyboard, TouchableWithoutFeedback, PermissionsAndroid } from 'react-native';
const { LATITUDE, LONGITUDE } = process.env;

const initialState = {
    postName: '',
    photoLocation: '',
    latitude: LATITUDE,
    longitude: LONGITUDE,
}

const CreatePostsScreen = ({navigation}) => {

    const [isShowKeyboard, setIsShowKeyboard] = useState(false);
    const [camera, setCamera] = useState(null);
    const [type, setType] = useState(CameraType.back);
    const [photo, setPhoto] = useState('');
    const [state, setState] = useState(initialState);

    const {userId, nickName} = useSelector((state) => state.auth)

    //Render Camera
    const isFocused = useIsFocused();

    // Camera permission
    const requestCameraPermission = async () => {
        const granted = await PermissionsAndroid.request(PermissionsAndroid.PERMISSIONS.CAMERA)
            if (granted === PermissionsAndroid.RESULTS.GRANTED) {
                return;
            } else {
                try {
                    granted = await PermissionsAndroid.request(
                    PermissionsAndroid.PERMISSIONS.CAMERA,
                    {   title: 'Cool Photo App Camera Permission',
                        message:
                            'Cool Photo App needs access to your camera ' +
                            'so you can take awesome pictures.',
                        buttonNeutral: 'Ask Me Later',
                        buttonNegative: 'Cancel',
                        buttonPositive: 'OK',
                    },
                    )
                } catch (err) {
                    alert(err);
                }}};

    const toggleCameraType = () => {
        setType(current => (current === CameraType.back ? CameraType.front : CameraType.back));
    }

    const createPhoto = async () => {
        requestCameraPermission();
        const photo = await camera.takePictureAsync();
        setPhoto(photo.uri);

        let { coords } = await Location.getCurrentPositionAsync();

        if (coords) {
            const { latitude, longitude } = coords;
            setState((prevState) => ({...prevState, latitude: `${latitude}`, longitude: `${longitude}`}))
            let response = await Location.reverseGeocodeAsync({
                latitude,
                longitude
            });
        
            for (let item of response) {
                let address = `${item.city}, ${item.region}, ${item.country}`;
                setState((prevState) => ({...prevState, photoLocation: `${address}`}));
            }
        }
    }

    const uploadPhotoToServer = async () => {
        let linkPhoto = '';
        const uniquePhotoName = urid();
        const storageRef = ref(storage, `images/${uniquePhotoName}.jpg`);
        const resp = await fetch(photo);
        const blob = await resp.blob();

        try {
            await uploadBytes(storageRef, blob);
            await getDownloadURL(ref(storage, storageRef))
                .then((url) => {
                    linkPhoto = url;
                })
        } catch (error) {
            alert("Something went wrong, please try again");
            console.log("error", error);
            console.log("error message", error.message);
        }
        return linkPhoto;
    };

    const keyboardHide = () => {
        setIsShowKeyboard(false);
        Keyboard.dismiss();
    }

    const deletePhoto = () => {
        setPhoto('');
        setState(initialState);
    }

    const uploadPostToServer = async () => {
        try {
            const linkPhoto = await uploadPhotoToServer();
            await addDoc(collection(db, "posts"), {...state, photoUri: `${linkPhoto}`, userId, nickName, datePost: Date.now()});
        } catch (error) {
            alert("Something went wrong, please try again");
            console.log("error", error);
            console.log("error message", error.message);
        }
    }

    const sendData = async () => {
        await uploadPostToServer();
        navigation.navigate('DefaultScreen');
        setPhoto('');
        setState(initialState);
    }

    return (
        <TouchableWithoutFeedback onPress={keyboardHide}>
            <View style={styles.container}>
                <KeyboardAvoidingView
                behavior={Platform.OS === "ios" ? "padding" : "height"}
                >
                    <View style= {styles.pageTitle}>
                        <Text style= {styles.textTitle}>Create post</Text>
                    </View>

                    <View style= {styles.postBox}>
                    
                        {isFocused && <Camera style={{...styles.camera, marginTop: isShowKeyboard ? -165: 0}} ref={setCamera} type={type}>
                            <View style={styles.switchCameraContainer}>
                                <TouchableOpacity onPress={toggleCameraType}>
                                    <View {...photo ? styles.cameraSnapPhoto : styles.cameraSnap}>
                                        <Ionicons name="camera-reverse-sharp" size={25} {...photo ? styles.iconColorPhoto : styles.iconColorSnap}/>
                                    </View>
                                </TouchableOpacity>
                            </View>
                            {photo && <Image source={{uri: photo}} style={styles.photo}/>}
                            <TouchableOpacity onPress={createPhoto}>
                                <View {...photo ? {...styles.cameraSnapPhoto, width: 60, height: 60} : {...styles.cameraSnap, width: 60, height: 60}} >
                                    <Fontisto name="camera" size={20} {...photo ? styles.iconColorPhoto : styles.iconColorSnap} />
                                </View>
                            </TouchableOpacity>
                        {photo && <View style={styles.deletePhotoContainer}>
                            <TouchableOpacity onPress={deletePhoto}>
                                <View style={styles.cameraSnapPhoto}>
                                    <MaterialCommunityIcons name="delete-outline" size={24} color='#FFFFFF' />
                                </View>
                            </TouchableOpacity>
                        </View>
                        }
                    </Camera>}

                    <View style= {styles.postsInfo}>
                        {!photo && <Text style= {styles.postsName}>Add Photo</Text>}
                        {photo && <Text style= {styles.postsName}>Edit Photo</Text>}

                        <View style={styles.inputBackground}>
                            <TextInput 
                                style={styles.inputForm} 
                                placeholder={'Photo Name'} 
                                maxLength={40} 
                                placeholderTextColor={"#BDBDBD"}
                                value={state.postName}
                                onFocus={() => setIsShowKeyboard(true)}
                                onChangeText={(value) => setState((prevState) => ({...prevState, postName: value}))}
                            />
                        </View>
                        
                        <View style={styles.inputBackground}>
                            <View style={styles.locationIconPosition}>
                                <SimpleLineIcons name="location-pin" size={18} color="#BDBDBD" />
                            </View>
                            <TextInput 
                                style={styles.inputForm} 
                                placeholder={'Photo Location'} 
                                maxLength={40} 
                                placeholderTextColor={"#BDBDBD"}
                                value={state.photoLocation}
                                onFocus={() => setIsShowKeyboard(true)}
                                onChangeText={(value) => setState((prevState) => ({...prevState, photoLocation: value}))}
                            />
                        </View>
                        <TouchableOpacity 
                            activeOpacity={0.8} 
                            style={{...styles.btn, backgroundColor: photo ? "#FF6C00" : "#F6F6F6"}}
                            onPress={sendData}
                        >
                            <Text style={{...styles.btnTitle, color: photo ? "#F6F6F6" : "#BDBDBD"}}>Publish</Text>
                        </TouchableOpacity>
                    </View>
                    
                        
                    </View>
                </KeyboardAvoidingView>
            </View>
        </TouchableWithoutFeedback>
    );
}

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
    postBox: {
        display: "flex",
        alignItems: 'center',
        marginTop: 32,
        marginHorizontal: 16,
    },
    camera: {
        marginBottom: 8,
        position: 'relative',
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'center',
        width: 345,
        height: 240,
        borderRadius: 16,
    },
    switchCameraContainer: {
        position: 'absolute',
        right: 20,
        top: 20,
    },
    deletePhotoContainer:{
        position: 'absolute',
        left: 20,
        top: 20,
    },
    photo: {
        position: 'absolute',
        top: 0,
        left: 0,
        width: 345,
        height: 240,
    },
    cameraSnap: {
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'center',
        width: 40,
        height: 40,
        borderRadius: 50,
        backgroundColor: '#FFFFFF',
    },
    cameraSnapPhoto: {
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'center',
        width: 40,
        height: 40,
        borderRadius: 50,
        backgroundColor: 'rgba(255, 255, 255, 0.3)',
    },
    iconColorSnap: {
        color: '#BDBDBD',
    },
    iconColorPhoto: {
        color: '#FFFFFF',
    },
    postsInfo: {
        display: 'flex',
        position: 'relative',
        width: 345,
    },
    postsName: {
        marginBottom: 32,
        textAlign: 'left',
        fontSize: 16,
        color: '#212121',
    },
    inputBackground: {
        display: 'flex',
        flexDirection: 'row',
        marginBottom: 26,
        borderWidth: 1,
        textAlign: 'left',
        borderColor: '#FFFFFF',
        borderBottomColor: '#E8E8E8',
    },
    inputForm: {
        height: 50,
    },
    locationIconPosition: {
        marginTop: 14,
        marginRight: 8,
    },
    btn: {    
        height: 51,
        borderRadius: 100,
        justifyContent: "center",
        alignItems: "center",
    },
    btnTitle: {
        fontSize: 16,
    },
});

export default CreatePostsScreen;