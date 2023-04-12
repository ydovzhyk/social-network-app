import { StatusBar } from 'expo-status-bar';
import { useState } from 'react';
import { StyleSheet, ImageBackground, Text, View, TextInput, TouchableOpacity, Keyboard, TouchableWithoutFeedback } from 'react-native';
import { useDispatch } from 'react-redux';

import {Gravatar, GravatarApi} from 'react-native-gravatar';

import { authSignUpUser } from "../redux/auth/authOperations";

const initialState = {
    nickName: '',
    email: '',
    password: '',
    avatarUrl: '',
}

const RegistrationScreen = ({navigation}) => {
    const [isShowKeyboard, setIsShowKeyboard] = useState(false);
    const [isEmailCompleted, setIsEmailCompleted] = useState(false);
    const [state, setState] = useState(initialState);
    const [statePassword, setStatePassword] = useState(true);

    const dispatch = useDispatch();

    const keyboardHide = () => {
        setIsShowKeyboard(false);
        Keyboard.dismiss();
    }

    const handleSubmit = () => {
        dispatch(authSignUpUser(state));
        setState(initialState);
    }

    const getAvatar = () => {
        let emailAvatar = '';
        let avatarUrl = '';
        if(isEmailCompleted) {
            emailAvatar = `${state.email}`;
            const options = {
                email: `${state.email}`
            } 
            avatarUrl = GravatarApi.imageUrl(options);
        } else {
            emailAvatar = 'test@gmail.com';
            const options = {
                email: 'test@gmail.com'
            } 
            avatarUrl = GravatarApi.imageUrl(options);
        }
        return {emailAvatar: emailAvatar, avatarUrl: avatarUrl};
    }
    
    return (
        <TouchableWithoutFeedback onPress={keyboardHide}>
            <View style={styles.container}>
                <ImageBackground
                    style={styles.image}
                    source={require('../assets/images/photoBG.jpg')}
                >
                <View style={{...styles.registerContainer, marginBottom: isShowKeyboard ? -60: 0}}>
                    <View style={styles.registerBox}>
                        <View style={styles.photoBox}>
                        <Gravatar options={{
                            email: `${getAvatar().emailAvatar}`,
                            parameters: {"size": "200", "d": "mm"},
                            secure: true
                            }}
                        style={styles.photoPlace} />
                        </View>

                    <Text style={styles.boxTitle}>Registration</Text>

                    <View style={styles.form}>
                        <View style={styles.inputBackground}>
                            <TextInput 
                                style={styles.inputForm} 
                                placeholder={'Nickname'} 
                                maxLength={40}
                                placeholderTextColor={"#BDBDBD"}
                                value={state.nickName}
                                onFocus={() => setIsShowKeyboard(true)}
                                onChangeText={(value) => setState((prevState) => ({...prevState, nickName: value}))}
                            />
                        </View>
                        <View style={styles.inputBackground}>
                            <TextInput 
                                style={styles.inputForm} 
                                placeholder={'Email'} 
                                maxLength={40}
                                placeholderTextColor={"#BDBDBD"}
                                value={state.email}
                                onFocus={() => {
                                    setIsShowKeyboard(true);
                                    setIsEmailCompleted(true);
                                }}
                                onBlur={() => setState((prevState) => ({...prevState, avatarUrl: `${getAvatar().avatarUrl}`}))}
                                onChangeText={(value) => setState((prevState) => ({...prevState, email: value}))}
                            />
                        </View>
                        <View style={styles.inputPassword} >
                            <View style={styles.inputBackground}>
                                <TextInput 
                                    style={styles.inputForm} 
                                    placeholder={'Password'} 
                                    maxLength={40} 
                                    secureTextEntry={statePassword}
                                    placeholderTextColor={"#BDBDBD"}
                                    value={state.password}
                                    onFocus={() => setIsShowKeyboard(true)}
                                    onChangeText={(value) => setState((prevState) => ({...prevState, password: value}))}
                                />
                            </View>

                            <TouchableOpacity 
                                activeOpacity={0.8} 
                                style={styles.btnPassword}
                                onPress={() => {
                                    if(!statePassword) {
                                        setStatePassword(true)
                                    } else {
                                        setStatePassword(false)
                                    }
                                    }}
                            >
                                <Text style={styles.btnPasswordTitle}>{statePassword ? "Show" : "Hide"}</Text>
                            </TouchableOpacity>
                        </View>
                        <TouchableOpacity 
                            activeOpacity={0.8} 
                            style={styles.btn}
                            onPress={handleSubmit}
                        >
                            <Text style={styles.btnTitle}>Register</Text>
                        </TouchableOpacity>
                    </View>
            
                    <TouchableOpacity
                        activeOpacity={0.8} 
                        style={styles.navLoginBtn}
                        onPress={() => navigation.navigate('Login')}
                    >
                        <Text style={styles.navLoginText}>Already have an account? Enter</Text>
                    </TouchableOpacity>
                    </View>
                </View>
                </ImageBackground>
            <StatusBar style="auto" />
            </View>
        </TouchableWithoutFeedback>
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
        justifyContent: "flex-end",
    },
    registerContainer: {
        display: "flex",
        justifyContent: "flex-end",
    },
    registerBox: {
        display: "flex",
        justifyContent: 'flex-end',
        height: 549,
        backgroundColor: "#FFFFFF",
        borderTopLeftRadius: 25,
        borderTopRightRadius: 25,
    },
    boxTitle: {
        marginBottom: 33,
        textAlign: "center",
        fontSize: 30,
    },
    photoBox: {
        marginBottom: 30,
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
        textAlign: "center",
        fontSize: 21,
    },
    form: {
        marginBottom: 16,
    },
    inputBackground: {
        marginBottom: 16,
        marginHorizontal: 16,
        borderWidth: 1,
        borderColor: "#E8E8E8",
        height: 50,
        borderRadius: 8,
        backgroundColor: "#F6F6F6",
    },
    inputForm: {
        marginHorizontal: 16,
        height: 50,
        fontSize: 16,
        textAlign: 'left',
    },
    inputPassword: {
        display: "flex",
        position: "relative",
    },
    btnPassword: {
        position:"absolute",
        alignItems: "center",
        marginTop: 14,
        marginHorizontal: 16,
        marginRight: 20,
        right: 0,
        width: 60,
    },
    btnPasswordTitle: {
        fontSize: 16,
        color: "#1B4371",
    },
    btn: {
        marginHorizontal: 16,
        marginTop: 27,        
        backgroundColor: "#FF6C00",
        height: 51,
        borderRadius: 100,
        justifyContent: "center",
        alignItems: "center",
    },
    btnTitle: {
        color: "#FFFFFF",
        fontSize: 16,
    },
    navLoginBox:{
        display: "flex",
        flexDirection: "row",
        justifyContent: "center",
    },
    navLoginText: {
        color: "#1B4371",
        fontSize: 16,
    },
    navLoginBtn: {
        alignItems: "center",
        marginBottom: 78,
    }
});

export default RegistrationScreen;