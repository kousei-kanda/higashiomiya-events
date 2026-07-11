import "server-only";
import crypto from "crypto";
import { cookies } from "next/headers";

// ------------------------------------------------------------------
// プロトタイプ用の簡易パスワード認証です。
// 本番運用では Supabase Auth などの正式な認証基盤に置き換えてください。
// ------------------------------------------------------------------

export const SESSION_COOKIE_NAME = "admin_session";
const SALT = "higashiomiya-shotenkai-admin"; // 固定ソルト（本番では環境変数化を推奨）

function getAdminPassword(): string {
  // .env.local に ADMIN_PASSWORD を設定してください（未設定時は開発用の初期値）
  return process.env.ADMIN_PASSWORD || "toukyu2026";
}

function getSessionToken(): string {
  return crypto
    .createHash("sha256")
    .update(getAdminPassword() + SALT)
    .digest("hex");
}

export function checkPassword(password: string): boolean {
  return password === getAdminPassword();
}

export function getExpectedSessionToken(): string {
  return getSessionToken();
}

export async function isAdminAuthenticated(): Promise<boolean> {
  const cookieStore = await cookies();
  const value = cookieStore.get(SESSION_COOKIE_NAME)?.value;
  return !!value && value === getSessionToken();
}
