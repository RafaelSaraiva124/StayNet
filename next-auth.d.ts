import { DefaultSession } from "next-auth";

declare module "next-auth" {
  interface Session {
    user: {
      id: string;
      role: "Admin" | "Partner" | "Pending" | "User";
    } & DefaultSession["user"];
  }

  interface User {
    id: string;
    role: "Admin" | "Partner" | "Pending" | "User";
  }
}

declare module "next-auth/jwt" {
  interface JWT {
    id: string;
    role: "Admin" | "Partner" | "Pending" | "User";
  }
}
