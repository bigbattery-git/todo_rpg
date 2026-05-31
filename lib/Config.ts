export const BADJSONDATA : string = "잘못된 json입니다.";
export const SERVERERROR : string = "서버 오류가 발생했습니다";
export const NEEDLOGIN : string = "로그인이 필요합니다";

// TODO : 모델의 enum값 바뀔 때 값이 바뀌도록, 여기서 별도로 한 번 더 추가할 필요 없도록 리팩토링 하기
export const TODOTYPE : string[] = ["WORK", "HOBBY", "HEALTH", "SELP_MANAGEMENT", "STUDY"];

export const getNextLevelUpExp = (currentExt : number) : number => {
    const currentLevel : number = Math.floor(currentExt / 1000);

    return (currentLevel * 1000) + 1000;
}