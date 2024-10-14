import { QuestionInfo } from "@/constants/types";
import { addDocoment, deleteDocument, getDocumentIdByName, getOneDocInCollection, updateDocument } from "./firebaseModel";

async function getChallengeInOneChurch(ID: string) {
    const ChallengeId = await getDocumentIdByName("Challenge", "OrgnizationId", ID);
    if (ChallengeId) {
      return await getOneDocInCollection("Challenge", ChallengeId) as QuestionInfo || null;
    }
  
  }
  
  async function DeleteChallengeInOneChurch(ID: string) {
    const ChallengeId = await getDocumentIdByName("Challenge", "OrginizationId", ID) || null;
    if(ChallengeId){
      deleteDocument("Challenge", ChallengeId)
    }
  }
  
  async function AddChallengeInOneChurch(data:QuestionInfo, ID: string) {
    await DeleteChallengeInOneChurch(ID);
    await addDocoment("Challenge",data);
    const ChallengeId = await getDocumentIdByName("Challenge", "OrginizationId", ID);
    if(ChallengeId){
      deleteDocument("Challenge", ChallengeId)
    }
  }

  async function UpdateChallengeInOneChurch(data:QuestionInfo, ID: string) {
    const ChallengeId = await getDocumentIdByName("Challenge", "OrgnizationId", ID);
    console.log(ChallengeId)
    if(ChallengeId){
      updateDocument("Challenge",ChallengeId,data)
    }
  }

  export { getChallengeInOneChurch,AddChallengeInOneChurch, UpdateChallengeInOneChurch};
