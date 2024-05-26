// import StartFirebase from "./firebaseConfig";
// import { ref, get, child, update, remove,set} from "firebase/database";
import {db} from "./firebaseConfig"
import { collection, getDocs,doc, getDoc, addDoc,updateDoc,deleteDoc} from "firebase/firestore";

//the of the collection
async function getAllDocInCollection(type) {
  const querySnapshot = await getDocs(collection(db, type));
  const data = querySnapshot.docs.map(doc => {
    console.log(doc.id); // Log doc.id here
    return { Id: doc.id, ...doc.data() };
  });
  console.log(data);
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


export { getAllDocInCollection, getOneDocInCollection,addDocoment,updateDocument,deleteDocument};
