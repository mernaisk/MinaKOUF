import { arrayRemove, arrayUnion, doc, updateDoc } from "firebase/firestore";
import { db } from "./firebaseConfig";
import {
  getAllDocInCollection,
  getFieldFromDocument,
  getOneDocInCollection,
} from "./firebaseModel";
import { updateMemberInfo } from "./firebaseModelMembers";
import { MemberInfo } from "@/constants/types";

const addIDToAttendence = async (documentId: string, newId: string) => {
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
const removeIDFromAttendence = async (
  documentId: string,
  idToRemove: string
) => {
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

async function getAttendedMembers(sheetID: string) {
  const attendedIDS = await getFieldFromDocument("Attendence", sheetID, "IDS");
  const allMembers = await getAllDocInCollection("Members");
  // console.log("attendedIDS: ", attendedIDS)
  // console.log("allMembers", allMembers)
  const attendedMembersInfo = allMembers?.filter((member: any) =>
    attendedIDS.includes(member.Id)
  );
  return attendedMembersInfo;
}

async function deleteIdFromAttendenceSheet(MemberID: string) {
  const allAttendenceSheet = (await getAllDocInCollection("Attendence")) || [];
  if (!Array.isArray(allAttendenceSheet)) {
    throw new Error("Expected allChurches to be an array.");
  }
  if (allAttendenceSheet) {
    for (const sheet of allAttendenceSheet) {
      if (sheet.IDS?.includes(MemberID)) {
        const docRef = doc(db, "Attendence", sheet.Id);

        await updateDoc(docRef, {
          IDS: arrayRemove(MemberID),
        });
      }
    }
  }
}

async function updateAttendenceForMembers(Sheet: any, allMembers: any) {
  for (const Member of allMembers) {
    console.log("member is : ", Member);
    console.log("sheet is : ", Sheet);
    const modifiedMember = { ...Member };

    if (Sheet.AttendedIDS.includes(Member.Id)) {
      const countAttendance = parseInt(Member.Attendence.CountAttendenceCurrentYear, 10) || 0;
      console.log("attendance count is : ", countAttendance);

      modifiedMember.Attendence.CountAttendenceCurrentYear = (countAttendance + 1).toString();
      modifiedMember.Attendence.LastWeekAttendend = "0"; // As it's a reset
      console.log("modified member is : ", modifiedMember);

      await updateMemberInfo(Member.Id, modifiedMember, Member);
    } else {
      const countAbsence = parseInt(Member.Attendence.CountAbsenceCurrentYear, 10) || 0;
      const countLastWeekAttendend = parseInt(Member.Attendence.LastWeekAttendend, 10) || 0;

      modifiedMember.Attendence.CountAbsenceCurrentYear = (countAbsence + 1).toString();
      modifiedMember.Attendence.LastWeekAttendend = (countLastWeekAttendend + 1).toString();

      await updateMemberInfo(Member.Id, modifiedMember, Member);
    }
  }
}


export { addIDToAttendence, removeIDFromAttendence,updateAttendenceForMembers };
