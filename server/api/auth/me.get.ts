import { createHash } from "node:crypto";
import database from "../../utils/database";

const hashToken = (token: string) =>
  createHash("sha256").update(token).digest("hex");

export default defineEventHandler((event) => {
  const sessionToken = getCookie(event, "365_session");

  if (!sessionToken) {
    throw createError({ statusCode: 401, statusMessage: "Not authenticated." });
  }

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

  if (!user) {
    deleteCookie(event, "365_session", { path: "/" });
    throw createError({ statusCode: 401, statusMessage: "Not authenticated." });
  }

  const isSuperAdmin = user.email.toLowerCase() === "chengrathana14@gmail.com" || user.role === "Admin";

  return {
    id: user.id,
    name: user.name,
    email: user.email,
    role: isSuperAdmin ? "Admin" : user.role,
    roles: isSuperAdmin ? ["Admin", "Customer"] : ["Customer"],
    isSuperAdmin,
    canAccessAdmin: isSuperAdmin,
  };
});
