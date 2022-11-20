export interface ITag {
  id: number;
  value: string;
}

export interface IMemo {
  number: number;
  content: string;
  tags: ITag[];
}

export interface IUser {
  id: number;
  username: string;
}

declare module "iron-session" {
  interface IronSessionData {
    user?: IUser;
  }
}
