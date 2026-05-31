"use client"

import axios from "axios";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";

interface RegistRequest {
    name : string,
    email : string,
    password : string
}

export default function RegistForm(props : {session : string}){
    const route = useRouter();
    const [name, setName] = useState<string>("");
    const [email, setEmail] = useState<string>("");
    const [password, setPassword] = useState<string>("");
    useEffect(() => {
        const session = JSON.parse(props.session);

        if(session.isLoggedin){
            route.push('/');
        }

    }, []);

    function Regist(){
        const request : RegistRequest = {
            name : name,
            email : email,
            password : password
        }

        axios.post('/api/auth/regist', request, {
            headers : {
                "Content-Type" : "application/json"
            }
        }).then(() => {
            alert("회원가입이 완료되었습니다. 로그인 페이지로 이동합니다.");
            route.push('/login');
        }).catch((e) => {
            alert(e.response.data.message);
            setPassword("");
        });
    }

    return(
    <>
        <input
        placeholder="이름 입력"
        className="border max-w-75 my-5"
        value={name}
        onChange={(e) => {setName(e.target.value)}} 
        />
        <input
        placeholder="이메일 입력"
        className="border max-w-75 my-5"
        value={email}
        onChange={(e) => {setEmail(e.target.value)}} 
        />
        <input
        type="password"
        placeholder="비밀번호 입력"
        className="border max-w-75 my-5"
        value={password}
        onChange={(e) => {setPassword(e.target.value)}} 
        />

        <button
        className="border max-w-50 my-5"
        onClick={() => {route.push('/login')}} 
        >로그인 페이지로 이동</button>

        <button
        className="border max-w-50 my-5"
        onClick={() => {Regist()}} 
        >회원가입</button>
    </>
    )
}