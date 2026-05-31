export interface DailyQuestData {
    id: number;
    title: string;
    content: string;
    todoType: TodoType;
    createdAt: Date;
    dailyQuestPregresses: {
        status: DailyQuestStatus;
    }[];
};

export interface GETDailyQuestResponse {
    success : boolean,
    message : string | null,
    data ?: {
        dailyQuestData : DailyQuestData[],
        lastPage : number
    }
}

export interface POSTDailyQuestResponse {
    success : boolean,
    message : string | null,
    data ?: DailyQuest
}

export interface POSTDailyQuestRequest { 
    title : string,
    content : string,
    todoType : TodoType
}