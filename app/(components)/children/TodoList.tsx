import { GETTodoResponse } from "@/app/(types)/todo/todo";
import axios from "axios";
import { useEffect, useRef, useState } from "react";

export default function TodoList(){
    const [currentPage, setCurrentPage] = useState<number>(1);
    const [todos , setTodos] = useState<GETTodoResponse | null>();
    const [isLoading, setIsLoading] = useState<boolean>(true);
    
    function getTodoListData(){
        axios.get('/api/todos', {params : {
            page : currentPage
        }}).then(data => {
            setTodos(data.data)
        }).catch(e => {
            setTodos(e.response.data)
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
                todos?.success ? todos.data?.todoData.map((a, i) => {
                    return (
                        <div key={i}>
                            [{a.title}] - {a.todoStatus === "PENDING" ? "작업 전" : "작업 끝"} - {String(a.createdAt).split('T')[0]}
                        </div>
                    )
                }) : todos?.message
            }
        </>
    )
}