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
import { getAuth, getUserByEmail } from "firebase/auth";

async function checkIfEmailExists(email) {
  getAuth()
    .getUserByEmail(email)
    .then((userRecord) => {
      // See the UserRecord reference doc for the contents of userRecord.
      return true;
    })
    .catch((error) => {
      return false;
    });
}

async function resetPassword(Email) {
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

async function logInEmailAndPassword({ Email, Password }) {
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

async function getAllDocInCollection(type) {
  const querySnapshot = await getDocs(collection(db, type));
  const data = querySnapshot.docs.map((doc) => {
    return { Id: doc.id, ...doc.data() };
  });
  return data;
}

//the name of the collection, ID
async function getOneDocInCollection(type, docID) {
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
async function addDocoment(type, objectToAdd) {
  const docRef = await addDoc(collection(db, type), objectToAdd);
  // console.log("Document written with ID: ", docRef.id);
}

async function addDocomentWithId(type, objectToAdd, id) {
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
async function updateDocument(type, docId, updateObject) {
  const docRef = doc(db, type, docId);
  await updateDoc(docRef, updateObject);
}

const addIDToAttendence = async (documentId, newId) => {
  const docRef = doc(db, "STMinaKOUFAttendence", documentId);

  try {
    await updateDoc(docRef, {
      IDS: arrayUnion(newId),
    });
    console.log("ID added successfully");
  } catch (e) {
    console.error("Error adding ID: ", e);
  }
};

// Function to remove an ID from the IDS array
const removeIDFromAttendence = async (documentId, idToRemove) => {
  const docRef = doc(db, "STMinaKOUFAttendence", documentId);

  try {
    await updateDoc(docRef, {
      IDS: arrayRemove(idToRemove),
    });
    console.log("ID removed successfully");
  } catch (e) {
    console.error("Error removing ID: ", e);
  }
};

//the name of the collection, the documentation ID that  want to delete
async function deleteDocument(type, docId) {
  await deleteDoc(doc(db, type, docId));
}

async function getFieldFromDocument(collectionName, docID, fieldName) {
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

async function getAttendedMembers(sheetID) {
  const attendedIDS = await getFieldFromDocument(
    "STMinaKOUFAttendence",
    sheetID,
    "IDS"
  );
  const allMembers = await getAllDocInCollection("STMinaKOUFData");
  // console.log("attendedIDS: ", attendedIDS)
  // console.log("allMembers", allMembers)
  const attendedMembersInfo = allMembers.filter((member) =>
    attendedIDS.includes(member.Id)
  );
  return attendedMembersInfo;
}

async function getKOUFAnsvariga() {
  const allMembers = await getAllDocInCollection("STMinaKOUFData");
  const KOUFLeaders = allMembers.filter((member) => member.Title !== "Ungdom");
  console.log("KOUFLeaders", KOUFLeaders);
  return KOUFLeaders;
}

async function deleteIdFromAttendenceSheet(MemberID) {
  const allAttendenceSheet = await getAllDocInCollection(
    "STMinaKOUFAttendence"
  );
  for (const sheet of allAttendenceSheet) {
    if (sheet.IDS && sheet.IDS.includes(MemberID)) {
      const docRef = doc(db, "STMinaKOUFAttendence", sheet.Id);

      await updateDoc(docRef, {
        IDS: arrayRemove(MemberID),
      });
    }
  }
}

async function addEvent(event) {
  console.log("Adding event:", event);
  try {
    // Check if the image URI is valid
    if (!event.ImageInfo || !event.ImageInfo.assetInfo.uri) {
      throw new Error("Invalid image URI");
    }

    // Upload the event image and get the download URL
    const downloadURL = await uploadEventImage(event.ImageInfo.assetInfo.uri);
    event.ImageInfo.URL = downloadURL;

    console.log("Event with updated URL:", event);

    // Add the event document to Firestore
    await addDocoment("STMinaKOUFEvents", event);
    console.log("Event successfully added.");
  } catch (error) {
    console.error("Error adding event:", error);
  }
}

async function uploadEventImage(uri) {
  try {
    // Fetch the image
    const response = await fetch(uri);
    if (!response.ok) {
      throw new Error(`Failed to fetch image: ${response.statusText}`);
    }
    const blob = await response.blob();
    console.log("Blob created successfully:", blob);

    // Create a storage reference
    const timestamp = new Date().getTime();
    const storageRef = ref(storage, `EventImages/${timestamp}`);
    console.log("Storage reference created:", storageRef);

    // Upload the blob
    const snapshot = await uploadBytes(storageRef, blob);
    console.log("Upload snapshot:", snapshot);

    // Get the download URL
    const downloadURL = await getDownloadURL(storageRef);
    console.log("Download URL obtained:", downloadURL);

    return downloadURL;
  } catch (error) {
    console.error("Error uploading event image:", error);
    throw error;
  }
}

async function AddMemberFirebase(member) {
  // try {
  const userCredential = await createUserWithEmailAndPassword(
    auth,
    member.Email,
    member.Password
  );
  const user = userCredential.user;
  console.log("the user is:", user);
  console.log("the member is:", member);
  member.Title = "Ungdom";

  if (member.ProfilePicture.assetInfo.uri) {
    const response = await fetch(member.ProfilePicture.assetInfo.uri);
    const blob = await response.blob();
    const storageRef = await ref(storage, `ProfilePicture/${new Date().getTime()}`);
    await uploadBytes(storageRef, blob);
    const downloadURL = await getDownloadURL(storageRef);
    member.ProfilePicture.URL = downloadURL;
    await addDocomentWithId("STMinaKOUFData", member, user.uid);
  } else {
    await addDocomentWithId("STMinaKOUFData", member, user.uid);
  }
}

async function doesDocumentExist(collectionName, docID) {
  const docRef = doc(db, collectionName, docID);
  const docSnap = await getDoc(docRef);

  return docSnap.exists();
}



async function deletePhoto(photoUrl) {
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
async function updateMemberInfo(memberId, member, oldImage) {

  if (member.ProfilePicture.assetInfo.uri) {

    if (oldImage.assetInfo.assetId == member.ProfilePicture.assetInfo.assetID) {
      member.ProfilePicture.URL = oldImage.URL;
    } else {
      const downloadURL = await uploadImage(
        member.ProfilePicture.assetInfo.uri,
        "ProfilePicture"
      );
      member.ProfilePicture.URL = downloadURL;
      deletePhoto(oldImage.URL);
    }
    await updateDocument("STMinaKOUFData", memberId, member);
  } else {
    if(oldImage.URL){
      deletePhoto(oldImage.URL);
    }
    await updateDocument("STMinaKOUFData", memberId, member);
  }
}

export {
  addEvent,
  addIDToAttendence,
  removeIDFromAttendence,
  getKOUFAnsvariga,
  deleteIdFromAttendenceSheet,
  getAttendedMembers,
  getFieldFromDocument,
  getAllDocInCollection,
  getOneDocInCollection,
  addDocoment,
  updateDocument,
  deleteDocument,
  AddMemberFirebase,
  logInEmailAndPassword,
  updateMemberInfo,
  doesDocumentExist,
  resetPassword,
};
