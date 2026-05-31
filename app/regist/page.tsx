import { getSession } from "@/lib/session";
import RegistForm from "./(components)/RegistForm";

export default async function Regist(){

    const session = await getSession();

    return (
        <>
            회원가입 페이지임
            <RegistForm  session={JSON.stringify(session)}/>
        </>
    )
}