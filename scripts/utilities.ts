import validator from "validator";
import { parsePhoneNumberFromString } from "libphonenumber-js";
import { MemberInfo, SheetInfo } from "@/constants/types";

function filterMembers(allMembers, searchString) {
  const modifiedSearchString =
    searchString.charAt(0).toUpperCase() + searchString.slice(1).toLowerCase();

  if (searchString != "") {
    const filteredMembers = allMembers.filter((member) => {
      return member.Name.startsWith(modifiedSearchString);
    });
    return sortAlphapidically(filteredMembers);
    // }
  } else {
    return sortAlphapidically(allMembers);
  }
}

function sortAlphapidically(filteredMembers) {
  if (filteredMembers) {
    const sortedMembers = filteredMembers.sort(function (a, b) {
      if (a.Name < b.Name) {
        return -1;
      }
      if (a.Name > b.Name) {
        return 1;
      }
      return 0;
    });
    return sortedMembers;
  } else {
    return filteredMembers;
  }
}

function sortDate(sheets) {
  return sheets.sort((a, b) => a?.date - b?.date);
}

const validatePhoneNumber = (value) => {
  const phoneNumber = parsePhoneNumberFromString(value);
  if (!phoneNumber) {
    return "Invalid phone number";
  }
  if (!phoneNumber.isValid()) {
    return "Phone number is not valid";
  }
  return true;
};

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

function getLeadersNames(leaders) {
  const leadersOptions = [];
  const addLeaderOption = (object) => {
    let leader = { label: object.Name, value: object };
    leadersOptions.push(leader);
  };
  leaders?.map(addLeaderOption);
  return leadersOptions;
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
  { Name: "Teatern", Id: "Teatern", Disabled: false },
  { Name: "Kören", Id: "Kören", Disabled: false },
  { Name: "Aktiviteter", Id: "Aktiviteter", Disabled: false },
  { Name: "Eftekad", Id: "Eftekad", Disabled: false },
  { Name: "Utbildning", Id: "Utbildning", Disabled: false },
];

const membersOptions = [
  { Name: "Namn", Id: "Namn", Disabled: false },
  { Name: "Personnummer", Id: "Personnummer", Disabled: false },
  { Name: "Epost", Id: "Epost", Disabled: false },
  { Name: "Telefonnumber", Id: "Telefonnumber", Disabled: false },
  { Name: "Adress", Id: "Adress", Disabled: false },
  { Name: "Tjänster", Id: "Tjänster", Disabled: false },
];

const leadersOptions = [
  { Name: "Namn", Id: "Namn", Disabled: false },
  { Name: "Personnummer", Id: "Personnummer", Disabled: false },
  { Name: "Epost", Id: "Epost", Disabled: false },
  { Name: "Telefonnumber", Id: "Telefonnumber", Disabled: false },
  { Name: "Adress", Id: "Adress", Disabled: false },
  { Name: "Title", Id: "Title", Disabled: false },
];

const MonthsWithNumber = {
  January: "01",
  February: "02",
  March: "03",
  April: "04",
  May: "05",
  June: "06",
  July: "07",
  August: "08",
  September: "09",
  October: "10",
  November: "11",
  December: "12",
} as const;

const months = [
  { Name: "January", Id: "January", Disabled: false },
  { Name: "February", Id: "February", Disabled: false },
  { Name: "March", Id: "March", Disabled: false },
  { Name: "April", Id: "April", Disabled: false },
  { Name: "May", Id: "May", Disabled: false },
  { Name: "June", Id: "June", Disabled: false },
  { Name: "July", Id: "July", Disabled: false },
  { Name: "August", Id: "August", Disabled: false },
  { Name: "September", Id: "September", Disabled: false },
  { Name: "October", Id: "October", Disabled: false },
  { Name: "November", Id: "November", Disabled: false },
  { Name: "December", Id: "December", Disabled: false },]

  const sortAttendanceByDate = (attendanceData: SheetInfo[]) => {
    return attendanceData.sort((a, b) => {
      const dateA = new Date(a.Date.justDate); 
      const dateB = new Date(b.Date.justDate);
      return dateB.getTime() - dateA.getTime(); 
    });
  };

  const sortMembersByAbsence = (allMembers: MemberInfo[]) => {
    return allMembers.sort((a, b) => {
      const absence1:number = parseInt(a.Attendence.LastWeekAttendend); 
      const absence2: number = parseInt(b.Attendence.LastWeekAttendend);
      return absence2 - absence1; 
    });
  };
const calculateMonthlyAttendance = (sheets:any, totalMembers:any) => {
  const monthData:any = {};
  const allMonths = ["01", "02", "03", "04", "05", "06", "07", "08", "09", "10", "11", "12"];

  allMonths.forEach((month:any) => {
    monthData[month] = [];
  });

  sheets.forEach((sheet:any) => {
    const month = sheet.Date.justDate.slice(5, 7); 
    const attendedCount = sheet.AttendedIDS ? Object.keys(sheet.AttendedIDS).length : 0;
    monthData[month].push((attendedCount / totalMembers) * 100); 
  });

  const monthPercentages = Object.keys(monthData).map((month) => {
    const totalAttended = monthData[month].reduce((acc:any, cur:any) => acc + cur, 0);
    const avgAttendance = monthData[month].length > 0 ? totalAttended / monthData[month].length : 0;
    return { month, percentage: Math.round(avgAttendance) }; 
  });

  monthPercentages.sort((a, b) => parseInt(a.month) - parseInt(b.month));

  return monthPercentages; 
};

export {
  sortDate,
  checkServiceOptions,
  serviceOptions,
  titleOptions,
  filterMembers,
  sortAlphapidically,
  checkPersonalNumber,
  checkEmail,
  getLeadersNames,
  validatePhoneNumber,
  calculateMonthlyAttendance,
  membersOptions,
  months,
  MonthsWithNumber,
  sortAttendanceByDate,
  sortMembersByAbsence,
  leadersOptions
};
