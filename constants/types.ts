// types.ts
export type RootStackParamList = {
  Index: undefined;
  LogIn: undefined;
  AddMember: undefined;
  ForgotPassword: undefined;

  Home: undefined;
  KOUFtabs: undefined;
  YOUTHtabs: undefined;
  // RIKSKOUFTabs: undefined;

  CreateAttendenceSheet: undefined;
  SheetDetails: { sheetId: string };
  EditAttendenceSheet: { sheetId: string };

  EventInfo: { eventId: string };
  CreateEvent: { EventChurch: string };
  EditEvent: { eventId: string };

  Booking: { BookingInfo: object };
  PaymentInfo: { PaymentId: string };
  Payments: { PaymentCategory: object };

  EditMember: { memberId: string };
  MemberInfo: { memberId: string };

  RIKSKOUFhome: undefined;
  Churchs: undefined;
  Events: undefined;
  Members: undefined;
  AddChurch: undefined;
  CreateQuestion:undefined;
  EditQuestion:undefined
};

export interface EventInfo {
  Id: string;
  Title: string;
  ImageInfo: { URL: string; assetInfo: any };
  Info: string;
  Place: string;
  PriceForNonMembers: string;
  PriceForMembers: string;
  MaxAmountOfBookings: string;
  SwishNumber: string;
  StartDate: Object;
  EndDate: Object;
  Deadline: Object;
  EventInChurch: string;
  EventInChurchId: string;
  Bookings: Array<Object>;
}

export interface MemberInfo {
  ProfilePicture: {
    assetInfo: any;
    URL: string;
  };
  Name: string;
  PersonalNumber: string;
  PhoneNumber: string;
  StreetName: string;
  PostNumber: string;
  City: string;
  Email: string;
  Password: string;
  ConfirmPassword: string;
  Service: Array<string>;
  Title: string;
  Involvments: Array<any>;
  Orginization: string;
  OrginizationId: string;
  Attendence: {
    CountAbsenceCurrentYear: string;
    CountAttendenceCurrentYear: string;
    LastWeekAttendend: string;
  };
  Membership: {
    AmountPaidMonths: string;
  };
  IsActiveInKOUF: string;
  OrginizationNameKOUF: string;
  TitleKOUF: string;
  OrginizationIdKOUF: string;
  IsActiveInRiksKOUF: string;
  TitleRiksKOUF: string;
  Id: string;
}

export interface ChurchInfo {
  Name: string;
  StreetName: string;
  PostNumber: string;
  City: string;
  SwishNumber: string;
  NotAdmin: Array<Object>;
  Admin: Array<Object>;
  Id: string;
}

export interface QuestionInfo {
  Question: string;
  Choices: Array<{choiceText:string, answer:boolean}>;
  AnswerdCorrect: Array<string>;
  AnswerdWrong: Array<string>;
  OrgnizationId:string;
}

export interface SheetInfo {
  AttendedIDS: Array<string>;
  Date: { dateTime: string; justDate: string; justTime: string };
  IsSubmitted: boolean;
  Id:string;
}
