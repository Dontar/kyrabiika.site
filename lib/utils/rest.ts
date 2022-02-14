import { NextApiRequest, NextApiResponse } from "next";
import { sessionOptions } from "./session";
import { getSession } from "next-auth/react";
import { Session } from "next-auth";

export type Handler<T = any> = (req: Omit<NextApiRequest, "body"> & { body: T, session?: Session }, res: NextApiResponse<T>, next?: (result?: unknown | Error) => unknown) => void | Promise<void>;

type HTTPMethod = "get" | "post" | "put" | "patch" | "del";
const HTTPMethods: HTTPMethod[] = ["get", "post", "put", "patch", "del"];

interface RestAPIBase extends Record<HTTPMethod, <T>(handler: Handler<T>) => RestAPIBase> { }

interface RestAPI extends RestAPIBase {
  use(handler: Handler): RestAPI;
}

export default function rest() {
  const handlers = new Map<string, Handler>();
  const middleware = new Set<Handler>();

  const mainHandler =
    async (req: NextApiRequest, res: NextApiResponse<any>) => {
      try {

        for (const handler of middleware) {
          await handler(req, res);
        }

        if (!res.writableEnded) {
          if (handlers.has(req.method!)) {
            const handler = handlers.get(req.method!)!;
            await handler(req, res);
          } else {
            res.setHeader("Allow", [...handlers.keys()]);
            res.status(405).end(`Method ${req.method} Not Allowed`);
          }
        }

      } catch (e) {
        console.error(e);
        if (!res.writableEnded) {
          res.status(500).end(e instanceof Error ? e.message : e as string);
        }
      }
    };

  const api = {
    use(handler: Handler) {
      middleware.add((req, res) => {
        return new Promise((resolve, reject) => {
          const autoResolve = setTimeout(() => resolve(), 30000);
          handler(req, res, result => {
            clearTimeout(autoResolve);
            if (result instanceof Error) {
              return reject(result);
            }
            return resolve();
          });
        });
      });
      return this;
    }
  } as RestAPI;
  HTTPMethods.forEach(method => {
    api[method] = (handler: Handler) => {
      handlers.set(method.toUpperCase(), handler);
      return api;
    };
  });

  // const withSession = {} as RestAPIBase;
  // HTTPMethods.forEach(method => {
  //   withSession[method] = (handler: Handler) => {
  //     handlers.set(method.toUpperCase(), withIronSessionApiRoute(handler, sessionOptions));
  //     return withSession;
  //   };
  // });
  const withSession = {} as RestAPIBase;
  HTTPMethods.forEach(method => {
    withSession[method] = (handler: Handler) => {
      handlers.set(method.toUpperCase(), handler);
      return withSession;
    };
  });

  const withAuth = {} as RestAPIBase;
  HTTPMethods.forEach(method => {
    withAuth[method] = (handler: Handler) => {
      handlers.set(method.toUpperCase(), async (req, res) => {
        const session = await getSession({ req });
        if (session) {
          req.session = session;
          return handler(req, res);
        } else {
          res.status(401).end();
        }
      });
      return withAuth;
    };
  });

  return Object.assign(
    mainHandler,
    api,
    { withSession },
    { withAuth }
  );
}
