export class User {
  id?: string;
  email!: string;
  password!: string;
  fullName!: string;
  img?: File; // Assuming img is a File object
  isAdmin?: string;
}
