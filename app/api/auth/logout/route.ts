import { SERVERERROR } from "@/lib/Config";
import { getSession } from "@/lib/session";
import { NextResponse } from "next/server";

export async function POST(){
    try {
        const session = await getSession();
    
        session.destroy();

        return NextResponse.json({status : true, message : "로그아웃이 완료되었습니다"}, {status : 200});
    } catch (e) {
        console.error(e);
        return NextResponse.json({status : false, message : SERVERERROR}, {status : 500});
    }
}

