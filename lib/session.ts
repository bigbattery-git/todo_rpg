import { getIronSession, SessionOptions } from "iron-session";
import { cookies } from "next/headers";

export type SessionUser = {
    id : number
}

export type SessionData = {
    user ?: SessionUser,
    isLoggedin ?: boolean
}

const sessionPassword = process.env.SESSION_PASSWORD;

if(!sessionPassword || sessionPassword.length < 32){
    throw new Error("세션 비번이 없거나 32자 미만임");
}

export const sessionOptions : SessionOptions = {
    password : sessionPassword,
    cookieName : "session_data",
    ttl : 60 * 60 * 2,
    cookieOptions : {
        httpOnly : true,
        secure : process.env.NODE_ENV === "production",
        sameSite : "lax",
        path : "/"
    }
}

export async function getSession() {
    const cookieStore = await cookies();

    return getIronSession<SessionData>(cookieStore, sessionOptions);
}