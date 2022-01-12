import type { IronSessionOptions } from "iron-session";

export type LogInUser = {
  isLoggedIn: boolean;
  user: string;
  orders: any[];
}

export const sessionOptions: IronSessionOptions = {
  password: process.env.SECRET_COOKIE_PASSWORD || "top secret pass which is 32 symbols long blablablablabalabalaalalakkdkdkdkdkdk",
  cookieName: "Kyrabiika",
  // secure: true should be used in production (HTTPS) but can't be used in development (HTTP)
  cookieOptions: {
    secure: process.env.NODE_ENV === "production",
  },
};

// This is where we specify the typings of req.session.*
declare module "iron-session" {
  interface IronSessionData {
    user?: LogInUser;
  }
}

export const imagesRootPath = process.env.DB_IMAGES ?? "/workspaces/kyrabiika.site/images";
