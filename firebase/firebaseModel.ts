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
import { MemberInfo } from "@/constants/types";



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

const addToChurchCollection = async (churchId:string, memberId:string) => {
  const docRef = doc(db, "Churchs", churchId);

  try {
    await updateDoc(docRef, {
      NotAdmin: arrayUnion(memberId),
    });
    console.log("ID added successfully");
  } catch (e) {
    console.error("Error adding ID: ", e);
  }
};

const addIDToAttendence = async (documentId:string, newId:string) => {
  const docRef = doc(db, "Attendence", documentId);

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
const removeIDFromAttendence = async (documentId:string, idToRemove:string) => {
  const docRef = doc(db, "Attendence", documentId);

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
async function deleteDocument(type:string, docId:string) {
  await deleteDoc(doc(db, type, docId));
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

async function getAttendedMembers(sheetID:string) {
  const attendedIDS = await getFieldFromDocument("Attendence", sheetID, "IDS");
  const allMembers = await getAllDocInCollection("Members");
  // console.log("attendedIDS: ", attendedIDS)
  // console.log("allMembers", allMembers)
  const attendedMembersInfo = allMembers?.filter((member:any) =>
    attendedIDS.includes(member.Id)
  );
  return attendedMembersInfo;
}

async function getKOUFAnsvariga() {
  const allMembers = await getAllDocInCollection("Members");
  const KOUFLeaders = allMembers?.filter(
    (member:any) => member?.Title.Category !== "Ungdom"
  );
  console.log("KOUFLeaders", KOUFLeaders);
  return KOUFLeaders;
}

async function deleteIdFromAttendenceSheet(MemberID:string) {
  const allAttendenceSheet = await getAllDocInCollection("Attendence");
  for (const sheet of allAttendenceSheet) {
    if (sheet.IDS && sheet.IDS.includes(MemberID)) {
      const docRef = doc(db, "Attendence", sheet.Id);

      await updateDoc(docRef, {
        IDS: arrayRemove(MemberID),
      });
    }
  }
}


async function AddChurchFirebase(data:Object) {
  data.NotAdmin=[];
  data.Admin= [];
  data.Id=data.Name;
  await addDocoment("Churchs", data);
}



async function getDocumentIdByName(collectionName:string, fieldName:string, insideField:string) {
  const collectionRef = collection(db, collectionName); // No need for await here
  const q = query(collectionRef, where(fieldName, "==", insideField)); // No need for await here

  try {
    const querySnapshot = await getDocs(q);

    if (!querySnapshot.empty) {
      const doc = querySnapshot.docs[0]; // Get the first document
      console.log("coc is: ", doc)
      console.log("Document ID:", doc.id);
      return doc.id; // Return the document ID
    } else {
      console.log("No matching documents found.");
      return null; // Return null if no document is found
    }
  } catch (error) {
    console.error("Error getting document:", error);
    throw error; // Throw the error to handle it outside the function if needed
  }
}

async function addMemberToChurch(churches, memberId) {
  try {
    const allChurches = await getAllDocInCollection("Churchs");
    console.log("allChurches is: ", allChurches);

    // Iterate over all churches asynchronously
    for (const church of allChurches) {
      // Await the result of getDocumentIdByName to get the ChurchId
      const ChurchId = await getDocumentIdByName("Churchs", "Name", church.Name);

      if (ChurchId) {
        for (const belongChurch of churches) {
          if (belongChurch.Name === church.Name) {
            console.log("Church ID:", ChurchId);
            await addToChurchCollection(ChurchId, memberId); // Assuming addToChurchCollection is also async
            console.log("Church", belongChurch.Name, "is included");
          }
        }
      }
    }
  } catch (error) {
    console.error("Error in addMemberToChurch:", error);
  }
}


async function AddMemberFirebase(member) {
  try {
    // Step 1: Create the user
    const userCredential = await createUserWithEmailAndPassword(
      auth,
      member.Email,
      member.Password
    );
    console.log("userCredential", userCredential.user);
    (member.Involvments = []),
      (member.Category = { Name: "Ungdom", Id: "Ungdom" }),
      (member.LeaderTitle = null),
      (member.ChurchKOUFLeader = {}),
      (member.Attendence = {
        CountAbsenceCurrentYear: "0",
        CountAttendenceCurrentYear: "0",
        LastWeekAttendend: "0",
      });

    await addMemberToChurch(member.Orginization, userCredential.user.uid);

    if (member.ProfilePicture?.assetInfo?.uri) {
      const response = await fetch(member.ProfilePicture.assetInfo.uri);
      const blob = await response.blob();
      const storageRef = ref(storage, `ProfilePicture/${new Date().getTime()}`);
      await uploadBytes(storageRef, blob);
      const downloadURL = await getDownloadURL(storageRef);
      member.ProfilePicture.URL = downloadURL;
    }

    // Step 4: Add the member data to Firestore
    await addDocomentWithId("Members", member, userCredential.user.uid);

    console.log("Member added successfully:", member);
  } catch (error) {
    console.error("Error adding member:", error);
    // Handle the error (e.g., show an error message to the user)
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
async function updateMemberInfo(memberId:string, member:MemberInfo, oldImage) {
  if (member?.ProfilePicture.assetInfo.uri) {
    if (oldImage.assetInfo.assetId == member?.ProfilePicture.assetInfo.assetID) {
      member.ProfilePicture.URL = oldImage.URL;
    } else {
      // const downloadURL = await uploadImage(
      //   member.ProfilePicture.assetInfo.uri,
      //   "ProfilePicture"
      // );
      // member.ProfilePicture.URL = downloadURL;
      // deletePhoto(oldImage.URL);
    }
    await updateDocument("Members", memberId, member);
  } else {
    if (oldImage.URL) {
      deletePhoto(oldImage.URL);
    }
    await updateDocument("Members", memberId, member);
  }
}

export {
  
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
  AddChurchFirebase,
  getDocumentIdByName
};