import { ErrorRequestHandler, NextFunction, Request, Response } from "express";
import httpStatus from "http-status";

const globalErrorHandler: ErrorRequestHandler = (
  err: any,
  req: Request,
  res: Response,
  next: NextFunction,
) => {
  const statusCode = err.statusCode || httpStatus.INTERNAL_SERVER_ERROR;
  const message = err.message || "Something went wrong!";

  res.status(statusCode).json({
    success: false,
    message,
    errorSources: err.errorSources || [
      {
        path: "",
        message: err.message || "Internal Server Error",
      },
    ],
    stack: process.env.NODE_ENV === "development" ? err.stack : null,
  });
};

export default globalErrorHandler;
