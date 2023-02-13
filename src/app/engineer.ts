export interface Engineer {
  name: string;
  hero: string;
  city: string;
  state: string;
  country: string;
  avatar: string;
  coverImg: string;
  bio: string;
  searchStatus: {
    activelylooking: boolean;
    open: boolean;
    notinterested: boolean;
    invisible: boolean;
  };
  roleType: {
    partTime: boolean;
    fullTimeContract: boolean;
    fullTimeEmployment: boolean;
  };
  roleLevel: {
    junior: boolean;
    middle: boolean;
    senior: boolean;
    principal: boolean;
    cLevel: boolean;
  };
  website: string;
  github: string;
  twitter: string;
  linkedin: string;
  stackoverflow: string;
}
