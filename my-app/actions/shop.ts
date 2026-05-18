'use server'

import { PrismaClient } from '@prisma/client'

const prisma = new PrismaClient()

// 引数で検索キーワード（search）とカテゴリー（category）を受け取れるように拡張
export async function getShops(search?: string, category?: string) {
  try {
    // Prismaで検索条件（where）を組み立てる
    const where: any = {}

    // 1. カテゴリーの絞り込みがある場合
    if (category && category !== 'すべて') {
      where.category = category
    }

    // 2. 検索キーワードがある場合（店名か説明文に部分一致するか）
    if (search) {
      where.OR = [
        { name: { contains: search, mode: 'insensitive' } },        // 店名検索（大文字小文字を無視）
        { description: { contains: search, mode: 'insensitive' } }, // 説明文検索
      ]
    }

    // 条件に合うお店を取得
    const shops = await prisma.shop.findMany({
      where,
      orderBy: {
        createdAt: 'desc',
      },
    })
    return shops
  } catch (error) {
    console.error('データ取得エラー:', error)
    throw new Error('お店のデータを取得できませんでした。')
  }
}