import { prisma } from "@/lib/prisma"

async function main(){
    await prisma.user.upsert({
        where : {
            email : "test@test.com"
        },
        update: {},
        create : {
            name : "홍길동",
            email : "test@test.com",
            password : "qwer1234"
        }
    })

    await prisma.reward.upsert({
        where : {
            id : 1
        }, 
        update : {},
        create : {
            name : "데일리 퀘스트 달성!",
            content : "데일리 퀘스트를 모두 달성했어요!",
            memo : "기본 완료 목록"
        }
    })

    await prisma.rewardItem.upsert({
        where : {
            id : 1
        }, update : {

        }, create : {
            name : "기본적인 아이템",
            content : "기본적인 아이템이라 뭐라 닥히 할 말은 없음",
            memo : "실수로 null하게 못만들었음"
        }
    })
}

main().then(() => {console.log("작업 끝")}).catch((e) => {console.error(e)});