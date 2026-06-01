'use client'

import { GETUsersResponse } from "@/app/(types)/user/user"
import { getNextLevelUpExp } from "@/lib/Config";
import axios from "axios";
import { useEffect, useState } from "react";

export default function User(props : {userData : GETUsersResponse | null | undefined, isLoading : boolean}){
    if(props.isLoading){
        return (
            <>로딩 중</>
        )
    }

    return (
        <>
            <p>
                이름 : {props.userData?.data?.user?.name}
            </p>
            <p>
                경험치 : {props.userData?.data?.totalExp} / {getNextLevelUpExp(Number(props.userData?.data?.totalExp))}
            </p>
        </>
    )
}