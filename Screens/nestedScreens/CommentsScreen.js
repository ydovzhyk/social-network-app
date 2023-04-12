import React, {useState, useEffect} from 'react';
import { useSelector } from 'react-redux';

import { db } from '../../firebase/config';
import { collection, addDoc, doc, onSnapshot } from "firebase/firestore";

import { StyleSheet, Image, Text, View, TextInput, TouchableOpacity, Dimensions, KeyboardAvoidingView, Keyboard, TouchableWithoutFeedback, FlatList } from 'react-native';

import { MaterialCommunityIcons } from '@expo/vector-icons';
import { AntDesign } from '@expo/vector-icons';

const initialState = {
    commentData: '',
    nickName: '',
    commentOwnerUrl: '',
    dateComment: '',
}

const width = Math.round(Dimensions.get('window').width);
const height = Math.round(Dimensions.get('window').height);

const CommentsScreen = ({route, navigation}) => {

    const [isShowKeyboard, setIsShowKeyboard] = useState(false);
    const [posts, setPosts] = useState({});
    const [comment, setComment] = useState(initialState);
    const [allComments, setAllComments] = useState([]);

    const postId = route.params.posts[0].id;
    const { nickName, avatarUrl } = useSelector((state) => state.auth);

    useEffect(() => {
        if(route.params) {
            setPosts(...route.params.posts);
            getAllComments();
        }
    }, [route.params]);

    const keyboardHide = () => {
        setIsShowKeyboard(false);
        Keyboard.dismiss();
    }

    const createPost = async () => {
        await addDoc(collection(doc(collection(db, "posts"), postId), "comments"),
        {...comment});
        setComment(initialState);
    };

    const getAllComments = async () => {
        await onSnapshot(
            collection(doc(collection(db, "posts"), postId), "comments"),
            (data) => {
                const arrComments = data.docs.map((doc) => ({ ...doc.data(), id: doc.id }));
                setAllComments(arrComments.sort((x, y) => x.dateComment - y.dateComment))
            }
        );
    };

    const convertDate = (dateToConvert) => {
        const date = new Date(dateToConvert).toLocaleString();
        return date;
    }

    return (
        <View style={styles.container}>
            <View style= {styles.pageTitle}>
                <Text style= {styles.textTitle}>Comments</Text>
            </View>
            <View style= {styles.iconArrowLeft}>
                <MaterialCommunityIcons name="arrow-left" size={24} color="#BDBDBD" onPress={() => {navigation.goBack(), setComment(initialState)}}/>  
            </View>

            <View style= {{...styles.postBoxPart, marginBottom: 125, marginTop: isShowKeyboard ? -170: 32}}>
                <Image
                    style={{width: width - 32,height: width * 0.65, borderRadius: 16, marginBottom: 32}}
                    source={{uri: posts.photoUri}}
                />
                <View style={{ marginBottom: 185}}>  
                    <TouchableWithoutFeedback onPress={keyboardHide}>
                        <FlatList
                            keyboardDismissMode="interactive"
                            data={allComments}
                            keyExtractor={(item, index) => index.toString()}
                            renderItem={({ item }) => (                              
                                <View style= {styles.postsBox}>                                   
                                    {item.nickName === nickName ? 
                                    <View style= {styles.commentPart}>
                                        <Image
                                            style={styles.commentImage}
                                            source={{uri: item.commentOwnerUrl}}
                                        />
                                        <View style= {{...styles.commentInfo, marginLeft: 16}}>
                                            <Text style= {{...styles.commentText, marginLeft: 16}}>{item.commentData}</Text>
                                            <View style= {{display: "flex", alignItems: "flex-end", marginLeft: 16, marginRight: 16}}>
                                                <Text style={styles.dateText}>{`${convertDate(item.dateComment)}`}</Text>
                                            </View>
                                        </View>
                                    </View> : 
                                        <View style= {styles.commentPart}>
                                            <View style= {{...styles.commentInfo, marginRight: 16}}>
                                                <Text style= {{...styles.commentText, marginLeft: 16}}>{item.commentData}</Text>
                                                <Text style={{...styles.dateText, marginLeft: 16}}>{`${convertDate(item.dateComment)}`}</Text>
                                            </View>
                                            <Image
                                                style={{...styles.commentImage}}
                                                source={{uri: item.commentOwnerUrl}}
                                            />
                                        </View>}
                                </View>
                                )}/>
                    </TouchableWithoutFeedback>
                </View>
            </View>
            <View style={{...styles.inputContainer, bottom: 83, position: 'absolute', bottom: 0 }}>
                <View style={styles.inputBackground}>
                    <TextInput 
                        style={styles.inputForm}  
                        maxLength={40} 
                        placeholder={'Type your comment'}
                        placeholderTextColor={"#BDBDBD"}
                        value={comment.commentData}
                        onChangeText={(value) => setComment((prevState) => ({...prevState, commentData: value, commentOwnerUrl: avatarUrl, nickName: nickName, dateComment: Date.now()}))}
                        onFocus={() => setIsShowKeyboard(true)}
                    />
                    <TouchableOpacity 
                        activeOpacity={0.8} 
                        style={styles.btn}
                        onPress={() => createPost()}
                    >
                    <AntDesign name="arrowup" size={20} color="#FFFFFF" />
                    </TouchableOpacity>
                </View>
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
        borderColor: 'red',
        borderWidth: 1,
    },
    pageTitle: {
        position: "relative",
        display: "flex",
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
    postBoxPart: {
        flex: 1,
        display: "flex",
        flexDirection: "column",
        // alignItems: "center",
        marginHorizontal: 16,
    },
    postsBox: {
        display: "flex",
        alignItems: 'center',
    },
    commentPart: {
        display: "flex",
        flexDirection: "row",
        marginBottom: 24,
    },
    commentImage:{
        width:28, 
        height: 28, 
        borderRadius: 16, 
    },
    commentInfo: {
        display: "flex",
        backgroundColor: 'rgba(0, 0, 0, 0.05)',
    },
    commentInfoPosition: {
        marginHorizontal: 16,
    },
    commentText: {
        marginTop: 16,
        marginBottom: 8,
        fontSize: 13,
        width: width - 96, 
    },
    dateText: {
        marginBottom: 16,
        fontSize: 10,
        color: "#BDBDBD",
    },
    inputContainer: {
        position: "absolute",
        width: width,
    },
    inputBackground: {
        marginHorizontal: 16,
        position: "relative",
        marginBottom: 16,
        height: 50,
        borderRadius: 100,
        borderColor: "#FF6C00",
        borderWidth: 1,
        backgroundColor: "#F6F6F6",
    },
    inputForm: {
        marginHorizontal: 16,
        height: 50,
        fontSize: 16,
        textAlign: 'left',
    },
    btn: {     
        position: "absolute",
        top: 8,
        right: 8,
        backgroundColor: "#FF6C00",
        height: 34,
        width: 34,
        borderRadius: 100,
        justifyContent: "center",
        alignItems: "center",
    },
});

export default CommentsScreen;