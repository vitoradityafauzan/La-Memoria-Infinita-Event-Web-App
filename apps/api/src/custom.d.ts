type IUser = {
  idUser: number;
  role: string;
};

declare namespace Express {
  export interface Request {
    user?: User;
  }
}
