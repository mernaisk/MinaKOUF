import validator from 'validator'
// import sendEmailAPI from "../scripts/emailService"

function sendMessage(youthMessage) {}

function filterMembers(allMembers, searchString) {
  const modifiedSearchString =
    searchString.charAt(0).toUpperCase() + searchString.slice(1).toLowerCase();
  if (searchString != "") {
    const filteredMembers = allMembers.filter((member) => {
      return member.FirstName.startsWith(modifiedSearchString);
    });
    return sortAlphapidically(filteredMembers);
  } else {
    return sortAlphapidically(allMembers);
  }
}

function sortAlphapidically(filteredMembers) {
  if(filteredMembers){
    const sortedMembers = filteredMembers.sort(function (a, b) {
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
  else{
    return filteredMembers;
  }

}

function sortDate(sheets){
  return sheets.sort((a, b) => a?.date - b?.date);
}

function checkPhoneNumber(phone) {
  // try {
  //   return phoneUtil.isValidNumber(phoneUtil.parseAndKeepRawInput(phone));
  // } catch (error) {
  //   return false;
  // }
}

function checkPersonalNumber(PersonalNumber) {
  const regex = /^\d{8}-\d{4}$/;
  let object = {
    boolean: false,
    message: "",
  };
  if (regex.test(PersonalNumber)) {
    const newFormatBirthday =
      PersonalNumber.slice(0, 4) +
      "/" +
      PersonalNumber.slice(4, 6) +
      "/" +
      PersonalNumber.slice(6, 8);
    if (validator.isDate(newFormatBirthday)) {
      object.boolean = true;
      return object;
    } else {
      object.message = "Wrong birthday";
      return object;
    }
  } else {
    object.message = "Wrong Format. It should be YYYYMMDD-XXXX";
    return object;
  }
}

function checkServiceOptions(option) {
  return true;
}

function checkEmail(email) {
  return validator.isEmail(email);
}

function getLeadersNames(leaders){
  const leadersOptions= []
  const addLeaderOption = (object) => {
    let leader = {label:object.FirstName + " " + object.LastName, value:object}
    leadersOptions.push(leader)
  }
  leaders?.map(addLeaderOption)
  return leadersOptions
}

const titleOptions = [
  { label: "Ungdom", value: "Ungdom" },
  { label: "Teaternansvarig", value: "Teaternansvarig" },
  { label: "Aktivitetsansvarig", value: "Aktivitetsansvarig" },
  { label: "Ordförande", value: "Ordförande" },
  { label: "Mediaansvarig", value: "Mediaansvarig" },
  { label: "Visordförande", value: "Visordförande" },
  { label: "Utbildningsansvaig", value: "Utbildningsansvaig" },
  { label: "Kommunansvarig", value: "Kommunansvarig" },
  { label: "Bildaansvarig", value: "Bildaansvarig" },
  { label: "Sekreterare", value: "Sekreterare" },
  { label: "köransvarig", value: "köransvarig" },
];

const serviceOptions = [
  { label: "Teatern", value: "Teatern" },
  { label: "Kören", value: "Kören" },
  { label: "Aktiviteter", value: "Aktiviteter" },
  { label: "Eftekad", value: "Eftekad" },
  { label: "Utbildning", value: "Utbildning " },
];

const attendenceOptions = [
  { label: "Meeting", value: "Meeting" },
  { label: "Activity", value: "Activity" },
  { label: "Conference", value: "Conference" },
  { label: "Koral", value: "Koral" },
  { label: "Teater", value: "Teater" },
];





export {

  sortDate,
  checkServiceOptions,
  serviceOptions,
  titleOptions,
  sendMessage,
  filterMembers,
  sortAlphapidically,
  checkPhoneNumber,
  checkPersonalNumber,
  checkEmail,
  getLeadersNames,
  attendenceOptions,
};
