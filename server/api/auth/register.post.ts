import { randomBytes, scryptSync } from "node:crypto";
import database from "../../utils/database";

interface RegisterBody {
  name?: string;
  email?: string;
  password?: string;
}

const hashPassword = (password: string) => {
  const salt = randomBytes(16).toString("hex");
  const hash = scryptSync(password, salt, 64).toString("hex");

  return `${salt}:${hash}`;
};

export default defineEventHandler(async (event) => {
  const body = await readBody<RegisterBody>(event);
  const name = body.name?.trim() ?? "";
  const email = body.email?.trim().toLowerCase() ?? "";
  const password = body.password ?? "";

  if (!name || !email || !password) {
    throw createError({
      statusCode: 400,
      statusMessage: "Name, email, and password are required.",
    });
  }

  if (!/^\S+@\S+\.\S+$/.test(email)) {
    throw createError({
      statusCode: 400,
      statusMessage: "Please enter a valid email address.",
    });
  }

  if (password.length < 8) {
    throw createError({
      statusCode: 400,
      statusMessage: "Password must be at least 8 characters.",
    });
  }

  const existingUser = database
    .prepare("SELECT id FROM users WHERE email = ?")
    .get(email);

  if (existingUser) {
    throw createError({
      statusCode: 409,
      statusMessage: "An account with this email already exists.",
    });
  }

  const role = email === "chengrathana14@gmail.com" ? "Admin" : "Customer";

  const result = database
    .prepare(
      `INSERT INTO users (name, email, password_hash, joined, role)
       VALUES (?, ?, ?, ?, ?)`,
    )
    .run(name, email, hashPassword(password), new Date().toISOString(), role);

  return {
    id: result.lastInsertRowid,
    name,
    email,
  };
});
