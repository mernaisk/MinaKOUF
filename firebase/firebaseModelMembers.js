import {getAllDocInCollection,getDocumentIdByName,addToChurchCollection} from "./firebaseModel"
  
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
      await updateDocument("Members", memberId, member);
    } else {
      if (oldImage.URL) {
        deletePhoto(oldImage.URL);
      }
      await updateDocument("Members", memberId, member);
    }
  }