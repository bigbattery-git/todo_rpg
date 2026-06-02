'use client'

import axios from "axios";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react"

export default function LoginForm(props : {session : string}){
    const route = useRouter();
    const [email, setEmail] = useState<string>("");
    const [password, setPassword] = useState<string>("");
    useEffect(() => {
        function init(){
            const session = JSON.parse(props.session);
            if(session.isLoggedin){
                route.push('/');
            }
        }

        init();
    }, []);

    function login(){
        axios.post('/api/auth/login', {
            email : email,
            password : password
        }, {
            headers : {
                "Content-Type" : "application/json"
            }
        }).then(() => {
            route.push('/');
        }).catch((e) => {
            alert(e.response.data.message);
            // setWarn(e.response.data.message);

            setPassword("");
        })
    }

    return (
        <>
            로그인
            <input
            placeholder="이메일 입력"
            value = {email}
            onChange={(e) => {setEmail(e.target.value)}}
            className="border my-3"
            />
            <input
            type="password"
            placeholder="비밀번호 입력"
            value = {password}
            onChange={(e) => {setPassword(e.target.value)}}
            className="border my-3"
            />
            
            <button
            className="border max-w-20 my-5"
            onClick={() => {login()}} 
            >로그인</button>
            <button
            className="border max-w-20"
            onClick={() => {route.push('/regist')}} 
            >회원가입</button>
        </>
    )
}