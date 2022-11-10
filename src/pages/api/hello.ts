// Next.js API route support: https://nextjs.org/docs/api-routes/introduction
import type { NextApiRequest, NextApiResponse } from 'next'

type Data = {
  name: string
}

export default function userhandler(
  req: NextApiRequest,
  res: NextApiResponse<Data>
) {
  fetch(process.env.NEXT_PUBLIC_API_URL).then(res => res.json())
}
