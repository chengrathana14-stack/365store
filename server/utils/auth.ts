import { H3Event, getCookie, createError } from "h3";
import { createHash } from "node:crypto";
import database from "./database";

const hashToken = (token: string) =>
  createHash("sha256").update(token).digest("hex");

export interface SessionUser {
  id: number;
  name: string;
  email: string;
  role: string;
  isSuperAdmin: boolean;
}

/**
 * Retrieves the current session user from the database. Returns null if not authenticated.
 */
export const getSessionUser = (event: H3Event): SessionUser | null => {
  const sessionToken = getCookie(event, "365_session");
  if (!sessionToken) return null;

  try {
    const user = database
      .prepare(
        `SELECT users.id, users.name, users.email, users.role
         FROM sessions
         JOIN users ON users.id = sessions.user_id
         WHERE sessions.token_hash = ? AND users.status = 'Active'`,
      )
      .get(hashToken(sessionToken)) as
      | { id: number; name: string; email: string; role: string }
      | undefined;

    if (!user) return null;

    const isSuperAdmin =
      user.email.toLowerCase() === "chengrathana14@gmail.com" ||
      user.role === "Admin";

    return {
      id: user.id,
      name: user.name,
      email: user.email,
      role: isSuperAdmin ? "Admin" : user.role,
      isSuperAdmin,
    };
  } catch {
    return null;
  }
};

/**
 * Requires an active admin session. Throws 401 or 403 if unauthorized.
 */
export const requireAdmin = (event: H3Event): SessionUser => {
  const user = getSessionUser(event);

  if (!user) {
    throw createError({
      statusCode: 401,
      statusMessage: "Authentication required to perform this action.",
    });
  }

  if (!user.isSuperAdmin && user.role !== "Admin") {
    throw createError({
      statusCode: 403,
      statusMessage: "Administrator privileges required.",
    });
  }

  return user;
};
