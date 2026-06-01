"use client"

import { useRouter } from "next/navigation";
import { useEffect, useState } from "react"
import User from "./children/User";
import TodoList from "./children/TodoList";
import DailyQuest from "./children/DailyQuest";
import Inventory from "./children/Inventory";
import { GETUsersResponse } from "../(types)/user/user";
import axios from "axios";
import { GETTodoResponse, PostTodoRequest, TodoData } from "../(types)/todo/todo";
import { GETItemsResponse } from "../(types)/item/item";

export default function Todo(props : {session : string}){

    const [userData , setUserData] = useState<GETUsersResponse | null | undefined>();
    const [isLoading, setIsLoading] = useState<boolean>(true);
    const [todoData, setTodoData] = useState<GETTodoResponse | null>();

    const route = useRouter();
    useEffect(()=>{
        setIsLoading(true);

        const session : {
            user : {
                id : number
            }, isLoggedin : boolean
        } = JSON.parse(props.session);

        if(!session || !session.isLoggedin || !session?.user?.id){
            route.push('/login');
        }

        getTodoData(1);

        axios.get('/api/users')
        .then((data) => {
            setUserData(data.data);
        }).catch((e) => {
            setUserData(e.response.data);
        })

        setIsLoading(false);
    }, [])

    // TodoList
    async function getTodoData(page : number){
        try {
            const data = await axios.get('/api/todos', {
                params : {page : page}
            });

            await setTodoData(data.data);
        } catch (e) {
            alert(e);
        }
    }

    async function addTodoList(inputData : PostTodoRequest, page : 1 | number = 1){
        try {
            await axios.post('/api/todos', inputData);
            await getTodoData(page);
        } catch (e) {
            alert(e);
        }
    }

    async function onCheckTodoList(id : number, page : number){
        try{
            const data = await axios.post('/api/todos/check-todo', {
                id : id
            });
            if(data != null){
                const currentUserData : GETUsersResponse = {...userData}

                if(currentUserData.data?.totalExp){
                    currentUserData.data.totalExp = data.data.data.currentExp;
                }

                await setUserData(currentUserData);
                await getTodoData(page);
            }
        }catch (e) {
            alert(e);
        }
    } 

    // 인벤토리
    

    if(isLoading){
        return <>로딩중</>
    }

    return (
        <>
            유저 정보 리스트임
            <User userData={userData} isLoading={isLoading}/>
            <br />
            그냥 할 일 리스트임
            <TodoList getTodoData={getTodoData} todoData={todoData} onCheckTodoList={onCheckTodoList} addTodoList={addTodoList}/>
            <br />
            일일 퀘스트 리스트임
            <DailyQuest/>
            <br />
            인벤토리
            <Inventory />
        </>
    )
}