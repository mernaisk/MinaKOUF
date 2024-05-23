import validator from "validator";
import { PhoneNumberUtil } from 'google-libphonenumber';

const phoneUtil = PhoneNumberUtil.getInstance();

function sendMessage(youthMessage){

};

function filterMembers(allMembers,searchString){
    const modifiedSearchString = searchString.charAt(0).toLowerCase() + searchString.slice(1).toLowerCase()
    if (searchString != ""){
        const filteredMembers = allMembers.filter(member => {
            return member.FirstName.startsWith(modifiedSearchString);
        });
        return sortAlphapidically(filteredMembers);
    }
    else{
        return sortAlphapidically(allMembers);
    }

}

function sortAlphapidically(filteredMembers){
    const sortedMembers= filteredMembers.sort(function (a, b) {
        if (a.FirstName < b.FirstName) {
          return -1;
        }
        if (a.FirstName > b.FirstName) {
          return 1;
        }
        return 0;
      });
      return sortedMembers;
}

function checkPhoneNumber(phone){
  try {
    return phoneUtil.isValidNumber(phoneUtil.parseAndKeepRawInput(phone));
  } catch (error) {
    return false;
  }
}

function checkPersonalNumber(PersonalNumber){
  const regex = /\d{8}-\d{4}/
  let object ={
    boolean: false,
    message:""
  }
  if(regex.test(PersonalNumber)){
    const newFormatBirthday= PersonalNumber.slice(0,4) + "/" + PersonalNumber.slice(4,6) + "/" + PersonalNumber.slice(6,8);
    if(validator.isDate(newFormatBirthday)){
      object.boolean=true;
      return object
    }
    else{
      object.message= "Wrong birthday"
      return object
    }
  }
  else{
    object.message= "Wrong Format. It should be YYYYMMDD-XXXX"
    return object
  }
}

function checkEmail(email){
  return validator.isEmail(email)
}

// Export the addMember function
export { sendMessage ,filterMembers,sortAlphapidically,checkPhoneNumber,checkPersonalNumber,checkEmail};
