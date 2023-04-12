import { auth } from "../../firebase/config";
import { authSlice } from "./authReducer";
import { createUserWithEmailAndPassword, signInWithEmailAndPassword, updateProfile, onAuthStateChanged, signOut, deleteUser } from "firebase/auth";

const { updateUserProfile, authStateChange, authSignOut } = authSlice.actions;

export const authSignUpUser = ({nickName, email, password, avatarUrl}) => async (dispatch, getState) => {
    try {
        await createUserWithEmailAndPassword(auth, email, password);
        await updateProfile(auth.currentUser, {
            displayName: nickName, photoURL: avatarUrl,
        });
        const user = auth.currentUser;
        const uid = user.uid;
        const displayName = user.displayName;
        const photoURL = user.photoURL;
        const emailUser = user.email;
        dispatch(
            updateUserProfile({
                userId: uid,
                nickName: displayName,
                avatarUrl: photoURL,
                email: emailUser,
            })
        );

    } catch (error) {
        console.log("error", error);
        console.log("error message", error.message);
    }
};

export const authSignInUser = ({email, password}) => async (dispatch, getState) => {
    signInWithEmailAndPassword(auth, email, password)
        .then((userCredential) => {
        const user = userCredential.user;
    })
        .catch((error) => {
            console.log("error", error);
            console.log("error message", error.message);
    });
};

export const authSignOutUser = () => async (dispatch, getState) => {
    await signOut(auth)
    .then(() => {
        dispatch(authSignOut());
        alert('Sign-out successful!');
    }).catch((error) => {
        console.log("error", error);
        console.log("error message", error.message);
    });
};

export const authStateChangeUser = () => async (dispatch, getState) => {
    try {
        await onAuthStateChanged(auth, (user) => {
            if(user) {
                const uid = user.uid;
                const displayName = user.displayName;
                const photoURL = user.photoURL;
                const emailUser = user.email;
                dispatch(
                    updateUserProfile({
                        userId: uid,
                        nickName: displayName,
                        avatarUrl: photoURL,
                        email: emailUser,
                        })
                    );
                dispatch(
                    authStateChange({stateChange: true})
                );
            };
        });
    } catch (error) {
        console.log("error", error);
        console.log("error message", error.message);
    }
};

export const updateUserData = (data) => async (dispatch, getState) => {
    try {
        await updateProfile(auth.currentUser, {
            photoURL: data,
        });
        const user = auth.currentUser;
        const uid = user.uid;
        const displayName = user.displayName;
        const photoURL = user.photoURL;
        const emailUser = user.email;
        dispatch(
            updateUserProfile({
                userId: uid,
                nickName: displayName,
                avatarUrl: photoURL,
                email: emailUser,
            })
        );
    } catch (error) {
        console.log("error", error);
        console.log("error message", error.message);
    }
};

export const authDeleteUser = () => async (dispatch, getState) => {
    const user = auth.currentUser;
    await deleteUser(user).then(() => {
        dispatch(authSignOut());
        alert('User deleted!');
    }).catch((error) => {
        console.log("error", error);
        console.log("error message", error.message);
    });
};
