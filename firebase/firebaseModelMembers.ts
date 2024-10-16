import { createUserWithEmailAndPassword } from "firebase/auth";
import {
  getAllDocInCollection,
  getDocumentIdByName,
  deletePhoto,
  updateDocument,
  addDocomentWithId,
  getFieldFromDocument,
  getOneDocInCollection,
  deleteDocument,
  addDocoment
} from "./firebaseModel";
import { auth, db, storage } from "./firebaseConfig";
import { ChurchInfo, MemberInfo, QuestionInfo } from "@/constants/types";
import { getDownloadURL, ref, uploadBytes } from "firebase/storage";
import { arrayRemove, arrayUnion, doc, updateDoc } from "firebase/firestore";

const addMemberToOrg = async (churchId: string, memberId: string) => {
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

const removeMemberFromOrg = async (churchId: string, memberId: string) => {
  const docRef = doc(db, "Churchs", churchId);

  try {
    await updateDoc(docRef, {
      NotAdmin: arrayRemove(memberId),
    });
    console.log("ID removed successfully");
  } catch (e) {
    console.error("Error adding ID: ", e);
  }
};

const addAdminToOrg = async (churchId: string, memberId: string) => {
  const docRef = doc(db, "Churchs", churchId);

  try {
    await updateDoc(docRef, {
      Admin: arrayUnion(memberId),
    });
    console.log("ID added successfully");
  } catch (e) {
    console.error("Error adding ID: ", e);
  }
};

const removeAdminFromOrg = async (churchId: string, memberId: string) => {
  const docRef = doc(db, "Churchs", churchId);

  try {
    await updateDoc(docRef, {
      Admin: arrayRemove(memberId),
    });
    console.log("ID removed successfully");
  } catch (e) {
    console.error("Error adding ID: ", e);
  }
};

const addAdminToRiksKOUF = async (Id: string, memberId: string) => {
  const docRef = doc(db, "RiksKOUFInfo", Id);

  try {
    await updateDoc(docRef, {
      Admin: arrayUnion(memberId),
    });
    console.log("ID added successfully");
  } catch (e) {
    console.error("Error adding ID: ", e);
  }
};

const removeAdminFromRiksKOUF = async (Id: string, memberId: string) => {
  const docRef = doc(db, "RiksKOUFInfo", Id);

  try {
    await updateDoc(docRef, {
      Admin: arrayRemove(memberId),
    });
    console.log("ID removed successfully");
  } catch (e) {
    console.error("Error adding ID: ", e);
  }
};

async function AddMemberFirebase(member: MemberInfo) {
  try {
    // Step 1: Create the user
    const userCredential = await createUserWithEmailAndPassword(
      auth,
      member.Email,
      member.Password
    );

    const OrgId =
      (await getDocumentIdByName("Churchs", "Name", member.Orginization)) || "";
    (member.Involvments = []),
      (member.IsActiveInKOUF = "No"),
      (member.OrginizationNameKOUF = ""),
      (member.OrginizationIdKOUF = ""),
      (member.OrginizationId = OrgId),
      (member.TitleKOUF = ""),
      (member.IsActiveInRiksKOUF = "No"),
      (member.TitleRiksKOUF = ""),
      (member.Membership = {
        AmountPaidMonths: "",
      }),
      (member.Attendence = {
        CountAbsenceCurrentYear: "0",
        CountAttendenceCurrentYear: "0",
        LastWeekAttendend: "0",
      });

    const ChurchId = await getDocumentIdByName(
      "Churchs",
      "Name",
      member.Orginization
    );
    if (ChurchId) {
      console.log("Church ID:", ChurchId);
      await addMemberToOrg(ChurchId, userCredential.user.uid);
    }

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

async function getMembersInOneChurch(churchId:string){
  const MembersIDs = await getFieldFromDocument("Churchs", churchId, "NotAdmin");
  const MembersInfo = await Promise.all(MembersIDs.map(async (memberId:string)  => {
    const MemberInfo = await getOneDocInCollection("Members",memberId);
    return {Id:memberId , ...MemberInfo}
  }))
  return MembersInfo
}



async function getLeadersInOneChurch(churchId:string){
  const LeadersIDs = await getFieldFromDocument("Churchs", churchId, "Admin");
  const LeadersInfo = await Promise.all(LeadersIDs.map(async (memberId:string)  => {
    const MemberInfo = await getOneDocInCollection("Members",memberId);
    return {Id:memberId , ...MemberInfo}
  }))
  return LeadersInfo
}

async function updateMemberInfo(
  memberId: string,
  member: MemberInfo,
  oldMember: MemberInfo
) {
  //handle change in organizaton
  if (member.Orginization !== oldMember.Orginization) {
    const newChurchId = await getDocumentIdByName(
      "Churchs",
      "Name",
      member.Orginization
    );
    const oldChurchId = await getDocumentIdByName(
      "Churchs",
      "Name",
      oldMember.Orginization
    );
    if (newChurchId && oldChurchId) {
      await addMemberToOrg(newChurchId, memberId);
      await removeMemberFromOrg(oldChurchId, memberId);
      member.OrginizationId = newChurchId;
    }
  }

  //handle change in rikdkouf role
  if (
    member.IsActiveInRiksKOUF === "No" &&
    oldMember.IsActiveInRiksKOUF === "Yes"
  ) {
    await removeAdminFromRiksKOUF("QCvAYuSRgRVbpbh3tTkb", memberId);
    member.TitleRiksKOUF = "";
  } else if (
    member.IsActiveInRiksKOUF === "Yes" &&
    oldMember.IsActiveInRiksKOUF === "No"
  ) {
    addAdminToRiksKOUF("QCvAYuSRgRVbpbh3tTkb", memberId);
  }

  if (member.IsActiveInKOUF === "No" && oldMember.IsActiveInKOUF === "Yes") {
    await removeAdminFromOrg(oldMember.OrginizationIdKOUF, memberId);
    member.OrginizationIdKOUF = "";
    member.OrginizationNameKOUF = "";
    member.TitleKOUF = "";
  } else if (
    member.IsActiveInKOUF === "Yes" &&
    oldMember.IsActiveInKOUF === "No"
  ) {
    const orgId =
      (await getDocumentIdByName(
        "Churchs",
        "Name",
        member.OrginizationNameKOUF
      )) || "";
    member.OrginizationIdKOUF = orgId;
    await addAdminToOrg(orgId, memberId);
  } else if (
    member.IsActiveInKOUF === "Yes" &&
    oldMember.IsActiveInKOUF === "Yes" &&
    member.OrginizationNameKOUF !== oldMember.OrginizationNameKOUF
  ) {
    const orgId =
      (await getDocumentIdByName(
        "Churchs",
        "Name",
        member.OrginizationNameKOUF
      )) || "";
    member.OrginizationIdKOUF = orgId;
  }

  //handle change in profile picture
  if (member.ProfilePicture.assetInfo != oldMember.ProfilePicture.assetInfo) {
    if (member.ProfilePicture.assetInfo.uri) {
      const downloadURL = await uploadProfilePictureImage(
        member.ProfilePicture.assetInfo.uri
      );
      member.ProfilePicture.URL = downloadURL;
      if (oldMember.ProfilePicture.URL) {
        deletePhoto(oldMember.ProfilePicture.URL);
      }
    } else if (
      !member.ProfilePicture.assetInfo.uri &&
      oldMember.ProfilePicture.URL
    ) {
      deletePhoto(oldMember.ProfilePicture.URL);
    }
  }

  await updateDocument("Members", memberId, member);

}

export { updateMemberInfo, AddMemberFirebase,getMembersInOneChurch,getLeadersInOneChurch};
