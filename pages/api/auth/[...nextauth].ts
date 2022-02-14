import NextAuth from "next-auth";
import bcrypt from "bcrypt";



import GoogleProvider from "next-auth/providers/google";
import FacebookProvider from "next-auth/providers/facebook";
import GithubProvider from "next-auth/providers/github";

import CredentialsProvider from "next-auth/providers/credentials";

import { UserModel } from "../../../lib/db/Connection";
import { User } from "../../../lib/db/DbTypes";
import { DefaultUser } from "next-auth/core/types";


// import AppleProvider from "next-auth/providers/apple"
// import EmailProvider from "next-auth/providers/email"

// For more information on each option (and a full list of options) go to
// https://next-auth.js.org/configuration/options
interface ProviderUser extends DefaultUser {
  phone?: string,
  roles?: string[],
}

export default NextAuth({
  // https://next-auth.js.org/configuration/providers
  providers: [
    /* EmailProvider({
         server: process.env.EMAIL_SERVER,
         from: process.env.EMAIL_FROM,
       }),
    // Temporarily removing the Apple provider from the demo site as the
    // callback URL for it needs updating due to Vercel changing domains

    Providers.Apple({
      clientId: process.env.APPLE_ID,
      clientSecret: {
        appleId: process.env.APPLE_ID,
        teamId: process.env.APPLE_TEAM_ID,
        privateKey: process.env.APPLE_PRIVATE_KEY,
        keyId: process.env.APPLE_KEY_ID,
      },
    }),
    */
    FacebookProvider({
      clientId: process.env.FACEBOOK_ID ?? "",
      clientSecret: process.env.FACEBOOK_SECRET ?? "",
    }),
    GoogleProvider({
      clientId: process.env.GOOGLE_ID ?? "",
      clientSecret: process.env.GOOGLE_SECRET ?? "",
    }),
    GithubProvider({
      clientId: process.env.GITHUB_ID,
      clientSecret: process.env.GITHUB_SECRET,
      // https://docs.github.com/en/developers/apps/building-oauth-apps/scopes-for-oauth-apps
    }),
    // // TwitterProvider({
    // //   clientId: process.env.TWITTER_ID,
    // //   clientSecret: process.env.TWITTER_SECRET,
    // // }),
    // Auth0Provider({
    //   clientId: process.env.AUTH0_ID,
    //   clientSecret: process.env.AUTH0_SECRET,
    //   issuer: process.env.AUTH0_ISSUER,
    // }),
    CredentialsProvider({
      // The name to display on the sign in form (e.g. "Sign in with...")
      name: "Credentials",
      // The credentials is used to generate a suitable form on the sign in page.
      // You can specify whatever fields you are expecting to be submitted.
      // e.g. domain, username, password, 2FA token, etc.
      // You can pass any HTML attribute to the <input> tag through the object.
      credentials: {
        username: { label: "Username", type: "text", placeholder: "jsmith" },
        password: { label: "Password", type: "password" }
      },
      async authorize(credentials, /*req*/_) {
        // Add logic here to look up the user from the credentials supplied
        // if (counter >= 5) {
        //   setTimeout(() => {
        //     counter = 0;
        //   }, 30000);
        //   return Promise.reject("Please try again later");
        // }
        // console.log(counter);
        // counter++;
        const loginInfo = credentials;
        const user = await UserModel.findOne({ mail: loginInfo!.username }).lean();

        if (user !== null) {
          const isMatched = await bcrypt.compare(loginInfo!.password, user.password);

          if (isMatched === true) {
            const newUser: ProviderUser = { id: user._id, name: `${user.firstName} ${user.lastName}`, email: user.mail, roles: user.roles };
            return newUser;
          }
        }

        // throw new Error('Something is totally fucked up')
        return null;

        // const demoUser = { id: 2333, name: "J Smith", email: credentials?.username || "jsmith@example.com", logger: 'credential' };
        // const { username: user } = credentials
        // database look up
        // if (user) {
        // Any object returned will be saved in `user` property of the JWT
        //   return user;
        // } else {
        // If you return null then an error will be displayed advising the user to check their details.
        // return null;

        // You can also Reject this callback with an Error thus the user will be sent to the error page with the error message as a query parameter
        // }
      }
    })

  ],
  // The secret should be set to a reasonably long random string.
  // It is used to sign cookies and to sign and encrypt JSON Web Tokens, unless
  // a separate secret is defined explicitly for encrypting the JWT.
  secret: process.env.SECRET,

  session: {
    // Use JSON Web Tokens for session instead of database sessions.
    // This option can be used with or without a database for users/accounts.
    // Note: `strategy` should be set to 'jwt' if no database is used.
    strategy: "jwt",

    // Seconds - How long until an idle session expires and is no longer valid.
    // maxAge: 30 * 24 * 60 * 60, // 30 days

    // Seconds - Throttle how frequently to write to database to extend a session.
    // Use it to limit write operations. Set to 0 to always update the database.
    // Note: This option is ignored if using JSON Web Tokens
    // updateAge: 24 * 60 * 60, // 24 hours
  },

  // JSON Web tokens are only used for sessions if the `jwt: true` session
  // option is set - or by default if no database is specified.
  // https://next-auth.js.org/configuration/options#jwt
  jwt: {
    // You can define your own encode/decode functions for signing and encryption
    // if you want to override the default behaviour.
    // encode: async ({ secret, token, maxAge }) => {},
    // decode: async ({ secret, token, maxAge }) => {},
  },

  // You can define custom pages to override the built-in ones. These will be regular Next.js pages
  // so ensure that they are placed outside of the '/api' folder, e.g. signIn: '/auth/mycustom-signin'
  // The routes shown here are the default URLs that will be used when a custom
  // pages is not specified for that route.
  // https://next-auth.js.org/configuration/pages
  pages: {
    signIn: "/login",  // Displays signin buttons
    // signOut: '/auth/signout', // Displays form with sign out button
    // error: '/auth/error', // Error code passed in query string as ?error=
    // verifyRequest: '/auth/verify-request', // Used for check email page
    // newUser: null // If set, new users will be directed here on first sign in
  },

  // Callbacks are asynchronous functions you can use to control what happens
  // when an action is performed.
  // https://next-auth.js.org/configuration/callbacks
  callbacks: {
    async signIn({ user, account, profile: _, email, credentials }) {
      console.log("signIn");

      if (!credentials) {
        const { email, name } = user;
        const resUser: User = await UserModel.findOne({
          mail: email ?? ""
        }).lean();

        const provider = account.provider as "github" | "google" | "facebook";
        if (resUser !== null) {
          if (!resUser[provider]) {
            await UserModel.findOneAndUpdate({ mail: email ?? "" }, { [account.provider]: account.providerAccountId }, { new: true });
          }
          return true;
        }
        const newUserInfo = {
          firstName: name,
          mail: email,
          [provider]: account.providerAccountId,
          password: user.id
        };
        newUserInfo.password = await bcrypt.hash(newUserInfo.password, process.env.DB_SALT_ROUNDS || 9);

        const res = await (new UserModel(newUserInfo)).save();
        if (res) {
          return true;
        }
        throw new Error("Unsuccessful login! Please try again later or use another method.");
      }
      return true;
    },
    async redirect({ url: _, baseUrl }) { return baseUrl; },

    async jwt({ token, user, account }) {
      // Persist the OAuth access_token to the token right after signin
      if (account) {
        // token.accessToken = account.access_token;
        token.roles = user?.roles as string[];
        token.provider = account.provider ?? "";
      };
      return token;
    },
    async session({ session, user: _, token }) {
      // Send properties to the client, like an access_token from a provider.
      // session.accessToken = token.accessToken;
      session.userRoles = token.roles ?? ["User"];
      session.user.id = token.sub ?? "";
      session.provider = token.provider ?? "";
      // session.user.id: = token.sub;
      // console.log(session);
      return session;
    }
    // async jwt({ token, user, account, profile, isNewUser }) { return token }
  },

  // Events are useful for logging
  // https://next-auth.js.org/configuration/events
  events: {},

  // You can set the theme to 'light', 'dark' or use 'auto' to default to the
  // whatever prefers-color-scheme is set to in the browser. Default is 'auto'
  theme: {
    colorScheme: "light",
  },

  // Enable debug messages in the console if you are having problems
  debug: false,
});
