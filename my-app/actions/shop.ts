'use server' // サーバー側で実行するおまじない

import { PrismaClient } from '@prisma/client'

const prisma = new PrismaClient()

// データベースからお店の一覧を全件取得する関数
export async function getShops() {
  try {
    const shops = await prisma.shop.findMany({
      orderBy: {
        createdAt: 'desc', // 新しいお店順
      },
    })
    return shops
  } catch (error) {
    console.error('データ取得エラー:', error)
    throw new Error('お店のデータを取得できませんでした。')
  }
}