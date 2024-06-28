// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getAnalytics } from "firebase/analytics";
import { addDoc, collection, collectionGroup, deleteDoc, doc, getCountFromServer, getDoc, getDocs, getFirestore, limit, onSnapshot, query, serverTimestamp, setDoc, startAfter, updateDoc, where, writeBatch, } from "firebase/firestore";
import { getAuth } from "firebase/auth";
import { getStorage } from "firebase/storage";
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
// For Firebase JS SDK v7.20.0 and later, measurementId is optional
const firebaseConfig = {
    apiKey: process.env.NEXT_APP_API_KEY,
    authDomain: process.env.NEXT_APP_AUTH_DOMAIN,
    databaseURL: process.env.NEXT_APP_DATABASE_URL,
    projectId: process.env.NEXT_APP_PROJECT_ID,
    storageBucket: process.env.NEXT_APP_STORAGE_BUCKET,
    messagingSenderId: process.env.NEXT_APP_MESSAGING_SENDER_ID,
    appId: process.env.NEXT_APP_APPID,
    measurementId: process.env.NEXT_APP_MEASUREMENT_ID,
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
export const db = getFirestore(app);
const auth = getAuth(app);
const userAuth = getAuth(app);
export const firebaseStorage = getStorage(app);

const fireStoreService = {
    snapshotDocuments(collectionName: string, callback: any, options: any) {
        let constraints = [];
        if (options?.query2?.field) {
            constraints.push(where(options?.query2?.field, options?.query2?.operator, options?.query2?.value));
        }
        const q = query(collection(db, collectionName), ...constraints, ...(options?.lastVisible ? [limit(options?.limit), startAfter(options?.lastVisible)] : options?.limit ? [limit(options.limit)] : []));
        const unsubscribe = onSnapshot(q, (querySnapshot) => {
            const documents: Array<any> = [];
            querySnapshot.forEach((doc) => {
                if (doc.exists()) {
                    const docData = { uid: doc.id, ...doc.data() };
                    documents.push(docData);
                }
            });
            const lastVisible = querySnapshot.docs[querySnapshot.docs.length - 1];
            callback(options?.limit ? { documents, lastVisible } : documents);
        });

        return unsubscribe; // Return the unsubscribe function to stop listening when needed
    },

    async getCount(collectionName: string, queryArray: Array<any>, callback: any) {
        const q = query(collection(db, collectionName), ...queryArray?.map((_query) => where(_query?.field, _query?.operator, _query?.value)))
        const snapshot = await getCountFromServer(q);
        let count = snapshot.data().count;
        callback(count);
    },

    async getCollectionCount(collectionName: string, queryArray: Array<any>, callback: any) {
        const q = query(collectionGroup(db, collectionName), ...queryArray?.map((_query) => where(_query?.field, _query?.operator, _query?.value)))
        const snapshot = await getCountFromServer(q);
        let count = snapshot.data().count;
        callback(count);
    },

    snapshotDocument(collectionName: string, _query: any, callback: any, options: any) {
        const constraints = [where(_query?.field, _query?.operator, _query?.value)];
        if (options?.query2?.field) {
            constraints.push(where(options?.query2?.field, options?.query2?.operator, options?.query2?.value));
        }
        const q = query(collection(db, collectionName), ...constraints, ...(options?.lastVisible ? [limit(options?.limit), startAfter(options?.lastVisible)] : options?.limit ? [limit(options.limit)] : []));

        const unsubscribe = onSnapshot(q, async (querySnapshot) => {
            const documents = querySnapshot.docs.map(doc => ({ uid: doc.id, ...doc.data() }));
            const lastVisible = querySnapshot.docs[querySnapshot.docs.length - 1];
            callback(options?.limit ? { documents, lastVisible } : documents);
        });

        return unsubscribe; // Return the unsubscribe function to stop listening when needed
    },

    getAllDocumentsWithQuery(collectionName: string, array: Array<any>) {
        let responseArray: Array<any> = [];
        array?.forEach(async (data) => {
            const ref = data?.id;
            const q = query(collection(db, collectionName), where('uid', '==', ref));
            try {
                const querySnapshot = await getDocs(q);
                querySnapshot.forEach((doc) => {
                    const response = doc.data();
                    responseArray.push(response);
                });
            } catch (error) {
                console.error('Error fetching employee data:', error);
            }
        });
        return responseArray;
    },

    async addDocument(collectionName: string, data: any) {
        try {
            const timestamp = serverTimestamp();
            const dataWithTimestamp = { ...data, createdAt: timestamp, updatedAt: timestamp };
            const docRef = await addDoc(collection(db, collectionName), dataWithTimestamp);
            // Update the document with the actual doc().id
            await setDoc(doc(db, collectionName, docRef.id), { uid: docRef.id }, { merge: true });
            return { uid: docRef.id, ...dataWithTimestamp };
        } catch (error) {
            console.error('Error adding document: ', error);
            return null;
        }
    },

    async setDocument(collectionName: string, documentId: string, data: any) {
        try {
            const timestamp = serverTimestamp(); // Get the current server timestamp
            const dataWithTimestamp = { ...data, createdAt: timestamp, updatedAt: timestamp };
            await setDoc(doc(db, collectionName, documentId), dataWithTimestamp);
            return { ...dataWithTimestamp };
        } catch (error) {
            console.error('Error setting document: ', error);
            return null;
        }
    },

    async getDocument(collectionName: string, documentId: string) {
        try {
            if (!documentId)
                return null;
            const docRef = doc(db, collectionName, documentId);
            const docSnap = await getDoc(docRef);
            if (docSnap.exists()) {
                return { uid: docSnap.id, ...docSnap.data() };
            }
            console.log('No such document!');
            return null;
        } catch (error) {
            console.error('Error getting document: ', error);
            return null;
        }
    },
    async getDocumentsByReference(array: Array<any>) {
        let response = await Promise.all(
            array?.map(async (ref) => {
                const docSnap = await getDoc(ref);
                if (docSnap.exists()) {
                    return docSnap.data();
                } else {
                    return {};
                }
            })
        );
        return response?.filter((value: any) => Object.keys(value)?.length);
    },

    async getAllDocuments(collectionName: string, options: any) {
        try {
            const q = query(collection(db, collectionName), ...(options?.lastVisible ? [limit(options?.limit), startAfter(options?.lastVisible)] : options?.limit ? [limit(options.limit)] : []));
            const querySnapshot = await getDocs(q);
            const documents = querySnapshot.docs.map(doc => ({ uid: doc.id, ...doc.data() }));
            const lastVisible = querySnapshot.docs[querySnapshot.docs.length - 1];
            return options?.limit ? { documents, lastVisible } : documents;
        } catch (error) {
            console.error('Error getting documents: ', error);
            return null;
        }
    },

    async updateDocument(collectionName: string, documentId: string, data: any) {
        try {
            const timestamp = serverTimestamp(); // Get the current server timestamp
            const dataWithTimestamp = { ...data, updatedAt: timestamp };
            await updateDoc(doc(db, collectionName, documentId), dataWithTimestamp);
            return dataWithTimestamp;
        } catch (error) {
            console.error('Error updating document: ', error);
            return false;
        }
    },

    async deleteDocument(collectionName: string, documentId: string) {
        try {
            await deleteDoc(doc(db, collectionName, documentId));
            return true;
        } catch (error) {
            console.error('Error deleting document: ', error);
            return false;
        }
    },

    async deleteDocuments(collectionName: string, documents: Array<any>) {
        try {
            const batch = writeBatch(db);
            documents.forEach(({ uid }) => {
                const docRef = doc(db, collectionName, uid);
                batch.delete(docRef);
            });
            await batch.commit();
            return true;
        } catch (error) {
            console.error(error)
            return false;

        }
    },

    async findOneDocument(collectionName: string, condition: any) {
        try {
            const q = query(collection(db, collectionName), where(condition?.field, condition?.operator, condition?.value));
            const querySnapshot = await getDocs(q);
            if (querySnapshot.docs.length === 0) {
                return null;
            }
            const docSnap = querySnapshot.docs[0];
            if (docSnap.exists()) {
                return { uid: docSnap.id, ...docSnap.data() };
            }
            return null;
        } catch (error) {
            console.error("Error querying collection: ", error);
            return null;
        }
    },

    // async findDocuments(collectionName: string,
    //     condition: any,
    //     condition2: any = {},
    //     options: { limit?: number } = {}
    // ) {
    //     try {
    //         const constraints = [where(condition?.field, condition?.operator, condition?.value)];
    //         if (!!condition2) {
    //             constraints.push(where(condition2?.field, condition2?.operator, condition2?.value));
    //         }
    //         if (!!Object.keys(options)?.length) {
    //             constraints.push(limit(options?.limit))
    //         }
    //         const q = query(collection(db, collectionName), ...constraints);
    //         const querySnapshot = await getDocs(q);
    //         const documents: Array<any> = [];
    //         querySnapshot.forEach((doc) => {
    //             if (doc.exists()) {
    //                 const docData = { uid: doc.id, ...doc.data() };
    //                 documents.push(docData);
    //             }
    //         });
    //         const lastVisible = querySnapshot.docs[querySnapshot.docs.length - 1];
    //         return Object.keys(options).length ? { documents, lastVisible } : documents;
    //     } catch (error) {
    //         console.error("Error querying collection: ", error);
    //         return [];
    //     }
    // },

    getDocumentReference(collectionName: string, documentId: string) {
        return doc(db, collectionName, documentId);
    },

    getAllDocumentsReference(collectionName: string, array: Array<any>) {
        return array?.map((item) => {
            return item?.id ? item : firestoreService.getDocumentReference(collectionName, item?.uid ? item?.uid : item);
        });
    },

    async addBatchDocs(collectionName: string, array: Array<any>) {
        try {
            const batch = writeBatch(db);
            const collectionRef = collection(db, collectionName);
            let refs = array.map((data) => {
                const newDocRef = doc(collectionRef);
                batch.set(newDocRef, { ...data, uid: newDocRef?.id });
                return newDocRef;
            });
            await batch.commit();
            return refs;
        } catch (error) {
            console.error('Error performing batch write:', error);
        }
    },
    async updateBatchDocs(collectionName: string, array: Array<any>) {
        try {
            let data = []
            const batch = writeBatch(db);
            const collectionRef = collection(db, collectionName);
            const refs = array.map((update) => {
                if (update?.uid) {
                    const docRef = doc(collectionRef, update.uid);
                    const timestamp = serverTimestamp();
                    const dataWithTimestamp = { ...update, updatedAt: timestamp };
                    data.push(dataWithTimestamp);
                    batch.update(docRef, dataWithTimestamp);
                    return docRef;
                } else {
                    const newDocRef = doc(collectionRef);
                    batch.set(newDocRef, { ...update, uid: newDocRef?.id });
                    data.push({ ...update, uid: newDocRef?.id });
                    return newDocRef;
                }
            });
            await batch.commit();
            return refs;
        } catch (error) {
            console.error('Error performing batch update:', error);
        }
    },
    async getDocumentsByCollectionGroup(collectionName: string, condition: any, condition2: any) {
        const constraints = [where(condition?.field, condition?.operator, condition?.value)];
        if (condition2) {
            constraints.push(where(condition2?.field, condition2?.operator, condition2?.value));
        }
        const q = query(collectionGroup(db, collectionName), ...constraints);
        const querySnapshot = await getDocs(q);
        const documents: Array<any> = [];
        querySnapshot.forEach((doc) => {
            if (doc.exists()) {
                const docData = { uid: doc.id, ...doc.data() };
                documents.push(docData);
            }
        });
        return documents;
    },
}

const userService = {
    async userExists(collection, condition) {
        try {
            const user = await firestoreService.findOneDocument(collection, condition);
            return user !== null;

        } catch (error) {
            console.error("Error checking user existence: ", error);
            return false;
        }
    },

    async createEmployeeAndAssociateUID(collection, employeeData) {
        try {
            // Check if the user already exists based on their email
            const emailExist = await this.userExists(collection, { field: "email", operator: "==", value: employeeData.email });
            if (emailExist) {
                return null;
            }

            // User does not exist, proceed with user creation
            const { email, password } = employeeData;
            // let newPassword = await encryptPassword(password)
            const userCredential = await createUserWithEmailAndPassword(auth, email, password);

            const uid = userCredential.user.uid;

            // delete password from employeeData
            // delete employeeData.password;

            const employeeDocumentData = {
                ...employeeData,
                uid: uid,
            };

            const adminUserPayload = {
                ...employeeData,
                employeeId: uid,
                password: employeeData?.password,
            }

            // Update the Firestore document with the UID
            const employeeDocRef = await firestoreService.setDocument(collection, uid, employeeDocumentData);
            await firestoreService.addDocument(COLLECTION.AdminUser, adminUserPayload);
            return employeeDocRef;
        } catch (error) {
            console.error("Error creating employee:", error);
            return null;
        }
    },
    async changePasswordAndUpdateFirestore(collectionName, userData) {
        try {
            const { email, currentPassword, newPassword } = userData;
            // Sign in with the provided email and password
            const userCredential = await signInWithEmailAndPassword(userAuth, email, currentPassword);
            // Delete the user from Firebase Authentication
            // let _newPassword = await encryptPassword(newPassword)
            await updatePassword(userCredential.user, newPassword);
            // Update the user's document from Firestore
            let newPasswordObject = { password: newPassword };
            const updatedUser = await firestoreService.updateDocument(collectionName, userCredential.user.uid, newPasswordObject)
            await signOut(userAuth);
            return updatedUser;
        } catch (error) {
            console.error("Error deleting user:", error);
            return false;
        }
    },
    async deleteUserFromAuthAndFirestore(collection, userData) {
        try {
            const { email, password, uid } = userData;
            // Sign in with the provided email and password
            const userCredential = await signInWithEmailAndPassword(userAuth, email, password);
            const user = auth.currentUser;
            // Delete the user from Firebase Authentication
            deleteUser(user).then(async () => {
                console.log("user deleted from firebase auth")
                // Delete the user's document from Firestore               
                const docRef = doc(db, collection, uid);
                await deleteDoc(docRef);
                await signOut(userAuth);
            }).catch((error) => {
                console.error("Error deleting user:", error);
                return false;
            });
            return true;
        } catch (error) {
            console.error("Error deleting user:", error);
            return false;
        }
    },
    async adminLogin(collection, adminData) {
        try {
            const { email, password } = adminData;
            // Sign in with the provided email and password
            const userCredential = await signInWithEmailAndPassword(auth, email, password);
            let user = userCredential.user;
            let q = { field: "employeeId", value: user?.uid, operator: "==" };
            const userDocs = await firestoreService.findOneDocument(collection, q);
            if (!!userDocs) {
                if (['admin'].includes(userDocs?.role)) {
                    // Save the access token (optional)
                    const idTokenResult = await user.getIdTokenResult();
                    storage('create', 'accessToken', idTokenResult.token)

                    // Set up an event listener to refresh the token
                    onAuthStateChanged(auth, (user) => {
                        if (user) {
                            // Refresh the access token when needed (e.g., before it expires)
                            user.getIdToken(true)
                                .then((token) => {
                                    storage('create', 'accessToken', token)
                                })
                                .catch((error) => {
                                    console.error('Error refreshing access token:', error);
                                });
                        }
                    });

                    let User = { ...userDocs };
                    delete User.password
                    if (!!User) {
                        const userData = {
                            authUser: user,
                            userData: User,
                        };
                        // let newPassword = encryptPassword(password);
                        // await firestoreService.updateDocument(collection, user.uid, { password });
                        // Save the custom object to local storage
                        storage('create', 'currentUser', userData);
                        toast.success("Login Successfully");
                        return userData;
                    } else {
                        toast.error("User not found");
                        storage('clear');
                    }
                }
                else {
                    toast.error("No Access found");
                }
            } else {
                toast.error("User not found.");
            }

        } catch (error) {
            console.error('Error logging in with admin user:', error);

            if (error.code === 'auth/wrong-password') {
                toast.error('Wrong password. Please try again.');
            } else if (error.code === 'auth/user-not-found') {
                toast.error('User not found. Please check your email.');
            } else {
                toast.error('An error occurred while logging in.');
            }

            return null;
        }
    },
    async adminLogout(navigate) {

        // Sign out the user
        signOut(auth)
            .then(() => {
                storage('clear');
                navigate(0);
            })
            .catch((error) => {
                console.error('Error logging out:', error);
            });
    },
    async SendEmailForResetPassword(email) {
        try {
            const actionCode = {
                url: `${process.env.REACT_APP_LOGIN_URL}`,
            };
            await sendPasswordResetEmail(auth, email, actionCode);
            toast.success('Reset email sent. Check your inbox!');
            return true;
        } catch (error) {
            console.error('Error sending reset email:', error);
            return false;
        }
    },
    async confirmPasswordReset(collectionName, oobCode, userData) {
        try {
            const { email, newPassword } = userData;
            await confirmPasswordReset(auth, oobCode, newPassword);
            const userCredential = await signInWithEmailAndPassword(userAuth, email, newPassword);

            // Update the user's document from Firestore
            let newPasswordObject = { password: newPassword };
            // let newPasswordObject = { password: await encryptPassword(newPassword) };
            await firestoreService.updateDocument(collectionName, userCredential.user.uid, newPasswordObject)
            await signOut(userAuth);
            toast.success('Password reset successfully!')
            return true;
        } catch (error) {
            console.error('Error confirming password reset:', error);
            switch (error.code) {
                case 'auth/expired-action-code':
                    toast.error('Link expired. Request a new one.');
                    break;
                case 'auth/invalid-action-code':
                    toast.error('Invalid link. Request a new one.');
                    break;
                case 'auth/user-disabled':
                    toast.error('Account disabled. Contact support.');
                    break;
                case 'auth/user-not-found':
                    toast.error('User not found or link incorrect. Check the link or request a new one.');
                    break;
                case 'auth/weak-password':
                    toast.error('Weak password. Use at least 8 characters with numbers and symbols.');
                    break;
                default:
                    toast.error('Unexpected error. Try again later.');
            }
        }
    },
}