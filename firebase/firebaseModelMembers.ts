import { createUserWithEmailAndPassword } from "firebase/auth";
import {
  getAllDocInCollection,
  getDocumentIdByName,
  deletePhoto,
  updateDocument,
  addDocomentWithId,
} from "./firebaseModel";
import { auth, db, storage } from "./firebaseConfig";
import { MemberInfo } from "@/constants/types";
import { getDownloadURL, ref, uploadBytes } from "firebase/storage";
import { arrayRemove, arrayUnion, doc, updateDoc } from "firebase/firestore";

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

async function addMemberToChurch(churches:any, memberId:string) {
  try {
    const allChurches = await getAllDocInCollection("Churchs");
    console.log("allChurches is: ", allChurches);

    // Iterate over all churches asynchronously
    for (const church of allChurches) {
      // Await the result of getDocumentIdByName to get the ChurchId
      const ChurchId = await getDocumentIdByName(
        "Churchs",
        "Name",
        church.Name
      );

      if (ChurchId) {
        for (const belongChurch of churches) {
          if (belongChurch.Name === church.Name) {
            console.log("Church ID:", ChurchId);
            await addToChurchCollection(ChurchId, memberId); 
            console.log("Church", belongChurch.Name, "is included");
          }
        }
      }
    }
  } catch (error) {
    console.error("Error in addMemberToChurch:", error);
  }
}

async function changeFromAdminToNonAdmin(OrgId: string, memberId: string) {
  const docRef = doc(db, "Churchs", OrgId);

  try {
    await updateDoc(docRef, {
      NotAdmin: arrayUnion(memberId),
    });
    await updateDoc(docRef, {
      Admin: arrayRemove(memberId),
    });
    
    console.log("ID changed from admin to not admin successfully");
  } catch (e) {
    console.error("Error removing ID: ", e);
  }
}

async function changeFromNonAdminToAdmin(OrgId: string, memberId: string) {
  const docRef = doc(db, "Churchs", OrgId);

  try {
    await updateDoc(docRef, {
      Admin: arrayUnion(memberId),
    });
    await updateDoc(docRef, {
      NotAdmin: arrayRemove(memberId),
    });
    
    console.log("ID changed from amin to not admin successfully");
  } catch (e) {
    console.error("Error removing ID: ", e);
  }
}

async function AddMemberFirebase(member: MemberInfo) {
  try {
    // Step 1: Create the user
    const userCredential = await createUserWithEmailAndPassword(
      auth,
      member.Email,
      member.Password
    );
    console.log("userCredential", userCredential.user);
    (member.Involvments = []),
      (member.Roles = {
        KOUF: {
          Active: false,
          Orginizations: [],
        },
        RiksKOUF: {
          Active: false,
          Title: "",
        },
      }),
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

async function uploadProfilePictureImage(uri: string) {
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
    const storageRef = ref(storage, `ProfilePictures/${timestamp}`);
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
async function updateMemberInfo(
  memberId: string,
  member: MemberInfo,
  oldImage: any
) {
  if (member.ProfilePicture.assetInfo.uri) {
    if (oldImage.assetInfo.assetId == member.ProfilePicture.assetInfo.assetID) {
      member.ProfilePicture.URL = oldImage.URL;
    } else {
      const downloadURL = await uploadProfilePictureImage(
        member.ProfilePicture.assetInfo.uri
      );
      member.ProfilePicture.URL = downloadURL;
      deletePhoto(oldImage.URL);
    }
    await updateDocument("Members", memberId, member);
  } else {
    if (oldImage.URL) {
      deletePhoto(oldImage.URL);
    }
    await updateDocument("Members", memberId, member);
  }
}


export {updateMemberInfo, AddMemberFirebase};
