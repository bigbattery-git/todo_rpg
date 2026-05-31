export interface GETUsersResponse {
    success : boolean,
    message : null | string,
    data ?: {
        user : {
            name: string;
            id: number;
            email: string;
            password: string;
            str: number;
            dex: number;
            sta: number;
            cha: number;
            intel: number;
            createdAt: Date;
            updatedAt: Date;
        } | null , totalExp : number
    }
}