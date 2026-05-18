'use server'

import { PrismaClient } from '@prisma/client'

const prisma = new PrismaClient()

export async function getShops(search?: string, category?: string) {
  try {
    const where: any = {}

    if (category && category !== 'すべて') {
      where.category = category
    }

    if (search) {
      where.OR = [
        { name: { contains: search, mode: 'insensitive' } },
        { description: { contains: search, mode: 'insensitive' } },
      ]
    }

    // 💡 include を使って、お店データと一緒にレビュー一覧も丸ごと取得する
    const shops = await prisma.shop.findMany({
      where,
      include: {
        reviews: true, 
      },
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

// 💡 新しくレビューをDBに保存する関数
export async function createReview(shopId: string, rating: number, comment: string) {
  try {
    const review = await prisma.review.create({
      data: {
        shopId,
        rating,
        comment,
      },
    })
    return review
  } catch (error) {
    console.error('レビュー投稿エラー:', error)
    throw new Error('レビューを投稿できませんでした。')
  }
}