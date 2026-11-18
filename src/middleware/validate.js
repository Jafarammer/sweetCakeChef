import { logging } from "../app/logging.js";
import { NODE_ENV } from "../utils/env.js";

const validate = (schema) => {
  return (req, res, next) => {
    const result = schema.safeParse(req.body);

    if (!result.success) {
      const errors = result.error.issues.map((issue) => ({
        field: issue.path.join("."),
        message: issue.message,
      }));

      logging.warn(
        `[VALIDATION] Failed: ${req.method} ${req.originalUrl} | ${JSON.stringify(errors)}`,
      );

      return res.status(400).json({
        success: false,
        message: "Validation failed",
        errors,
      });
    }

    req.body = result.data;

    if (NODE_ENV === "development") {
      logging.debug(`[VALIDATION] Success: ${req.method} ${req.originalUrl}`);
    }

    next();
  };
};

export default validate;
