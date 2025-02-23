import base_url from "./user"

export const getUserInfo = async (userId: string) => {
    const res = await fetch(`${base_url}/user/${userId}`, { cache: 'no-cache' })
    const result = await res.json()

    return { result, user: result.user, ok: res.ok }
}
