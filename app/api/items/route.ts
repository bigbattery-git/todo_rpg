import { SERVERERROR } from "@/lib/Config";
import { prisma } from "@/lib/prisma";
import { getSession } from "@/lib/session";
import { Item } from "@/src/generated/browser";
import { NextRequest, NextResponse } from "next/server";

interface GETItemsResponse {
    success : boolean,
    message : null | string,
    datas ?: {
        items : {
            id : number,
            createdAt : Date,
            item : {
                name : string,
                content : string
            }
        }[], 
        lastPage : number
    }
}

interface POSTItemsResponse {
    success : boolean,
    message : null | string,
    data ?: {
        id : number,
        createdAt : Date,
        item : {
            name : string,
            content : string
        }
    } | null
}

export async function GET(req : NextRequest){
    const requestData = req.nextUrl.searchParams;
    const itemSize = 16;
    const response : GETItemsResponse = {
        success : false,
        message : null
    }

    const session = await getSession();

    if(!session || !session.isLoggedin || !session.user?.id){
        response.message = "로그인이 필요합니다.";
        return NextResponse.json(response, {status : 401});
    }

    const pagePerse : number = Number(requestData.get("page"))

    const page : number =  Number.isInteger(pagePerse) && pagePerse > 0 ? pagePerse : 1;

    try {
        const userId = session.user.id;
        const result = await prisma.$transaction(async (prisma) => {
            const items = await prisma.item.findMany({
                select : {
                    id : true,
                    createdAt : true,
                    item : {
                        select : {
                            name : true,
                            content : true
                        }
                    }
                },
                where : {
                    userId : userId,
                    deletedAt : null
                },
                take : itemSize,
                skip : (page - 1) * itemSize
            });

            const totalCount = await prisma.item.count({
                where : {
                    userId : userId,
                    deletedAt : null
                }
            })

            const lastPage = Math.ceil(totalCount/itemSize)

            return {
                items, lastPage
            }
        })

        response.success = true;
        response.message = "아이템 조회에 성공했습니다";
        response.datas = result;

        return NextResponse.json(response, {status : 200});

    } catch (e) {
        console.error(e);
        response.message = SERVERERROR
        return NextResponse.json(response, {status : 500});
    }
}

interface POSTItemsRequest{
    // TODO :  나중에 아이템 여러 개 추가되면 그 때 사용
}

export async function POST(req : NextRequest){
    const session = await getSession();
    const response : POSTItemsResponse = {
        success : false,
        message : null
    }

    if(!session || !session.isLoggedin || !session.user?.id){
        response.message = "로그인이 필요합니다";
        return NextResponse.json(response, {status : 401});
    }

    try{
        const userId = session.user.id;

        const result = await prisma.$transaction(async(prisma) => {
            const createItemData = await prisma.item.create({
                data : {
                    itemId : 1,
                    userId : userId
                }
            })

            const createdItemData = await prisma.item.findFirst({
                select : {
                    id : true,
                    createdAt : true,
                    item : {
                        select : {
                            name : true,
                            content : true
                        }
                    }
                }, where : {
                    id : createItemData.id
                }
            })

            return {
                createdItemData
            }
        });

        response.success = true;
        response.message = "아이템 추가를 완료했습니다.";
        response.data = result.createdItemData

        return NextResponse.json(response, {status : 200});
    } catch (e) {
        console.error(e);
        response.message = SERVERERROR;
        return NextResponse.json(response, {status : 500});
    }
}