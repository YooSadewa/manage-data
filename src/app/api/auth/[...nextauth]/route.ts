import axios from "axios";
import { NextAuthOptions } from "next-auth";
import NextAuth from "next-auth";
import CredentialsProvider from "next-auth/providers/credentials";

const authOptions: NextAuthOptions = {
  session: {
    strategy: "jwt",
    maxAge: 12 * 60 * 60,
  },
  secret: process.env.NEXTAUTH_SECRET,
  providers: [
    CredentialsProvider({
      type: "credentials",
      name: "Credentials",
      credentials: {
        username: {
          label: "Username",
          type: "text",
          placeholder: "Enter your username",
        },
        password: {
          label: "Password",
          type: "password",
          placeholder: "Enter your password",
        },
      },
      async authorize(credentials) {
        try {
          const res = await axios.post(
            `${process.env.SERVICE_URL}/login`,
            credentials,
            {
              validateStatus(status) {
                return (
                  (status >= 200 && status < 300) ||
                  status === 403 ||
                  status === 401
                );
              },
            }
          );

          if (res.status === 200) {
            return res.data.data;
          } else {
            return null;
          }
        } catch (error) {
          return null;
        }
      },
    }),
  ],
  callbacks: {
    async jwt({ token, account, user }: any) {
      //   console.log("user", user);
      if (account?.provider === "credentials") {
        token.usr_id = user.usr_id;
        token.usr_name = user.usr_name;
        token.usr_username = user.usr_username;
        token.ug_id = user.ug_id;
        token.ug_group = user.ug_group;
        token.ug_description = user.ug_description;
        token.ug_isactive = user.ug_isactive;
      }
      return token;
    },

    async session({ session, token }: any) {
      console.log("token", token);
      if ("usr_id" in token) {
        session.user.id = token.usr_id;
      }
      if ("usr_name" in token) {
        session.user.name = token.usr_name;
      }
      if ("usr_username" in token) {
        session.user.username = token.usr_username;
      }
      if ("ug_id" in token) {
        session.user.usergroup_id = token.ug_id;
      }
      if ("ug_group" in token) {
        session.user.usergroup = token.ug_group;
      }
      if ("ug_description" in token) {
        session.user.usergroup = token.ug_description;
      }
      if ("ug_isactive" in token) {
        session.user.usergroup = token.ug_isactive;
      }
      console.log("session", session);
      return session;
    },
  },
};

const handler = NextAuth(authOptions);
export { handler as GET, handler as POST };
