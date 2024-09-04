import { addDocoment,getDocumentIdByName, getOneDocInCollection } from "./firebaseModel";
import { ref, getDownloadURL, uploadBytes } from "firebase/storage";
import { ChurchInfo, EventInfo } from "@/constants/types";
import { storage } from "./firebaseConfig";

async function uploadEventImage(uri:string) {
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

async function addEvent(event:EventInfo) {
  console.log("Adding event:", event);
  try {
    const downloadURL = await uploadEventImage(event.ImageInfo.assetInfo.uri);
    event.ImageInfo.URL = downloadURL;
    event.Bookings = [];
    await addDocoment("Events", event);
    console.log("Event successfully added.");
  } catch (error) {
    console.error("Error adding event:", error);
  }
}

async function getChurchInfo(churchName: string): Promise<ChurchInfo | null> {
  const ChurchId = await getDocumentIdByName("Churchs", "Name", churchName);
  console.log(ChurchId);

  if (!ChurchId) {
    console.log("Church ID not found.");
    return null;
  }

  const churchData = await getOneDocInCollection("Churchs", ChurchId);

  // Check if churchData exists and has the necessary fields
  if (!churchData) {
    console.log("Church data not found.");
    return null;
  }

  const churchInfo: ChurchInfo = {
    Name: churchData.Name,
    StreetName: churchData.StreetName,
    PostNumber: churchData.PostNumber,
    City: churchData.City,
    SwishNumber: churchData.SwishNumber,
  };

  return churchInfo;
}
export { addEvent, getChurchInfo};
