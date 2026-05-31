import { BADJSONDATA, SERVERERROR } from "@/lib/Config";
import { prisma } from "@/lib/prisma";
import { NextRequest, NextResponse } from "next/server"

interface RegistData {
    id : number,
    email : string,
    name : string
}

interface POSTRegistResponse{
    success : boolean,
    message : string | null,
    data ?: RegistData
}

export async function POST(req : NextRequest){
    let requestData;
    const response : POSTRegistResponse = {
        success : false,
        message : null
    }

    try{
        requestData = await req.json()
    } catch {
        response.message = BADJSONDATA;
        return NextResponse.json(response, {status : 400});
    }
    console.log("POST /api/auth/regist request : ", JSON.stringify(requestData));

    if (!requestData.name || !requestData.password || !requestData.email){
        response.message = "이름, 이메일, 비밀번호를 모두 입력하세요";
        return NextResponse.json(response, {status : 400});
    }

    if(requestData.name.length > 5){
        response.message = "이름 길이는 6자를 넘으면 안됩니다";
        return NextResponse.json(response, {status : 400});
    }

    if(!requestData.email.includes("@")){
        response.message = "이메일은 이메일 형식으로 보내주세요";
        return NextResponse.json(response, {status : 400});
    }

    if(requestData.password < 8){
        response.message = "비밀번호는 8자 이상 적어서 보내주세요";
        return NextResponse.json(response, {status : 400});
    }

    try {
        const checkingDupEmail = await prisma.user.findUnique({
            where : {
                email : requestData.email
            }
        })

        if(checkingDupEmail){
            response.message = "이미 존재하는 이메일입니다.";
            return NextResponse.json(response, {status : 400});
        }

        // TODO : 꼭 비밀번호 암호화 bcry인가 뭔가 하는거 꼭 하기
        const insertUser = await prisma.user.create({
            data : {
                name : requestData.name,
                email : requestData.email,
                password : requestData.password
            }
        });

        // const session = await getSession()

        // session.user = {id : insertUser.id};
        // session.isLoggedin = true;

        // await session.save();

        response.success = true;
        response.message = "회원가입에 성공했습니다.";
        response.data = {
            id : insertUser.id,
            name : insertUser.name,
            email : insertUser.email
        }

        return NextResponse.json(response, {status : 200});

    } catch (e) {
        console.error(e);
        response.message = SERVERERROR;
        return NextResponse.json(response, {status : 500}); 
    }
}