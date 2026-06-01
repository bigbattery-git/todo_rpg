import { GETTodoResponse, PostTodoRequest, TodoData } from "@/app/(types)/todo/todo";
import { GETUsersResponse } from "@/app/(types)/user/user";
import { TodoType } from "@/src/generated/enums";
import axios, { AxiosResponse } from "axios";
import { useEffect, useRef, useState } from "react";

export default function TodoList(props : {getTodoData : Function, todoData : GETTodoResponse | null |undefined, onCheckTodoList : Function, addTodoList : Function}){
    const [currentPage, setCurrentPage] = useState<number>(1);
    const [title, setTitle] = useState<string>("");
    const [content, setContent] = useState<string>("");
    const [todoType, setTodoType] = useState<TodoType>("HEALTH");

    async function setTodoList(){
        const reqData : PostTodoRequest = {
            title : title,
            content : content,
            todoType : todoType
        }

        if (!reqData.title|| !reqData.content){
            alert("제목과 내용을 입력하세요");
            return;
        }

        try {
            props.addTodoList(reqData);

            setContent("");
            setTitle("");

            alert("추가 완료");
        } catch (e) {
            if(axios.isAxiosError(e)){
                alert(e.response?.data.message);
            }
        }
    }

    return (
        <>
            {
                props.todoData ? 
                    (props.todoData.success ? props.todoData.data?.todoData.map((a, i) => {
                        return (
                            <div key={i} onClick={() => {props.onCheckTodoList(a.id, currentPage)}}>
                                <span className={`${a.todoStatus === "PENDING" ? "" : "text-red-400"}`}>[{a.title}] - {a.todoStatus === "PENDING" ? "작업 전" : "작업 끝"} - {String(a.createdAt).split('T')[0]}</span>
                            </div>
                        )
                    }) : props.todoData?.message) 
                : "" 
            }
            <input
            value={title}
            onChange={(e) => {setTitle(e.target.value)}}
            placeholder="여기에 TODO 제목 입력"
            className="border"
            />
            <input
            value={content}
            onChange={(e) => {setContent(e.target.value)}}
            placeholder="여기에 TODO 콘텐트 입력"
            className="border"
            />

            <button onClick={setTodoList}>제출하거라</button>
            <hr />
        </>
    )
}