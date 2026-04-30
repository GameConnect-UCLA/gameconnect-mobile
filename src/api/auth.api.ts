
async function login(email: string, password: string) {

    await new Promise((res) => setTimeout(res, 2000));
    if (email === "email" && password === "password") {

        return {
            accessToken: `access_token_${Date.now()}`,
            refreshToken: `refresh_token_${Date.now()}`
        }
    }

    throw Error("Invalid Credentials")
}

export {
    login
}