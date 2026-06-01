"use client"

import { GETDailyQuestResponse, POSTDailyQuestRequest } from "@/app/(types)/daily-quest/daily-quest";
import { getPaginationNum } from "@/lib/Config";
import { TodoType } from "@/src/generated/enums";
import axios from "axios";
import { useState } from "react";

export default function DailyQuest(props : {dailyQuestData : GETDailyQuestResponse | null | undefined, getDailyQuestList : Function, addDailyQuestList : Function, chkDailyQuest : Function}){
    const [currentPage, setCurrentPage] = useState<number>(1);
    const [title, setTitle] = useState<string>("");
    const [content, setContent] = useState<string>("");
    const [todoType, setTodoType] = useState<TodoType>("HEALTH");

    async function setDailyQuestList(){
        const reqData : POSTDailyQuestRequest = {
            title : title,
            content : content,
            todoType : todoType
        }

        if (!reqData.title|| !reqData.content){
            alert("제목과 내용을 입력하세요");
            return;
        }

        try {
            props.addDailyQuestList(reqData, currentPage);

            setContent("");
            setTitle("");

            alert("추가 완료");
        } catch (e) {
            if(axios.isAxiosError(e)){
                alert(e.response?.data.message);
            }
        }
    }

    async function getTodoList(page : number){
        await setCurrentPage(page);
        props.getDailyQuestList(page)
    }

    return (
        <>
            {
                props.dailyQuestData ? 
                    (props.dailyQuestData.success ? props.dailyQuestData.data?.dailyQuestData.map((a, i) => {

                        const isCompleted = a.dailyQuestPregresses[0] && a.dailyQuestPregresses[0].status === "COMPLETED";

                        return (
                            <div key={i} onClick={() => {props.chkDailyQuest(a.id, currentPage)}}>
                                <span className={`${!isCompleted ? "" : "text-red-400"}`}>[{a.title}] - 
                                    {!isCompleted ? "작업 전" : "작업 끝"} - {String(a.createdAt).split('T')[0]}</span>
                            </div>
                        )
                    }) : props.dailyQuestData?.message) 
                : "" 
            }
            <div className="flex">
                {
                    props.dailyQuestData ? 
                        (props.dailyQuestData.success && props.dailyQuestData.data?.lastPage ? getPaginationNum(currentPage, props.dailyQuestData.data?.lastPage).map((a, i) => {
                            return (<button key={i} className={`border w-10 h-10 mx-2 ${a === currentPage ? "border-amber-500" : ""}`} onClick={() => {getTodoList(a)}}>{a}</button>)
                        }) : "")
                    : ""
                }
            </div>

            <input
            value={title}
            onChange={(e) => {setTitle(e.target.value)}}
            placeholder="여기에 퀘스트 제목 입력"
            className="border"
            />
            <input
            value={content}
            onChange={(e) => {setContent(e.target.value)}}
            placeholder="여기에 퀘스트 콘텐트 입력"
            className="border"
            />

            <button onClick={() => setDailyQuestList()}>제출하거라</button>
            <hr />
        </>
    )
}