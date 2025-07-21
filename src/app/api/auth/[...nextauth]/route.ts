import NextAuth from "next-auth";
import GoogleProvider from "next-auth/providers/google";

// Define admin emails - only these Gmail accounts can access admin features
// IMPORTANT: Add your actual Gmail addresses here to grant admin access
const ADMIN_EMAILS = [
  "admin@colortech.co.zw", // Your main admin email
  "mrshepard18@gmail.com", // Additional admin access
  // Add more admin emails here as needed
  // "your-email@gmail.com",
  // "another-admin@gmail.com",
];

const handler = NextAuth({
  secret: process.env.NEXTAUTH_SECRET || "your-secret-key-here",
  providers: [
    GoogleProvider({
      clientId: process.env.GOOGLE_CLIENT_ID!,
      clientSecret: process.env.GOOGLE_CLIENT_SECRET!,
    }),
  ],
  pages: {
    signIn: "/login",
  },
  callbacks: {
    async signIn({ user, account, profile }) {
      // Allow sign in for any Google account, but we'll assign roles in the JWT callback
      return true;
    },
    async jwt({ token, user, account }) {
      if (user) {
        token.id = user.id;
        // Check if the user's email is in the admin list
        token.role = ADMIN_EMAILS.includes(user.email || "")
          ? "admin"
          : "client";
      }
      return token;
    },
    async session({ session, token }) {
      session.user.id = token.id as string;
      session.user.role = token.role as string;
      return session;
    },
  },
});

export { handler as GET, handler as POST };
