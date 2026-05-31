"use client"

import { useRouter } from "next/navigation";
import { useEffect } from "react"

export default function Todo(props : {session : string}){

    const route = useRouter();
    useEffect(()=>{
        const session : {
            user : {
                id : number
            }, isLoggedin : boolean
        } = JSON.parse(props.session);

        if(!session || !session.isLoggedin || !session?.user?.id){
            route.push('/login');
        }
    }, [])
    return (
        <>
            유저 정보 리스트임
            <br />
            그냥 할 일 리스트임
            <br />
            일일 퀘스트 리스트임
            <br />
        </>
    )
}