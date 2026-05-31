'use client'

import { GETUsersResponse } from "@/app/(types)/user/user"
import { getNextLevelUpExp } from "@/lib/Config";
import axios from "axios";
import { useEffect, useState } from "react";

export default function User(){
    const [userData , setUserData] = useState<GETUsersResponse | null>();
    const [isLoading, setIsLoading] = useState<boolean>(true);

    useEffect(() => { 
        setIsLoading(true);

        axios.get('/api/users')
        .then((data) => {
            setUserData(data.data);
        }).catch((e) => {
            setUserData(e.response.data);
        })

        setIsLoading(false);
    }, []);

    if(isLoading){
        return (
            <>로딩 중</>
        )
    }

    return (
        <>
            <p>
                이름 : {userData?.data?.user?.name}
            </p>
            <p>
                경험치 : {userData?.data?.totalExp} / {getNextLevelUpExp(Number(userData?.data?.totalExp))}
            </p>
        </>
    )
}