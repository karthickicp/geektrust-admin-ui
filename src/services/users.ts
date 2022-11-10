export const getUsers = async () => {
return await fetch(process.env.NEXT_PUBLIC_API_URL).then(res => res.json()).then(data =>(data))
}
