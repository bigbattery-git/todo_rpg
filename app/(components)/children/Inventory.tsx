"use client"

import { GETItemsResponse } from "@/app/(types)/item/item";
import { getPaginationNum } from "@/lib/Config";
import { useState } from "react";

interface PropsData {
    itemData : GETItemsResponse | null | undefined;
    getItems : (page : number) => void;
}

export default function Inventory(props : PropsData){
    const [currentPage, setCurrentPage] = useState<number>(1);

    async function getItemLists(page : number){
        await props.getItems(page);
        await setCurrentPage(page);
    }

    return (
        <>
            {
                props.itemData ?
                (props.itemData.success ? props.itemData.datas?.items.map((a, i) => {
                    return (
                        <div key={i}>
                            [{a.item.name}] - {String(a.createdAt).split('T')[0]}
                        </div>
                    )
                }) : props.itemData?.message)
                : ""
            }
            <div className="flex">
                {
                    props.itemData ? 
                        (props.itemData.success && props.itemData.datas?.lastPage ? getPaginationNum(currentPage, props.itemData.datas?.lastPage).map((a, i) => {
                            return (<button key={i} className={`border w-10 h-10 mx-2 ${a === currentPage ? "border-amber-500" : ""}`} onClick={() => {getItemLists(a)}}>{a}</button>)
                        }) : "")
                    : ""
                }
            </div>
        </>
    )
}