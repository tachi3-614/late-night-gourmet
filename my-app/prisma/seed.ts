import { PrismaClient } from '@prisma/client'

const prisma = new PrismaClient()

async function main() {
  console.log('シードデータの注入を開始します...')

  //テストユーザーの作成
  const user1 = await prisma.user.upsert({
    where: { email: 'shun@example.com' },
    update: {},
    create: {
      name: 'シュン',
      email: 'shun@example.com',
    },
  })

  const user2 = await prisma.user.upsert({
    where: { email: 'test-user@example.com' },
    update: {},
    create: {
      name: 'テストユーザー',
      email: 'test-user@example.com',
    },
  })

  //深夜営業の飲食店データの作成
  const shop1 = await prisma.shop.create({
    data: {
      name: '麺処 つるまき（深夜家系ラーメン）',
      description: '深夜3時まで営業！濃厚な豚骨醤油スープと極太麺が五臓六腑に染み渡ります。仕事終わりや飲み会の締めに最高の一杯を。',
      openTime: '18:00',
      closeTime: '03:00',
      address: '東京都新宿区歌舞伎町1-X-X',
      category: 'ラーメン',
      imageUrl: 'https://images.unsplash.com/photo-1569718212165-3a8278d5f624?w=800&auto=format&fit=crop&q=60', 

      lat: 35.69384,   // 新宿駅近くの緯度
      lng: 139.703549, // 新宿駅近くの経度
    },
  })

  const shop2 = await prisma.shop.create({
    data: {
      name: '朝まで個室居酒屋 宵の口',
      description: '始発まで語り明かせる落ち着いた和モダン空間。こだわりの焼き鳥と豊富な日本酒を取り揃えています。全席コンセント完備。',
      openTime: '17:00',
      closeTime: '05:00',
      address: '東京都渋谷区道玄坂2-X-X',
      category: '居酒屋',
      imageUrl: 'https://images.unsplash.com/photo-1579871494447-9811cf80d66c?w=800&auto=format&fit=crop&q=60',

      lat: 35.658034,  // 渋谷駅近くの緯度
      lng: 139.701636, // 渋谷駅近くの経度
    },
  })

  //初期レビューの作成（テストユーザーからラーメン屋へのレビュー）
  await prisma.review.create({
    data: {
      rating: 5,
      comment: '深夜2時に食べるここの家系ラーメンは犯罪級に美味い。スープが濃厚で、ライスが無限に進みます！また来ます。',
      userId: user2.id,
      shopId: shop1.id,
    },
  })

  console.log('✅ シードデータの注入が完了しました！')
}

main()
  .catch((e) => {
    console.error(e)
    process.exit(1)
  })
  .finally(async () => {
    await prisma.$disconnect()
  })