export interface GETItemsResponse {
    success : boolean,
    message : null | string,
    datas ?: {
        items : {
            id : number,
            createdAt : Date,
            item : {
                name : string,
                content : string
            }
        }[], 
        lastPage : number
    }
}

export interface POSTItemsResponse {
    success : boolean,
    message : null | string,
    data ?: {
        id : number,
        createdAt : Date,
        item : {
            name : string,
            content : string
        }
    } | null
}


// export interface POSTItemsRequest{
//     // TODO :  나중에 아이템 여러 개 추가되면 그 때 사용
// }