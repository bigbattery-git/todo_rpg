"use client"

import { GETItemsResponse } from "@/app/(types)/item/item";
import axios from "axios";
import { useEffect, useState } from "react";

export default function Inventory(props : {itemData : GETItemsResponse | null | undefined}){
    const [currentPage, setCurrentPage] = useState<number>(1);

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
        </>
    )
}