export interface GETTodoResponse {
    success : boolean,
    message : string | null,
    data ?: {
        todoData : TodoData[],
        lastPage : number
    }
}