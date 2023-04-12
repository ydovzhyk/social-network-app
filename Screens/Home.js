import { StatusBar } from 'expo-status-bar';
import { StyleSheet, ImageBackground, Text, View, TextInput, TouchableOpacity, Platform, KeyboardAvoidingView, Keyboard, TouchableWithoutFeedback } from 'react-native';

const Home = ({navigation}) => {

    return (
        <TouchableWithoutFeedback>
            <View style={styles.container}>
                <ImageBackground
                    style={styles.image}
                    source={require('../assets/images/photoBG.jpg')}
                >
                <KeyboardAvoidingView
                behavior={Platform.OS === "ios" ? "padding" : "height"}
                >
                    <View style= {styles.registerContainer}>

                    </View>
                </KeyboardAvoidingView>
                    <StatusBar style="auto" />
                </ImageBackground>
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
        height: 750,
    },
});

export default Home;