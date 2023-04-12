import React, {useState, useEffect} from 'react';
import { StyleSheet, Image, Text, View, FlatList, TouchableOpacity, Dimensions } from 'react-native';

import { useDispatch, useSelector } from 'react-redux';
import { authSignOutUser } from "../../redux/auth/authOperations";

import { db } from '../../firebase/config';
import { collection, getDocs, addDoc, doc, onSnapshot, deleteDoc } from "firebase/firestore";

import { Feather } from '@expo/vector-icons'; 
import { SimpleLineIcons } from '@expo/vector-icons';
import { FontAwesome5 } from '@expo/vector-icons';
import { AntDesign } from '@expo/vector-icons';

const width = Math.round(Dimensions.get('window').width);
const height = Math.round(Dimensions.get('window').height);
const flatListHeight = height - 82 - 83 - 122;

const DefaultScreen = ({route, navigation}) => {

    const dispatch = useDispatch();
    const signOut = () => {
        dispatch(authSignOutUser());
    };

    const [posts, setPosts] = useState([]);

    const {nickName, email, avatarUrl} = useSelector((state) => state.auth);

    useEffect(() => {
        const unsubscribe = navigation.addListener('focus', () => {
            getAllPosts();
        });
        return unsubscribe;
    }, [navigation]);

    const getAllPosts = async () => {
        setPosts([]);
        let arrPosts = [];
        const querySnapshotPosts = await getDocs(collection(db, "posts"));
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
                                const isLikeUser = addLikesInfo(arrLikes);
                                /////////////
                                const postInfo = {...docPost.data(), id: `${docPost.id}`, numberLikes: arrLikes.length, numberComment: arrComments.length, likesUser: isLikeUser.isLikePost, likeUserId: isLikeUser.likeId};
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


    const addLikesInfo = (dataLike) => {
        let isLikePost = false;
        let likeId = "";
        if(dataLike) {
            dataLike.find(arr => {
                if (arr.likeOwner === nickName) {
                    isLikePost = true;
                    likeId = arr.likeId;
                }
            });
        };
        return {isLikePost, likeId};
    };

    const sendData = () => {
        navigation.navigate('MapScreen', {posts});
    };

    const sendLike = async (postId, ownerLike, ownerLikeId) => {
        if(ownerLike) {
            const postsRef = doc(db, 'posts', `${postId}`, 'likes', `${ownerLikeId}`);
            await deleteDoc(postsRef);
        } else {
            await addDoc(collection(doc(collection(db, "posts"), postId), "likes"),
            {likeOwner: nickName, postId: postId});
        }
        getAllPosts();
    };
    
    return (
        <View style={styles.container}>
            <View style= {styles.pageTitle}>
                <Text style= {styles.textTitle}>Posts</Text>
            </View>
            <View style= {styles.iconLogout}>
                <Feather name="log-out" size={24} color="#BDBDBD" onPress={signOut} />
            </View>
            <View style= {styles.iconMap}>
            <TouchableOpacity 
                activeOpacity={0.8} 
                onPress={sendData}
            >
                <FontAwesome5 name="map-marked-alt" size={24} color="#BDBDBD" />
            </TouchableOpacity>
            </View>

            <View style= {styles.userBox}>
                <View style= {styles.userBoxPosition}>
                    <View>
                        <Image
                            style={{ width: 60, height: 60, borderRadius: 16 }}
                            source={{uri: avatarUrl}}
                        ></Image>
                    </View>
                    <View style= {styles.userInfo}>
                        <Text style= {styles.usersName}>{nickName}</Text>
                        <Text style= {styles.usersEmail}>{email}</Text>
                    </View>
                </View>
            </View>

            <View style={{height: height - 82 - 83, marginBottom: 83, marginHorizontal: 16}}>
                <FlatList
                    data={posts}
                    keyExtractor={(item) => item.id}
                    renderItem={({ item }) => (
                    <View style= {styles.postsBox}>
                        <Image
                            style={{width: width - 32,height: width * 0.65, borderRadius: 16, marginBottom: 8}}
                            source={{uri: item.photoUri}}
                        />
                        <View style= {styles.postsInfo}>
                            <Text style= {styles.postsName}>{item.postName}</Text>
                            <View>
                                <View style= {styles.comments}>
                                    <Feather name="message-circle" size={18} color="#BDBDBD" onPress={() => {
                                        const posts = [item]
                                        navigation.navigate('CommentsScreen', {posts})
                                    }}/>
                                    <Text style= {styles.infoText}>{item.numberComment}</Text>
                                    <AntDesign name="like2" size={19} color={item.likesUser ? "#FF6C00" : "#BDBDBD" } onPress={() => {
                                        sendLike(item.id, item.likesUser, item.likeUserId);
                                    }}/>
                                    <Text style= {styles.infoText}  onPress={() => {
                                        sendLike(item.id, item.likesUser, item.likeUserId)}}>{item.numberLikes}</Text>
                                </View>
                                <View style= {styles.location}>
                                    <SimpleLineIcons name="location-pin" size={18} color="#BDBDBD" onPress={() => {
                                        const posts = [item];
                                        navigation.navigate('MapScreen', {posts})
                                    }}/>
                                    <Text style= {styles.infoText}>{item.photoLocation}</Text>
                                </View>
                            </View>
                        </View>
                    </View>
                    )}/> 
            </View>
        </View>
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
    iconLogout: {
        position: 'absolute',
        top: 50,
        right: 15,
    },
    iconMap: {
        position: 'absolute',
        top: 50,
        left: 15,
    },
    userBox: {
        display: 'flex',
        flexDirection: 'row',
        justifyContent: 'center',
        marginTop: 32,
        marginLeft: 16,
        marginBottom: 32,
        
    },
    userBoxPosition: {
        display: 'flex',
        flexDirection: 'row',
        width: 345,
    },
    userInfo: {
        marginTop: 8,
        marginLeft: 8,
    },
    usersName: {
        fontSize: 13,
        color: '#212121',
    },
    usersEmail: {
        fontSize: 11,
        color: '#212121',
    },
    postsBox: {
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
});

export default DefaultScreen;