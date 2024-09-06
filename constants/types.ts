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
    CreateEvent:{EventChurch:string};
    EditEvent:{eventId:string};

    Booking:{BookingInfo:object};
    PaymentInfo:{PaymentId:string};
    Payments:{PaymentCategory:object}

    EditMember:{memberId:string}
    MemberInfo:{memberId:string}

    RIKSKOUFhome:undefined,
    Churchs:undefined,
    Events:undefined,
    Members:undefined,
  };

  export interface EventInfo {
    Id: string;
    Title: string;
    ImageInfo: {URL:string,
      assetInfo:any
    };
    Info:string;
    Place:string;
    PriceForNonMembers:string;
    PriceForMembers:string;
    MaxAmountOfBookings:string;
    SwishNumber:string;
    StartDate:Object;
    EndDate:Object;
    Deadline:Object;
    EventInChurch:string;
    Bookings:Array<Object>;
  }

  export interface MemberInfo {
    ProfilePicture: {
      assetInfo:any,
      URL:string
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
    Service:Array<any>; // Depending on how Service is structured
    Title: string;
    Involvments:Array<any>;
    Orginization:Array<any>;
    Category:{
      Name:string,
      Id:string
    };
    LeaderTitle:string;
    ChurchKOUFLeader:Object;
    
  }

  export interface ChurchInfo {
    Name: string;
    StreetName: string;
    PostNumber: string;
    City: string;
    SwishNumber:string;
    
  }
