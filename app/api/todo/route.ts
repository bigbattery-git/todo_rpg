import { SERVERERROR } from "@/lib/Config";
import { prisma } from "@/lib/prisma";
import { getSession } from "@/lib/session";
import { TodoStatus, TodoType} from "@/src/generated/enums";
import { NextRequest, NextResponse } from "next/server";

interface TodoData {
    id: number,
    title: string,
    content: string,
    todoType: TodoType,
    todoStatus: TodoStatus,
    createdAt: Date
}

interface GETTodoResponse {
    success : boolean,
    message : string | null,
    data ?: {
        todoData : TodoData[],
        lastPage : number
    }
}

export async function GET(req : NextRequest){
    const session = await getSession();
    const pageSize = 10;

    const response : GETTodoResponse = {
        success : false,
        message : null
    } 

    if(!session || !session.isLoggedin){
        response.message = "로그인이 필요합니다";
        return NextResponse.json(response, {status : 401});
    }

    console.log("GET /api/todo 요청자 : ", session.user?.id);

    const pageParse = Number(req.nextUrl.searchParams.get("page"));

    const page = Number.isInteger(pageParse) && pageParse > 0 ? pageParse : 1;

    try{
        const [todoData, totalCount] = await prisma.$transaction([
            prisma.todo.findMany({
                select : {
                    id: true,
                    title : true,
                    content : true,
                    todoType : true,
                    todoStatus : true,
                    createdAt : true
                },
                where : {
                    deletedAt : null,
                    userId : session.user?.id
                },
                take : pageSize,
                skip : (page - 1) * pageSize
            }),
            prisma.todo.count({
                where : {
                    deletedAt : null
                }
            })
        ]);
        response.data = {
            todoData : todoData,
            lastPage : Math.ceil(totalCount/pageSize)
        }

        return NextResponse.json(response, {status : 200});

    } catch (e) {
        console.error(e);
        response.message = SERVERERROR;
        return NextResponse.json(response, {status : 500});
    }
}