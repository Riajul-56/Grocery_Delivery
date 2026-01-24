import NextAuth from "next-auth";
import Credentials from "next-auth/providers/credentials";
import User from "./models/user.model";
import bcrypt from "bcryptjs";
import Google from "next-auth/providers/google";
import connectdb from "./lib/db";

export const { handlers, signIn, signOut, auth } = NextAuth({
  providers: [
    //? ================= credentials provider for email/password authentication =================

    Credentials({
      credentials: {
        email: { label: "email", type: "email" },
        password: { label: "Password", type: "password" },
      },
      async authorize(credentials, request) {
        await connectdb();
        const email = credentials.email;
        const password = credentials.password as string;
        const user = await User.findOne({ email });

        if (!user) {
          throw new Error("No user found");
        }
        const isMatch = await bcrypt.compare(password, user.password);
        if (!isMatch) {
          throw new Error("Incorrect password");
        }
        return {
          id: user._id.toString(),
          email: user.email,
          name: user.name,
          role: user.role,
        };
      },
    }),

    //? ================= Google Provider =================

    Google({
      clientId: process.env.GOOGLE_CLIENT_ID as string,
      clientSecret: process.env.GOOGLE_CLIENT_SECRET as string,
    }),
  ],

  //? ================= callbacks =================

  callbacks: {
    async signIn({ user, account }) {
      if(account?.provider === "google") {
        await connectdb();
        let dbUser = await User.findOne({ email: user.email });
        if (!dbUser) {
           dbUser = await User.create({
            name: user.name,
            email: user.email,
            image: user.image,
            
          });
        }
        user.id = dbUser._id.toString();
        user.role = dbUser.role;
      }
      return true;
    },

    //?token er modhe user er information rakha hoy
    jwt({ token, user }) {
      if (user) {
        token.id = user.id;
        token.name = user.name;
        token.email = user.email;
        token.role = user.role;
      }
      return token;
    },

    session({ session, token }) {
      if (session.user) {
        session.user.id = token.id as string;
        session.user.name = token.name as string;
        session.user.email = token.email as string;
        session.user.role = token.role as string;
      }
      return session;
    },
  },

  //? ================= pages =================

  pages: {
    signIn: "/login",
    error: "/login",
  },

  //? ================= session & secret =================
  session: {
    strategy: "jwt",
    maxAge: 10 * 24 * 60 * 60 * 1000, // 10 days
  },

  secret: process.env.AUTH_SECRET,
});
