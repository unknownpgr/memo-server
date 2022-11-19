export interface ITag {
  id: number;
  value: string;
}

export interface IMemo {
  id: number;
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
