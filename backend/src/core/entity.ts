export interface User {
  id: number;
  username: string;
  hashedPassword: string;
  salt: string;
}

export interface Memo {
  number: number;
  content: string;
  tags: string[];
  createdAt: string;
  updatedAt: string;
}
