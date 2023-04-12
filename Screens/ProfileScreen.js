import React, {useState, useEffect} from 'react';
import { useSelector } from 'react-redux';

import { StyleSheet, Image, Text, View, FlatList, TouchableOpacity, Dimensions, ImageBackground } from 'react-native';
import * as ImagePicker from 'expo-image-picker';

import urid from 'urid'; 

import { collection, getDocs, doc, onSnapshot, deleteDoc, where, query } from "firebase/firestore";
import { storage, db } from '../firebase/config';
import { ref, uploadBytes, getDownloadURL } from "firebase/storage";

import { useDispatch } from 'react-redux';
import { updateUserData } from "../redux/auth/authOperations";
import { authSignOutUser, authDeleteUser } from "../redux/auth/authOperations";

import { Ionicons } from '@expo/vector-icons';
import { Feather } from '@expo/vector-icons'; 
import { SimpleLineIcons } from '@expo/vector-icons';
import { AntDesign } from '@expo/vector-icons';
import { MaterialCommunityIcons } from '@expo/vector-icons';

const width = Math.round(Dimensions.get('window').width);
const height = Math.round(Dimensions.get('window').height);

const ProfileScreen = ({navigation}) => {

    const { nickName, avatarUrl, userId } = useSelector((state) => state.auth);
    const dispatch = useDispatch();
    const signOut = () => {
        dispatch(authSignOutUser());
    };
    const deleteUserAccount = () => {
        dispatch(authDeleteUser());
    };

    const [posts, setPosts] = useState([]);
    const [deleteAccount, setDeleteAccount] = useState(false);

    useEffect(() => {
        const unsubscribe = navigation.addListener('focus', () => {
            getAllPosts();
        });
        return unsubscribe;
    }, [navigation]);

    const pickImage = async () => {
        let result = await ImagePicker.launchImageLibraryAsync({
            mediaTypes: ImagePicker.MediaTypeOptions.All,
            allowsEditing: true,
            aspect: [1, 1],
            quality: 1,
        });
        if (!result.canceled) {
            uploadPhotoToServer(result.assets[0].uri);
        } else {
            return;
        }
    }

    const uploadPhotoToServer = async (data) => {
        let linkPhoto = '';
        const uniquePhotoName = urid();
        const storageRef = ref(storage, `avatar/${uniquePhotoName}.jpg`);
        const resp = await fetch(data);
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
        dispatch(updateUserData(linkPhoto));
    };

    const getAllPosts = async () => {
        setPosts([]);
        let arrPosts = [];
        
        const querySnapshotPosts = await getDocs(query(collection(db, "posts"), where("userId", "==", `${userId}`)));
            let docSize = querySnapshotPosts.size;
            querySnapshotPosts.forEach((docPost) => {
                onSnapshot(
                    collection(doc(collection(db, "posts"), docPost.id), "likes"),
                    (dataLikes) => {
                        onSnapshot(
                            collection(doc(collection(db, "posts"), docPost.id), "comments"),
                            (dataCommens) => {
                                docSize -= 1;
                                const arrLikes = dataLikes.docs.map((doc) => ({ ...doc.data(), likeId: doc.id}));
                                const arrComments = dataCommens.docs.map((doc) => ({ ...doc.data()}));
                                /////////////
                                const postInfo = {...docPost.data(), id: `${docPost.id}`, numberLikes: arrLikes.length, numberComment: arrComments.length};
                                arrPosts.push(postInfo);
                                if(docSize === 0) {
                                    setPosts(arrPosts.sort((x, y) => y.datePost - x.datePost));
                                }
                                ////////////
                                // setPosts((prevState) => ([...prevState, {...docPost.data(), id: `${docPost.id}`, numberLikes: arrLikes.length, numberComment: arrComments.length, likesUser: isLikeUser.isLikePost, likeUserId: isLikeUser.likeId}].sort((x, y) => y.datePost - x.datePost)));
                            },
                        );
                    },
                );
            }); 
    };

    const deletePhoto = async (data) => {
        try {
            const postsRef = doc(db, 'posts', `${data}`);
            await deleteDoc(postsRef);
            getAllPosts();
        } catch (error) {
            alert("Something went wrong, please try again");
            console.log("error", error);
            console.log("error message", error.message);
        }
    }

    return (
            <View style={styles.container}>
                <ImageBackground
                    style={styles.image}
                    source={require('../assets/images/photoBG.jpg')}
                >
                <View style= {styles.registerContainer}>

                {deleteAccount && <View style={{...styles.messageBlock, width: width - 32,}}>
                    <Text style={styles.messageBlockText}>Do you want delete account?</Text>
                    <View style={{...styles.btnPart, width: width-100}}>
                        <View>
                            <TouchableOpacity onPress={() => setDeleteAccount(false)}>
                                <View style={{...styles.btnStyle, backgroundColor: "#FF6C00" }}>
                                    <Text style={{...styles.btnText, color: "#F6F6F6"}}>Cancel</Text>
                                </View>
                            </TouchableOpacity>
                        </View>
                        <View>
                            <TouchableOpacity onPress={() => deleteUserAccount()}>
                                <View style={{...styles.btnStyle, backgroundColor: "#E8E8E8", right: 0 }}>
                                    <Text style={{...styles.btnText}}>Delete</Text>
                                </View>
                            </TouchableOpacity>
                        </View>
                    </View>
                </View>}

                <View style= {styles.iconLogout}>
                    <Feather name="log-out" size={24} color="#BDBDBD" onPress={signOut} />
                </View>
                <View style={styles.deleteAccountIconSet}>
                    <TouchableOpacity onPress={() => {!deleteAccount ? setDeleteAccount(true): setDeleteAccount(false)}}>
                        <View style={styles.deleteAccountIconStyle}>
                            <MaterialCommunityIcons name="delete-outline" size={18} color='#BDBDBD' />
                        </View>
                    </TouchableOpacity>
                </View>

                <View style={{...styles.registerBox, height: height - 190}}>
                    <View style={styles.photoBox}>
                        <View style={styles.photoPlace}>
                            <Image
                                style={{ width: 120, height: 120, borderRadius: 16 }}
                                source={{uri: avatarUrl}}
                            />
                        </View>
                        <TouchableOpacity 
                            activeOpacity={0.8} 
                            style={styles.photoAdd}
                            onPress={pickImage}
                        >
                            <Ionicons name="add-sharp" size={22} color="#FF6C00" />
                        </TouchableOpacity>
                    </View>
                    
                    <Text style={styles.boxTitle}>{nickName}</Text>

                        <FlatList
                            data={posts}
                            keyExtractor={(item) => item.id}
                            renderItem={({ item }) => (
                            <View style= {styles.postsBoxInfo}>
                                <Image
                                    style={{width: width - 32,height: width * 0.65, borderRadius: 16, marginBottom: 8}}
                                    source={{uri: item.photoUri}}
                                />
                                <View style={styles.deletePhotoContainer}>
                                    <TouchableOpacity onPress={() => deletePhoto(item.id)}>
                                        <View style={styles.cameraSnapPhoto}>
                                            <MaterialCommunityIcons name="delete-outline" size={24} color='#FFFFFF' />
                                        </View>
                                    </TouchableOpacity>
                                </View>
                                <View style= {styles.postsInfo}>
                                    <Text style= {styles.postsName}>{item.postName}</Text>
                                    <View>
                                        <View style= {styles.comments}>
                                            <Feather name="message-circle" size={18} color="#BDBDBD" onPress={() => {
                                                const posts = [item]
                                                navigation.navigate('CommentsScreen', {posts})
                                            }} />
                                            <Text style= {styles.infoText}>{item.numberComment}</Text>
                                            <AntDesign name="like2" size={19} color={item.likesUser ? "#FF6C00" : "#BDBDBD" }/>
                                            <Text style= {styles.infoText}>{item.numberLikes}</Text>
                                        </View>
                                        <View style= {styles.location}>
                                            <SimpleLineIcons name="location-pin" size={18} color="#BDBDBD" onPress={() => {
                                                const posts = [item];
                                                navigation.navigate('MapScreen', {posts})
                                            }} />
                                            <Text style= {styles.infoText}>{item.photoLocation}</Text>
                                        </View>
                                    </View>
                                </View>
                            </View>
                        )}/>   
                    </View>
                </View>   
            </ImageBackground>
        </View>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#fff',
        justifyContent: 'center',
    },
    image: {
        flex: 1,
        resizeMode: "cover",
    },
    registerContainer: {
        position: 'relative',
        display: "flex",
        marginTop: 147,
    },
    registerBox: {
        display: "flex",
        alignItems: 'center',
        backgroundColor: "#FFFFFF",
        borderTopLeftRadius: 25,
        borderTopRightRadius: 25,
    },
    boxTitle: {
        marginTop: 85,
        textAlign: "center",
        fontSize: 30,
        marginBottom: 30,
    },
    photoBox: {
        position:'absolute',
        marginTop: -60,
        display: "flex",
        flexDirection: "row",
        justifyContent: "center",
    },
    photoPlace: {
        width: 120,
        height: 120,
        backgroundColor: "#F6F6F6",
        borderRadius: 16,
    },
    photoAdd:{
        marginLeft: -15,
        marginTop: 81,
        width: 25,
        height: 25,
        backgroundColor: "#FFFFFF",
        borderRadius: 100,
        borderWidth: 1,
        borderColor: "#FF6C00",
        alignItems: 'center',
        fontSize: 21,
    },
    postsBoxInfo: {
        display: "flex",
        alignItems: 'center',
        marginBottom: 20,
    },
    postsInfo: {
        display: 'flex',
        position: 'relative',
        width: 345,
        marginBottom: 32,
    },
    postsName: {
        left: 8,
        marginBottom: 11,
        textAlign: 'left',
        fontSize: 16,
        color: '#212121',
    },
    comments: {
        position: 'absolute',
        left: 8,
        display: 'flex',
        flexDirection: 'row',
        alignItems: 'center',
    },
    location: {
        position: 'absolute',
        right: 0,
        display: 'flex',
        flexDirection: 'row',
        alignItems: 'center',
    },
    infoText: {
        fontSize: 16,
        color: '#212121',
        marginLeft: 9,
        marginRight: 9,
    },
    deletePhotoContainer: {
        position: 'absolute',
        right: 20,
        top: 20,
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
    deleteAccountIconSet: {
        position: 'absolute',
        marginTop: 21,
        left: 21,
        zIndex: 1,
    },
    deleteAccountIconStyle: {
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'center',
        width: 28,
        height: 28,
        borderWidth: 1.5,
        borderColor: "#BDBDBD",
        borderRadius: 50,
        backgroundColor: '#FFFFFF',
    },
    iconLogout: {
        position: 'absolute',
        marginTop: 21,
        right: 21,
        zIndex: 1,
    },
    messageBlock:{
        marginTop: 170,
        display: "flex",
        alignItems: "center",
        position: 'absolute',
        marginHorizontal: 16,
        backgroundColor: "#F6F6F6",
        height: 150,
        borderRadius: 25,
        borderWidth: 1,
        borderColor: "#FF6C00",
        elevation: 3,
        zIndex: 1,
    },
    messageBlockText: {
        marginTop: 25,
        marginBottom: 20,
        fontSize: 20,
    },
    btnPart: {
        position: "relative",
    },
    btnStyle: {
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        position: 'absolute',
        height: 45,
        width: 115,
        borderRadius: 25,
    },
    btnText: {
        fontSize: 17,
    },
});

export default ProfileScreen;