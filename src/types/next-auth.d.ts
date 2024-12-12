import NextAuth from "next-auth";

declare module "next-auth" {
  interface Session {
    usr_id?: string;
    ug_group?: string;
    ug_description?: string;
    ug_isactive?: string;
    user: {
      username?: string;
      name?: string;
    };
  }
}
