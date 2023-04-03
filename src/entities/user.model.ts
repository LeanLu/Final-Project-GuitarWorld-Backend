import { GuitarStructure } from './guitar.model';

export type UserStructure = {
  id: string;
  username: string;
  email: string;
  password: string;
  role: string;
  myGuitars: GuitarStructure[];
  token?: string;
};
