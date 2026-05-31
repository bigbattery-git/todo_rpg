import { BADJSONDATA, NEEDLOGIN, SERVERERROR } from "@/lib/Config";
import { prisma } from "@/lib/prisma";
import { getSession } from "@/lib/session";
import { Todo, User } from "@/src/generated/browser";
import { NextRequest, NextResponse } from "next/server";

interface POSTCheckTodoResponse{
    success : boolean,
    message : string | null,
    data ?: {
        todo : Todo,
        currentExp : number
    }
}

interface POSTCheckTodoRequest{
    id : number
}

export async function POST(req : NextRequest){
    let requestData : POSTCheckTodoRequest;

    const response : POSTCheckTodoResponse = {
        success : false,
        message : null
    }

    try{
        requestData = await req.json();
    } catch {
        response.message = BADJSONDATA;
        return NextResponse.json(response, {status : 400});
    }

    const session = await getSession();

    if(!session || !session.isLoggedin || !session.user?.id){
        response.message = NEEDLOGIN;
        return NextResponse.json(response, {status : 401});
    }

    if(!requestData.id){
        response.message = "todo id가 필요합니다";
        return NextResponse.json(response, {status : 400});
    }

    try {
        const currentTodoData = await prisma.todo.findFirst({
            where : {
                id : requestData.id
            }
        });

        if(!currentTodoData){
            response.message = "해당 todo가 없습니다.";
            return NextResponse.json(response, {status : 404});
        }

        if(session.user.id !== currentTodoData.userId){
            response.message = "본인의 todo만 체크할 수 있습니다.";
            return NextResponse.json(response, {status : 403});
        }

        const sessionId : number = session.user.id;

        const result = await prisma.$transaction(async (prisma) => {

            const checkingTodoData = await prisma.todo.update({
                data : {
                    todoStatus : currentTodoData.todoStatus === "PENDING" ? "COMPLETED" : "PENDING"
                }, where : {
                    id : currentTodoData.id
                }
            })

            const createUserExpLog = await prisma.userExpLog.create({
                data : {
                    userId : sessionId,
                    exp : checkingTodoData.todoStatus === "COMPLETED" ? 100 : -100
                }
            })

            const explog = await prisma.userExpLog.findMany({
                select : {
                    exp : true
                }, where : {
                    userId : sessionId
                }
            });

            let expSum : number = 0;

            explog.forEach((a) => {
                expSum += a.exp;
            })

            return {
                checkingTodoData,
                createUserExpLog,
                expSum
            }
        })

        response.data = {
            todo : result.checkingTodoData,
            currentExp : result.expSum
        }

        response.message = `업무 상태가 ${result.checkingTodoData.todoStatus}(으)로 변경되었습니다.`
        response.success = true;

        return NextResponse.json(response, {status : 200});
    } catch (e) {
        console.error(e);
        response.message = SERVERERROR;
        return NextResponse.json(response, {status : 500});
    }
}