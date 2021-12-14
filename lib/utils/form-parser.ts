import { Handler } from "./rest";
import form from "formidable";

export default function formParser(opts?: form.Options): Handler<any> {
  return (req, _res, next) => {
    form(opts).parse(req, (err, fields, files) => {
      req.body = fields || {};
      req.files = files || {};
      next!(err ? err : undefined);
    });
  };
}

declare module "http" {
  interface IncomingMessage {
    files: form.Files;
  }
}
