import { TodoStatus, TodoType } from "@/src/generated/enums"

export interface GETTodoResponse {
    success : boolean,
    message : string | null,
    data ?: {
        todoData : TodoData[],
        lastPage : number
    }
}
export interface TodoData {
    id: number,
    title: string,
    content: string,
    todoType: TodoType,
    todoStatus: TodoStatus,
    createdAt: Date
}

export interface POSTTodoResponse {
    success : boolean,
    message : string | null,
    data ?: TodoData
}