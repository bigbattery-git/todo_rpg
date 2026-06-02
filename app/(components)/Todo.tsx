"use client"

import { useRouter } from "next/navigation";
import { useEffect, useState } from "react"
import User from "./children/User";
import TodoList from "./children/TodoList";
import DailyQuest from "./children/DailyQuest";
import Inventory from "./children/Inventory";
import { GETUsersResponse } from "../(types)/user/user";
import axios from "axios";
import { GETTodoResponse, PostTodoRequest } from "../(types)/todo/todo";
import { GETItemsResponse, POSTItemsResponse } from "../(types)/item/item";
import { GETDailyQuestResponse, POSTDailyQuestRequest } from "../(types)/daily-quest/daily-quest";

export default function Todo(props : {session : string}){

    const [userData , setUserData] = useState<GETUsersResponse | null | undefined>();
    const [isLoading, setIsLoading] = useState<boolean>(true);
    const [todoData, setTodoData] = useState<GETTodoResponse | null>();
    const [itemData, setItemData] = useState<GETItemsResponse | null>();
    const [dailyquestsData , setDailyQuestsData] = useState<GETDailyQuestResponse | null>();

    const route = useRouter();
    useEffect(()=>{
        async function init(){
            setIsLoading(true);

            const session : {
                user : {
                    id : number
                }, isLoggedin : boolean
            } = JSON.parse(props.session);

            if(!session || !session.isLoggedin || !session?.user?.id){
                route.push('/login');
            }

            getUserData();
            getTodoData(1);
            getItems(1);
            getDailyQuestList(1);

            setIsLoading(false);
        }

        init();
    }, [])

    async function getUserData(){
        try{
            const data = await axios.get('/api/users');
            setUserData(data.data);
        }catch(e){
            if(axios.isAxiosError(e)){
                alert(e.response?.data.message)
            }
        }
    }

    // TodoList
    async function getTodoData(page : number){
        try {
            const data = await axios.get('/api/todos', {
                params : {page : page}
            });

            await setTodoData(data.data);
        } catch (e) {
            if (axios.isAxiosError(e)){
                alert(e.response?.data.message)
            }
        }
    }

    async function addTodoList(inputData : PostTodoRequest, page : number){
        try {
            await axios.post('/api/todos', inputData);
            await getTodoData(page);
        } catch (e) {
            if(axios.isAxiosError(e)){
                alert(e.response?.data.message);
            }
        }
    }

    async function onCheckTodoList(id : number, page : number){
        try{
            const data = await axios.post('/api/todos/check-todo', {
                id : id
            });
            if(data != null){
                let currentUserData : GETUsersResponse | null = null;

                if(!userData){
                    return;
                }

                currentUserData = {...userData}

                if(currentUserData.data?.totalExp){
                    currentUserData.data.totalExp = data.data.data.currentExp;
                }

                await setUserData(currentUserData);
                await getTodoData(page);

                if(userData?.data?.totalExp && userData.data.totalExp % 1000 === 0){
                    setItems();
                }
            }
        }catch (e) {
            if(axios.isAxiosError(e)){
                alert(e.response?.data.message);
            }
        }
    } 

    // 인벤토리
    async function getItems(page : number){
        try {
            const items = await axios.get('/api/items', {params : {page : page}});
            setItemData(items.data);
        } catch (e) {
            if (axios.isAxiosError(e)){
                alert(e.response?.data.message)
            }
        }
    }

    async function setItems(){
        try {
            const items = await axios.post('/api/items');

            const postItemData : POSTItemsResponse = items.data;

            let currentItemData : GETItemsResponse | null = null;

            if(items.data && itemData){
                currentItemData = {...itemData};
            }

            if(currentItemData?.datas?.items&&postItemData.data){
                currentItemData.datas.items.unshift(postItemData.data);
            }

            setItemData(currentItemData);
        } catch(e) {
            if(axios.isAxiosError(e)){
                alert(e.response?.data.message);
            }
        }
    }

    // 일일 퀘스트
    // function getTodoListData(){
    //     axios.get('/api/daily-quests', {params : {
    //         page : currentPage
    //     }}).then(data => {
    //         setDailyQuests(data.data)
    //     }).catch(e => {
    //         setDailyQuests(e.response.data)
    //     })
    // }
    async function getDailyQuestList(page : number){
        try{
            const data = await axios.get('/api/daily-quests', {params : {page : page}});
            const dailyQuestData : GETDailyQuestResponse = data.data;

            setDailyQuestsData(dailyQuestData);
        }catch (e) {
            if(axios.isAxiosError(e)){
                alert(`getDailyQuestList : ${e.response?.data.message}`);
            }
        }
    }

    async function addDailyQuestList(req : POSTDailyQuestRequest ,page : number){
        try {
            await axios.post('/api/daily-quests', req);
            await getDailyQuestList(page);
        } catch (e) {
            if(axios.isAxiosError(e)){
                alert(e.response?.data.message);
            }
        }
    }

    async function chkDailyQuest(id : number, page : number){
        try{
            let isCompleted : boolean = false;

            dailyquestsData?.data?.dailyQuestData.forEach(a => {
                if(a.id === id){
                    if(a.dailyQuestPregresses[0] && a.dailyQuestPregresses[0].status === "COMPLETED"){
                        isCompleted = true;
                    }
                }
            });

            if(isCompleted){
                alert("이미 완료한 업무는 취소할 수 없습니다.");
                return
            }

            await axios.post('/api/daily-quests/check-daily-quests', {id : id});

            await setItems();
            await getDailyQuestList(page);
        } catch (e) {
            if(axios.isAxiosError(e)){
                alert(e.response?.data.message);
            }
        }
    }

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
            <DailyQuest dailyQuestData={dailyquestsData} getDailyQuestList={getDailyQuestList} addDailyQuestList={addDailyQuestList} chkDailyQuest={chkDailyQuest}/>
            <br />
            인벤토리
            <Inventory itemData={itemData} getItems={getItems}/>
        </>
    )
}