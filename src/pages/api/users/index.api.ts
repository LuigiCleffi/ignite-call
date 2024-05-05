// Next.js API route support: https://nextjs.org/docs/api-routes/introduction
import { prisma } from '@/lib/prisma'
import type { NextApiRequest, NextApiResponse } from 'next'
import {setCookie} from 'nookies'
export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse,
) {
  
  if (req.method !== 'POST') return res.status(405).end()
    const { username, name } = req.body
 
  const userExists = await prisma.user.findUnique({
    where: {
      username,
    },
  })

  if (userExists) {
    return res.status(400).json({
      message: 'Username already taken.',
    })
  }
 
  const user = await prisma.user.create({
    data: {
      username,
      name,
    },
  })

  const sevenDaysExpiration = 60 * 60 * 24 * 7 
  setCookie({ res }, '@ignitecall:userId', user.id, {
    maxAge: sevenDaysExpiration,
    path: '/',
  })
  return res.status(201).json(user)
}
