import { getSession } from "@/lib/session";
import LoginForm from "./(components)/LoginForm";

export default async function Login(){
    
    const session = await getSession();

    return (
        <>
            <LoginForm session={JSON.stringify(session)}/>
        </>
    )
}