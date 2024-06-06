// import StartFirebase from "./firebaseConfig";
// import { ref, get, child, update, remove,set} from "firebase/database";
import {db} from "./firebaseConfig"
// import { arrayRemove,collection, getDocs,doc, getDoc, addDoc,updateDoc,deleteDoc} from "firebase/firestore";
import { arrayRemove,collection, getDocs,doc, getDoc, addDoc,updateDoc, deleteDoc} from "firebase/firestore";

//the of the collection
async function getAllDocInCollection(type) {
  const querySnapshot = await getDocs(collection(db, type));
  const data = querySnapshot.docs.map(doc => {
    return { Id: doc.id, ...doc.data() };
  });
  return data;
}

//the name of the collection, ID
async function getOneDocInCollection(type,docID){
  const docRef = doc(db, type, docID);
  const docSnap = await getDoc(docRef);

  if (docSnap.exists()) {
    console.log("Document data:", docSnap.data());
  } else {
    // docSnap.data() will be undefined in this case
    console.log("No such document!");
  }  
  return docSnap.data();
}

//the name of the collection, object to add
async function addDocoment(type,objectToAdd){
  const docRef = await addDoc(collection(db, type), objectToAdd);
  console.log("Document written with ID: ", docRef.id);
}


//the name of the collection, the updatedobject
async function updateDocument(type,docId, updateObject){
  const docRef = doc(db, type, docId);
  await updateDoc(docRef, updateObject);
}


//the name of the collection, the documentation ID that  want to delete
async function deleteDocument(type,docId){
  await deleteDoc(doc(db, type, docId));
}

async function getFieldFromDocument(collectionName, docID, fieldName) {
  const docRef = doc(db, collectionName, docID);
  const docSnap = await getDoc(docRef);

  if (docSnap.exists()) {
    const data = docSnap.data();
    return data[fieldName]; // Return only the specified field
  } else {
    console.log("No such document!");
    return null;
  }
}

async function getAttendedMembers(sheetID){
  const attendedIDS = await getFieldFromDocument("STMinaKOUFAttendence", sheetID, "IDS")
  const allMembers = await getAllDocInCollection("STMinaKOUFData")
  console.log("attendedIDS: ", attendedIDS)
  console.log("allMembers", allMembers)
  const attendedMembersInfo = allMembers.filter(member => attendedIDS.includes(member.Id));
  return attendedMembersInfo

}

async function deleteIdFromAttendenceSheet(MemberID){
  const allAttendenceSheet= await getAllDocInCollection("STMinaKOUFAttendence");
  for (const sheet of allAttendenceSheet) {

    if (sheet.IDS && sheet.IDS.includes(MemberID)) {
      const docRef = doc(db, "STMinaKOUFAttendence", sheet.Id);

      await updateDoc(docRef, {
        IDS: arrayRemove(MemberID)
      });

      console.log(`MemberID ${MemberID} removed from document ${sheet.Id}`);
    }
  }

}


export { deleteIdFromAttendenceSheet, getAttendedMembers,getFieldFromDocument,getAllDocInCollection, getOneDocInCollection,addDocoment,updateDocument,deleteDocument};
