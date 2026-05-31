import { BADJSONDATA, SERVERERROR } from "@/lib/Config";
import { prisma } from "@/lib/prisma";
import { getSession } from "@/lib/session";
import { NextRequest, NextResponse } from "next/server";

interface POSTCheckDailyQuestRequest {
    id : number
}

interface POSTCheckDailyQuestResponse {
    success : boolean,
    message : string | null,
    data ?: {
        addItem: {
            id: number;
            userId: number;
            createdAt: Date;
            updatedAt: Date;
            deletedAt: Date | null;
            itemId: number;
        }
    }
}

export async function POST (req : NextRequest) {
    let requestDatas : POSTCheckDailyQuestRequest;
    const response : POSTCheckDailyQuestResponse = {
        success : false,
        message : null
    }

    const session = await getSession();

    if(!session || !session.isLoggedin || !session.user?.id){
        response.message = "로그인이 필요합니다.";
        return NextResponse.json(response, {status : 401});
    }

    try{
        requestDatas = await req.json();
    } catch {
        response.message = BADJSONDATA;
        return NextResponse.json(response, {status : 400});
    }

    if(!requestDatas.id){
        response.message = "dailyquest id가 필요합니다";
        return NextResponse.json(response, {status : 400});
    }

    try {
        const userId = session.user.id;
        const chkDate = new Date().toISOString().split('T')[0];
        const today = new Date(chkDate);
        const chkDailyTaskData = await prisma.dailyQuest.findFirst({
            include : {
                dailyQuestPregresses : {
                    where : {
                        createdAt : {
                            gte : today
                        }
                    },
                    orderBy : {
                        createdAt : "desc"
                    },
                    take : 1
                }
            },
            where : {
                id : requestDatas.id,
                deletedAt : null
            }
        })

        if (!chkDailyTaskData){
            response.message = "데이터가 없습니다.";
            return NextResponse.json(response, {status : 404});
        }

        if(chkDailyTaskData.userId !== session.user.id){
            response.message = "본인의 데이터만 체크할 수 있습니다.";
            return NextResponse.json(response, {status : 403});
        }

        if(chkDailyTaskData.dailyQuestPregresses.length !== 0 && chkDailyTaskData.dailyQuestPregresses[0].status === "COMPLETED"){
            response.message = "이미 이 업무는 완료했습니다.";
            return NextResponse.json(response, {status : 400});
        }

        const result = await prisma.$transaction(async (prisma) => {
            const addDailyTaskLog = await prisma.dailyQuestProgress.create({
                data : {
                    dailyQuestId : requestDatas.id,
                    status : "COMPLETED"
                }
            })

            const addItem = await prisma.item.create({
                data : {
                    userId : userId,
                    itemId : 1
                }
            })

            return {
                addDailyTaskLog, addItem
            }
        })

        response.success = true;
        response.message = "해당 업무를 완료했습니다."
        response.data = {
            addItem : result.addItem
        }

        return NextResponse.json(response, {status : 200});

    } catch (e) {
        console.error(e);
        response.message = SERVERERROR;
        return NextResponse.json(response, {status : 500});
    }
}