export const getUsers = async () => {
return await fetch(process.env.NEXT_PUBLIC_API_URL as string).then(res => res.json()).then(data =>(data))
}
