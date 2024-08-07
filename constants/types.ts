// types.ts
export type RootStackParamList = {
    Index: undefined;
    LogIn: undefined;
    AddMember: undefined;
    ForgotPassword: undefined;

    Home:undefined;
    KOUFtabs:undefined;
    YOUTHtabs: undefined;
    // RIKSKOUFTabs: undefined;

    CreateAttendenceSheet: undefined;
    SheetDetails:{sheetId:string};
    EditAttendenceSheet:{sheetId:string};

    EventInfo:{eventId:string};
    CreateEvent:undefined;
    EditEvent:{eventId:string};

    EditMember:{memberId:string}
    MemberInfo:{memberId:string}

    RIKSKOUFhome:undefined,
    Churchs:undefined,
    Events:undefined,
    Payments:undefined,
    Members:undefined,
  };

  export interface EventItem {
    Id: string;
    Title: string;
    ImageInfo?: {
      URL: string;
    };
    Info:String;
    // Add other properties as needed
  }