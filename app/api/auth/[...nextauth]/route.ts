import NextAuth from 'next-auth';
import bcrypt from 'bcrypt';
import CredentialsProvider from 'next-auth/providers/credentials';
import User from '@/app/models/userModel';
//import { connectDB2 } from '@/app/db/db';
import { dbConnect } from '@/app/db/dbConnect';

export const authOptions = {
  providers: [
    CredentialsProvider({
      name: 'credentials',
      credentials: {},
      async authorize(credentials) {
        const { email, password } = credentials;

          // Static Auth Implementation
          if (email === 'john@gmail.com' && password === '123') {
            return {
              id: 'static-user-id',
              email: 'john@gmail.com',
              role: 'TAX_TECH',
              firstName: 'John',
              lastName: 'Doe',
              isApproved: true,
            };
          }
          return null;

          /*
          try {
            //console.log(email, password);
            //await connectDB2();
            const conn = await dbConnect('Prod');
              const UserMongo = conn.model('UserDocument');
            const user = await UserMongo.findOne({ email });
            //console.log(user);
            if (!user) {
              //console.log(user);
              return null;
            }
  
            const passwordsMatch = await bcrypt.compare(password, user.password);
  
            if (!passwordsMatch) {
              //console.log(passwordsMatch);
              return null;
            }
            if (!user.isApproved) {
              return null;
            }
            return {
              id: user._id,
              email: user.email,
              role: user.role,
              firstName: user.firstName,
              lastName: user.lastName,
              isApproved: user.isApproved,
            };
          } catch (error) {
            console.log('Error: ', error);
            return null;
          }
          */
      },
    }),
  ],

  session: {
    strategy: 'jwt',
    maxAge: 3 * 60 * 60, // **Session expires after 30 minutes** (in seconds)
    updateAge: 5 * 60, // **Session is refreshed every 5 minutes** if active
  },

  callbacks: {
    async jwt({ token, user }) {
      // Merge user info into the token if the user object exists
      if (user) {
        return {
          ...token,
          id: user.id,
          email: user.email,
          role: user.role,
          firstName: user.firstName,
          lastName: user.lastName,
          isApproved: user.isApproved,
        };
      }
      return token;
    },
    async session({ session, token }) {
      // Directly assign the token's user-related properties to session.user
      session.user = {
        ...session.user,
        id: token.id,
        email: token.email,
        role: token.role,
        firstName: token.firstName,
        lastName: token.lastName,
        isApproved: token.isApproved,
      };
      return session;
    },
  },

  secret: process.env.nextauthsecret,
  pages: {
    signIn: '/login',
  },
};

const handler = NextAuth(authOptions);

export { handler as GET, handler as POST };
