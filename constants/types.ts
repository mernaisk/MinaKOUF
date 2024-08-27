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

  export interface MemberInfo {
    ProfilePicture: object;
    Name: string;
    PersonalNumber: string;
    PhoneNumber: string;
    StreetName: string;
    PostNumber: string;
    City: string;
    Email: string;
    Password: string;
    ConfirmPassword: string;
    Service:Array<any>; // Depending on how Service is structured
    Title: string;
    Involvments:Array<any>;
    Orginization:Array<any>;
    Category:{
      Name:string,
      Id:string
    };
    LeaderTitle:string;
    ChurchKOUFLeader:object;
    
  }