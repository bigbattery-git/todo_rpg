import { SERVERERROR } from "@/lib/Config";
import { prisma } from "@/lib/prisma";
import { getSession } from "@/lib/session";
import { NextResponse } from "next/server";

interface GETUsersResponse {
    success : boolean,
    message : null | string,
    data ?: {
        user : {
            name: string;
            id: number;
            email: string;
            password: string;
            str: number;
            dex: number;
            sta: number;
            cha: number;
            intel: number;
            createdAt: Date;
            updatedAt: Date;
        } | null , totalExp : number
    }
}

export async function GET(){
    const session = await getSession();
    const response : GETUsersResponse = {
        success : false,
        message : null
    }
    if(!session || !session.isLoggedin || !session.user?.id){
        response.message = "로그인이 필요합니다.";
        return NextResponse.json(response, {status : 401});
    }

    try {
        const [users, exps] = await prisma.$transaction([
            prisma.user.findFirst({
                where : {
                    id : session.user.id
                }
            }), 
            prisma.userExpLog.findMany({
                where : {
                    userId : session.user.id
                }
            })
        ]);

        let totalExp : number = 0;
        exps.forEach((a) => {
            totalExp += a.exp;
        });

        response.message = "유저 정보 조회를 완료했습니다";
        response.success = true;
        response.data = {
            user : users,
            totalExp : totalExp
        }

        return NextResponse.json(response, {status : 200});
    }catch (e) {
        response.message = SERVERERROR;
        return NextResponse.json(response, {status : 500});
    }
}