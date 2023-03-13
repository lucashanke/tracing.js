import { v4 } from "uuid";
import { NextFunction, Request, Response } from "express";
import context, { DEFAULT_REQUEST_ID_HEADER } from "./context";

class RequestContext {
  middleware = (requestIdHeader: string = DEFAULT_REQUEST_ID_HEADER) => (req: Request, res: Response, next: NextFunction): any => {
    const requestIdValue = req.get(requestIdHeader) || v4();

    res.setHeader(requestIdHeader, requestIdValue);

    return context.execute(next).with({
      [requestIdHeader]: requestIdValue
    });
  };
}

const { middleware } = new RequestContext();

export default middleware;
