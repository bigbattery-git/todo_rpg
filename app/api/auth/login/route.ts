import { getSession } from "@/lib/session";
import { NextRequest, NextResponse } from "next/server";
import { BADJSONDATA, SERVERERROR } from "@/lib/Config";
import { prisma } from "@/lib/prisma";

interface POSTLoginResponse{
    success : boolean,
    message : string | null 
}

export async function POST(req : NextRequest){
    let requestData;

    const response : POSTLoginResponse = {
        success : false,
        message : null
    }

    try {
        requestData = await req.json();
    } catch (e) {
        response.message = BADJSONDATA;
        return NextResponse.json(response, {status : 400});
    }

    console.log("POST /api/auth/login request : ", JSON.stringify(requestData));

    if(!requestData.email){
        response.message = "이메일을 입력하세요";
        return NextResponse.json(response, {status : 400});
    }

    if(!requestData.password){
        response.message = "비밀번호를 입력하세요";
        return NextResponse.json(response, {status : 400});
    }

    try{
        const userData = await prisma.user.findFirst({
            where:{
                email : requestData.email
            }
        });

        response.message = "아이디 또는 비밀번호가 맞지 않습니다.";

        if(!userData){
            return NextResponse.json(response, {status : 404});
        }

        if(userData.password !== requestData.password){
            return NextResponse.json(response, {status : 404});
        }

        const session = await getSession();
        session.user = {
            id : userData.id
        }
        await session.save();

        response.success = true;
        response.message = "로그인에 성공했습니다";

        return NextResponse.json(response, {status : 200});
    } catch(e) {
        console.error(e);
        response.message = SERVERERROR;
        return NextResponse.json(response, {status : 500});
    }
}