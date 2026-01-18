import NextAuth from "next-auth";
import Credentials from "next-auth/providers/credentials";
import connectdb from "./lib/db";
import User from "./models/user.model";
import bcrypt from "bcryptjs";

export const { handlers, signIn, signOut, auth } = NextAuth({
  providers: [
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
          id: user._id,
          email: user.email,
          name: user.name,
          role: user.role,
        };
      },
    }),
  ],

  callbacks:{
    //token er modhe user er information rakha hoy
    jwt({token,user}){
      if(user){
        token.id=user.id;
        token.name=user.name;
        token.email=user.email;
        token.role=user.role;
      }
    }
  }

});
