import { db, storage, auth } from "./firebaseConfig";

import {
  arrayRemove,
  collection,
  getDocs,
  doc,
  getDoc,
  addDoc,
  updateDoc,
  deleteDoc,
  arrayUnion,
  setDoc,
  query,
  where,
  DocumentData,
} from "firebase/firestore";
import {
  ref,
  getDownloadURL,
  uploadBytes,
  deleteObject,
} from "firebase/storage";
import {
  createUserWithEmailAndPassword,
  sendPasswordResetEmail,
  fetchSignInMethodsForEmail,
} from "firebase/auth";
import { signInWithEmailAndPassword } from "firebase/auth";
import { signOut as firebaseSignOut } from "firebase/auth";
import { ChurchInfo, MemberInfo } from "@/constants/types";



async function resetPassword(Email:string) {
  // try {
  //   console.log("email is ", Email);
  //   const emailExists = await checkIfEmailExists(Email);
  //   if (!emailExists) {
  //     throw { code: "auth/user-not-found" };
  //   }

  await sendPasswordResetEmail(auth, Email);
  // } catch (error) {
  //   throw error;
  // }
}

async function logInEmailAndPassword({ Email, Password }:any) {
  try {
    const userCredential = await signInWithEmailAndPassword(
      auth,
      Email,
      Password
    );
    return userCredential.user;
  } catch (error) {
    throw error;
  }
}

async function getAllDocInCollection(type:string) : Promise<DocumentData | undefined>  {
  const querySnapshot = await getDocs(collection(db, type));
  const data = querySnapshot.docs.map((doc) => {
    return { Id: doc.id, ...doc.data() };
  });
  return data;
}

//the name of the collection, ID
async function getOneDocInCollection(type:string, docID:string): Promise<DocumentData | undefined>  {
  const docRef = doc(db, type, docID);
  const docSnap = await getDoc(docRef);

  // if (docSnap.exists()) {
  //   console.log("Document data:", docSnap.data());
  // } else {
  //   // docSnap.data() will be undefined in this case
  //   console.log("No such document!");
  // }
  return docSnap.data();
}

//the name of the collection, object to add
async function addDocoment(type:string, objectToAdd:object) {
  const docRef = await addDoc(collection(db, type), objectToAdd);
  // console.log("Document written with ID: ", docRef.id);
}

async function addDocomentWithId(type:string, objectToAdd:object, id:string) {
  try {
    // Directly set the document with the predetermined ID
    const docRef = doc(db, type, id); // Create a document reference with the desired ID
    await setDoc(docRef, objectToAdd);
    console.log("Document written with ID: ", id);
  } catch (error) {
    console.error("Error adding document with ID: ", error);
    throw error;
  }
}

//the name of the collection, the updatedobject
async function updateDocument(type:string, docId:string, updateObject:object) {
  const docRef = doc(db, type, docId);
  await updateDoc(docRef, updateObject);
}


async function deleteDocument(collectionName: string, documentId: string) {
  try {
    await deleteDoc(doc(db, collectionName, documentId));
    console.log("Document successfully deleted!");
  } catch (error) {
    console.error("Error deleting document: ", error);
  }
}



async function getFieldFromDocument(collectionName:string, docID:string, fieldName:string) {
  const docRef = doc(db, collectionName, docID);
  const docSnap = await getDoc(docRef);

  if (docSnap.exists()) {
    const data = docSnap.data();
    return data[fieldName];
  } else {
    console.log("No such document!");
    return null;
  }
}


async function getKOUFAnsvariga() {
  const allMembers = await getAllDocInCollection("Members");
  const KOUFLeaders = allMembers?.filter(
    (member:any) => member?.Title.Category !== "Ungdom"
  );
  console.log("KOUFLeaders", KOUFLeaders);
  return KOUFLeaders;
}
async function AddChurchFirebase(data:ChurchInfo) {
  data.NotAdmin=[];
  data.Admin= [];
  await addDocoment("Churchs", data);
}



async function getDocumentIdByName(collectionName:string, fieldName:string, insideField:string) {
  const collectionRef = collection(db, collectionName); // No need for await here
  const q = query(collectionRef, where(fieldName, "==", insideField)); // No need for await here

  try {
    const querySnapshot = await getDocs(q);

    if (!querySnapshot.empty) {
      const doc = querySnapshot.docs[0]; // Get the first document

      return doc.id; 
    } else {
      return null; // Return null if no document is found
    }
  } catch (error) {
    throw error; 
  }
}


async function getAllDocumentsByName(
  collectionName: string,
  fieldName: string,
  insideField: string
): Promise<DocumentData[]> {
  const collectionRef = collection(db, collectionName);
  const q = query(collectionRef, where(fieldName, "==", insideField));

  try {
    const querySnapshot = await getDocs(q);
    if (!querySnapshot.empty) {
      return querySnapshot.docs.map((doc) => ({ Id: doc.id, ...doc.data() })); // Map all matching documents
    } else {
      return []; // Return an empty array if no documents match
    }
  } catch (error) {
    throw error;
  }
}

async function doesDocumentExist(collectionName:string, docID:string) {
  const docRef = doc(db, collectionName, docID);
  const docSnap = await getDoc(docRef);

  return docSnap.exists();
}

async function deletePhoto(photoUrl:string) {
  try {
    const photoRef = ref(storage, photoUrl);
    await deleteObject(photoRef);
    console.log("Photo deleted successfully");
  } catch (error) {
    console.error("Error deleting photo: ", error);
    throw error;
  }
}
export const signOut = async () => {
  try {
    await firebaseSignOut(auth);
    console.log("User signed out successfully");
  } catch (error) {
    console.error("Error signing out: ", error);
    throw error;
  }
};


export {

  getKOUFAnsvariga,

  getFieldFromDocument,
  getAllDocInCollection,
  getOneDocInCollection,
  addDocoment,
  updateDocument,
  deleteDocument,
  logInEmailAndPassword,
  doesDocumentExist,
  resetPassword,
  AddChurchFirebase,
  getDocumentIdByName,
  deletePhoto,
  addDocomentWithId, 
  getAllDocumentsByName
};
