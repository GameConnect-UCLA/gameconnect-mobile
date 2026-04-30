import * as api from "@/src/api/auth.api"
import { secureSave } from "../lib/secure-store";
import { useState } from "react";
interface UserCredentials {
    email: string,
    password: string
}

export default function useAuth() {

    const [isLoading, setIsLoading] = useState(false); 

    async function login({ email, password }: UserCredentials) {
        setIsLoading(true); 
        try {
            const data = await api.login(email, password); 
            await secureSave("accessToken", data.accessToken); 
            await secureSave("refreshToken", data.refreshToken); 
            
        } catch (error) {
            alert(error); 
        } finally {
            setIsLoading(false)
        }
    }

    return {
        login, isLoading
    }
}

