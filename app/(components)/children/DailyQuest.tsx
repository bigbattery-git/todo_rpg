"use client"

import { GETDailyQuestResponse } from "@/app/(types)/daily-quest/daily-quest";
import axios from "axios";
import { useEffect, useState } from "react";

export default function DailyQuest(){
    const [currentPage, setCurrentPage] = useState<number>(1);
    const [dailyquests , setDailyQuests] = useState<GETDailyQuestResponse | null>();
    const [isLoading, setIsLoading] = useState<boolean>(true);
    
    function getTodoListData(){
        axios.get('/api/daily-quests', {params : {
            page : currentPage
        }}).then(data => {
            setDailyQuests(data.data)
        }).catch(e => {
            setDailyQuests(e.response.data)
        })
    }

    useEffect(() => {
        setIsLoading(true);
        setCurrentPage(1);

        getTodoListData();

        setIsLoading(false);
    }, []);

    if(isLoading) {
        return (
            <>로딩중</>
        )
    }

    return (
        <>
            {
                dailyquests?.success ? dailyquests.data?.dailyQuestData.map((a, i) => {
                    return (
                        <div key={i}>
                            [{a.title}] - {a.dailyQuestPregresses && a.dailyQuestPregresses[0]?.status === "COMPLETED" ? "작업 끝" : "작업 전"} - {String(a.createdAt).split('T')[0]}
                        </div>
                    )
                }) : dailyquests?.message
            }
        </>
    )
}