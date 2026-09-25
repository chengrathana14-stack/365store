import { readFileSync, writeFileSync, existsSync, mkdirSync } from "node:fs";
import { join } from "node:path";
import { tmpdir } from "node:os";
import { randomBytes, scryptSync } from "node:crypto";

export interface UserRecord {
  id: number;
  name: string;
  email: string;
  password_hash: string;
  phone: string;
  role: string;
  status: string;
  orders: number;
  spent: number;
  joined: string;
}

export interface SessionRecord {
  token_hash: string;
  user_id: number;
  created_at: string;
}

interface DBState {
  users: UserRecord[];
  sessions: SessionRecord[];
}

const seedAdminPassword = (password: string) => {
  const salt = randomBytes(16).toString("hex");
  const hash = scryptSync(password, salt, 64).toString("hex");
  return `${salt}:${hash}`;
};

// Safe storage location that works on both local and serverless/Vercel (read-only filesystem)
const getStorageFilePath = (): string => {
  try {
    const localDir = join(process.cwd(), ".data");
    mkdirSync(localDir, { recursive: true });
    return join(localDir, "365-sport.json");
  } catch {
    const tempDir = tmpdir();
    return join(tempDir, "365-sport-auth.json");
  }
};

const storageFilePath = getStorageFilePath();

const createInitialState = (): DBState => {
  return {
    users: [
      {
        id: 1,
        name: "Cheng Rothana",
        email: "chengrathana14@gmail.com",
        password_hash: seedAdminPassword("11112222"),
        phone: "+855 12 345 678",
        role: "Admin",
        status: "Active",
        orders: 0,
        spent: 0,
        joined: new Date().toISOString(),
      },
    ],
    sessions: [],
  };
};

const loadState = (): DBState => {
  try {
    if (existsSync(storageFilePath)) {
      const raw = readFileSync(storageFilePath, "utf-8");
      const parsed = JSON.parse(raw);
      if (Array.isArray(parsed.users) && Array.isArray(parsed.sessions)) {
        // Ensure Superadmin is always active
        const adminIndex = parsed.users.findIndex(
          (u: UserRecord) => u.email.toLowerCase() === "chengrathana14@gmail.com"
        );
        if (adminIndex === -1) {
          parsed.users.unshift({
            id: 1,
            name: "Cheng Rothana",
            email: "chengrathana14@gmail.com",
            password_hash: seedAdminPassword("11112222"),
            phone: "+855 12 345 678",
            role: "Admin",
            status: "Active",
            orders: 0,
            spent: 0,
            joined: new Date().toISOString(),
          });
        } else {
          parsed.users[adminIndex].role = "Admin";
          parsed.users[adminIndex].status = "Active";
        }
        return parsed;
      }
    }
  } catch {
    // Fall back to memory if reading storage fails
  }
  return createInitialState();
};

const state: DBState = loadState();

const saveState = () => {
  try {
    writeFileSync(storageFilePath, JSON.stringify(state, null, 2), "utf-8");
  } catch {
    // In-memory fallback if disk is unwritable
  }
};

// Initial persist
saveState();

// Compatibility Layer providing .prepare().get() / .run() / .all()
class Statement {
  private query: string;

  constructor(query: string) {
    this.query = query.trim().replace(/\s+/g, " ");
  }

  get(...params: any[]): any {
    const q = this.query.toLowerCase();

    // 1. SELECT id FROM users WHERE email = ?
    if (q.includes("from users") && q.includes("where email = ?")) {
      const email = String(params[0] || "").toLowerCase();
      const user = state.users.find((u) => u.email.toLowerCase() === email);
      if (!user) return undefined;
      return {
        id: user.id,
        name: user.name,
        email: user.email,
        password_hash: user.password_hash,
        role: user.role,
        status: user.status,
      };
    }

    // 2. Session + User auth check
    if (q.includes("from sessions") && q.includes("join users")) {
      const tokenHash = String(params[0] || "");
      const session = state.sessions.find((s) => s.token_hash === tokenHash);
      if (!session) return undefined;

      const user = state.users.find(
        (u) => u.id === session.user_id && u.status === "Active"
      );
      if (!user) return undefined;

      return {
        id: user.id,
        name: user.name,
        email: user.email,
        role: user.role,
      };
    }

    return undefined;
  }

  run(...params: any[]): { lastInsertRowid: number; changes: number } {
    const q = this.query.toLowerCase();

    // 1. INSERT INTO users (name, email, password_hash, joined, role)
    // or INSERT INTO users (name, email, password_hash, phone, role, status, joined)
    if (q.startsWith("insert into users")) {
      const nextId = state.users.length > 0 ? Math.max(...state.users.map((u) => u.id)) + 1 : 1;
      let newUser: UserRecord;

      if (params.length === 5) {
        // [name, email, password_hash, joined, role]
        newUser = {
          id: nextId,
          name: String(params[0] || ""),
          email: String(params[1] || "").toLowerCase(),
          password_hash: String(params[2] || ""),
          phone: "",
          role: String(params[4] || "Customer"),
          status: "Active",
          orders: 0,
          spent: 0,
          joined: String(params[3] || new Date().toISOString()),
        };
      } else {
        // [name, email, password_hash, phone, role, status, joined]
        newUser = {
          id: nextId,
          name: String(params[0] || ""),
          email: String(params[1] || "").toLowerCase(),
          password_hash: String(params[2] || ""),
          phone: String(params[3] || ""),
          role: String(params[4] || "Customer"),
          status: String(params[5] || "Active"),
          orders: 0,
          spent: 0,
          joined: String(params[6] || new Date().toISOString()),
        };
      }

      state.users.push(newUser);
      saveState();
      return { lastInsertRowid: nextId, changes: 1 };
    }

    // 2. UPDATE users SET ... WHERE email = ?
    if (q.startsWith("update users")) {
      const email = String(params[params.length - 1] || "").toLowerCase();
      const user = state.users.find((u) => u.email.toLowerCase() === email);
      if (user) {
        if (params.length >= 2) {
          user.password_hash = String(params[0] || user.password_hash);
        }
        user.role = "Admin";
        user.status = "Active";
        saveState();
        return { lastInsertRowid: user.id, changes: 1 };
      }
      return { lastInsertRowid: 0, changes: 0 };
    }

    // 3. INSERT INTO sessions (token_hash, user_id, created_at)
    if (q.startsWith("insert into sessions")) {
      const newSession: SessionRecord = {
        token_hash: String(params[0] || ""),
        user_id: Number(params[1] || 0),
        created_at: String(params[2] || new Date().toISOString()),
      };
      state.sessions.push(newSession);
      saveState();
      return { lastInsertRowid: state.sessions.length, changes: 1 };
    }

    // 4. DELETE FROM sessions WHERE token_hash = ?
    if (q.startsWith("delete from sessions")) {
      const tokenHash = String(params[0] || "");
      const prevLength = state.sessions.length;
      state.sessions = state.sessions.filter((s) => s.token_hash !== tokenHash);
      saveState();
      return { lastInsertRowid: 0, changes: prevLength - state.sessions.length };
    }

    return { lastInsertRowid: 0, changes: 0 };
  }

  all(..._params: any[]): any[] {
    return [];
  }
}

const database = {
  pragma: (_cmd: string) => {},
  exec: (_sql: string) => {},
  prepare: (query: string) => new Statement(query),
};

export default database;
