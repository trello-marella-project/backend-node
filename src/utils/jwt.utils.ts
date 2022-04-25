import jwt from "jsonwebtoken";

export const signJwt = (
  object: Object,
  keyName: "JWT_ACCESS_SECRET" | "JWT_REFRESH_SECRET",
  expiresName: "JWT_ACCESS_LIFETIME" | "JWT_REFRESH_LIFETIME"
) => {
  return jwt.sign(object, process.env[keyName] as string, {
    expiresIn: process.env[expiresName] as string,
  });
};

export const verifyJwt = (
  token: string,
  keyName: "JWT_ACCESS_SECRET" | "JWT_REFRESH_SECRET"
) => {
  try {
    const decoded = jwt.verify(token, process.env[keyName] as string);
    return {
      valid: true,
      expired: false,
      decoded,
    };
  } catch (error: any) {
    return {
      valid: false,
      expired: error.message === "jwt expired",
      decoded: null,
    };
  }
};
