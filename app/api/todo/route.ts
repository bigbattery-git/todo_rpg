import { BADJSONDATA, SERVERERROR, TODOTYPE } from "@/lib/Config";
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

interface POSTTodoResponse {
    success : boolean,
    message : string | null,
    data ?: TodoData
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

        response.success = false;
        response.message = "TODO 목록 조회를 완료하였습니다";

        return NextResponse.json(response, {status : 200});

    } catch (e) {
        console.error(e);
        response.message = SERVERERROR;
        return NextResponse.json(response, {status : 500});
    }
}

export async function POST(req : NextRequest){
    let requestData;

    const todoType : string[] = TODOTYPE;
    const response : POSTTodoResponse = {
        success : false,
        message : null
    }

    const session = await getSession();

    if(!session || !session.isLoggedin || !session.user?.id){
        response.message = "로그인이 필요합니다";
        return NextResponse.json(response, {status : 401});
    }

    try {
        requestData = await req.json()
    } catch {
        response.message = BADJSONDATA;
        return NextResponse.json(response, {status : 400});
    }

    console.log("POST /api/todo req data:", JSON.stringify(requestData));

    if(!requestData.title || !requestData.content || !requestData.todoType){
        response.message = "제목, 설명, 타입이 필요합니다";
        return NextResponse.json(response, {status : 400});
    }

    if(requestData.title > 50){
        response.message = "제목 길이는 50자를 넘지 않게 해주세요";
        return NextResponse.json(response, {status : 400});
    }

    if(requestData.content > 800){
        response.message = "설명은 800자를 안넘도록 해주세요";
        return NextResponse.json(response, {status : 400});
    }

    let hasTodoType = false;
    todoType.forEach(a => {
        if(requestData.todoType === a){
            hasTodoType = true;
        }
    });
    
    if(!hasTodoType){
        response.message = "선택 가능한 할 일 카테고리를 선택하세요";
        return NextResponse.json(response, {status : 400});
    }

    try {
        const todo = await prisma.todo.create({
            data : {
                title : requestData.title,
                content : requestData.content,
                todoStatus : "PENDING",
                todoType : requestData.todoType,
                userId : session.user?.id
            }
        });

        response.success = true;
        response.message = "todo를 추가했습니다."
        response.data = todo;
        
        return NextResponse.json(response, {status : 200});
    } catch (e) {
        console.error(e);
        response.message = SERVERERROR;
        return NextResponse.json(response, {status : 500});
    }
}