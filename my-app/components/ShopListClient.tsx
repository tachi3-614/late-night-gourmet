'use client'

import { useState, useTransition } from 'react'
import { useRouter } from 'next/navigation'
import { createReview } from '../actions/shop' // バックエンドの投稿関数をインポート

type Review = {
  id: string
  rating: number
  comment: string
  createdAt: Date
}

type Shop = {
  id: string
  name: string
  description: string
  openTime: string
  closeTime: string
  address: string
  category: string
  imageUrl: string | null
  reviews: Review[] // レビュー配列の型を追加
}

type Props = {
  initialShops: Shop[]
  currentSearch?: string
  currentCategory?: string
}

const CATEGORIES = ['すべて', 'ラーメン', '居酒屋', '居酒屋・バー', '定食・丼物']

export default function ShopListClient({ initialShops, currentSearch = '', currentCategory = 'すべて' }: Props) {
  const router = useRouter()
  const [isPending, startTransition] = useTransition()
  const [search, setSearch] = useState(currentSearch)
  const [selectedCategory, setSelectedCategory] = useState(currentCategory)

  // フォーム用：お店ごとに星とコメントを管理できるようにIDをキーにする
  const [ratings, setRatings] = useState<{ [key: string]: number }>({})
  const [comments, setComments] = useState<{ [key: string]: string }>({})

  const handleSearch = (searchTerm: string, categoryTerm: string) => {
    setSearch(searchTerm)
    setSelectedCategory(categoryTerm)
    startTransition(() => {
      const params = new URLSearchParams()
      if (searchTerm) params.set('search', searchTerm)
      if (categoryTerm && categoryTerm !== 'すべて') params.set('category', categoryTerm)
      router.push(`/?${params.toString()}`)
    })
  }

  // レビュー送信処理
  const handleReviewSubmit = async (shopId: string) => {
    const rating = ratings[shopId] || 5
    const comment = comments[shopId] || ''

    if (!comment.trim()) return alert('コメントを入力してください')

    try {
      await createReview(shopId, rating, comment)
      setComments({ ...comments, [shopId]: '' }) // 入力欄を空にする
      router.refresh() // 画面のデータをリアルタイムに再取得して更新！
    } catch (error) {
      alert('投稿に失敗しました')
    }
  }

  return (
    <div className="space-y-8">
      {/* 検索・絞り込みコントロール */}
      <div className="bg-slate-900 border border-slate-800 p-6 rounded-2xl shadow-xl space-y-6">
        <div>
          <label className="block text-xs font-semibold text-slate-400 uppercase tracking-wider mb-2">
            キーワードで探す
          </label>
          <input
            type="text"
            placeholder="店名や、気になるメニューを入力（例: 家系、焼き鳥...）"
            value={search}
            onChange={(e) => handleSearch(e.target.value, selectedCategory)}
            className="w-full bg-slate-950 border border-slate-800 rounded-xl px-4 py-3 text-slate-200 placeholder-slate-600 focus:outline-none focus:border-amber-500 transition text-sm"
          />
        </div>

        <div>
          <label className="block text-xs font-semibold text-slate-400 uppercase tracking-wider mb-3">
            カテゴリー
          </label>
          <div className="flex flex-wrap gap-2">
            {CATEGORIES.map((cat) => (
              <button
                key={cat}
                onClick={() => handleSearch(search, cat)}
                className={`px-4 py-2 rounded-xl text-xs font-bold transition ${
                  selectedCategory === cat
                    ? 'bg-amber-500 text-slate-950 shadow-lg shadow-amber-500/20'
                    : 'bg-slate-950 text-slate-400 border border-slate-800 hover:border-slate-700'
                }`}
              >
                {cat}
              </button>
            ))}
          </div>
        </div>
      </div>

      {isPending && (
        <div className="text-center text-amber-400 text-xs font-mono animate-pulse">
          ⚡ データベースを検索中...
        </div>
      )}

      {/* お店一覧の表示 */}
      {initialShops.length === 0 ? (
        <div className="text-center py-16 border border-dashed border-slate-800 rounded-2xl bg-slate-900/30">
          <p className="text-slate-500 text-sm">条件に合う深夜営業のお店が見つかりませんでした 🌙</p>
        </div>
      ) : (
        <div className="grid gap-8 md:grid-cols-2">
          {initialShops.map((shop) => (
            <div
              key={shop.id}
              className="bg-slate-900 border border-slate-800 rounded-2xl overflow-hidden shadow-xl flex flex-col justify-between"
            >
              <div>
                {shop.imageUrl && (
                  <img src={shop.imageUrl} alt={shop.name} className="w-full h-48 object-cover" />
                )}
                <div className="p-5">
                  <span className="inline-block bg-amber-500/10 text-amber-400 text-[10px] tracking-wider px-2.5 py-1 rounded-full font-bold mb-3 uppercase">
                    {shop.category}
                  </span>
                  <h2 className="text-xl font-bold mb-2 text-slate-100">{shop.name}</h2>
                  <p className="text-sm text-slate-400 mb-4 leading-relaxed">{shop.description}</p>
                  <div className="flex justify-between items-center text-xs text-slate-500 font-mono border-t border-slate-800 py-3 mb-4">
                    <div>⏰ {shop.openTime} 〜 {shop.closeTime}</div>
                    <div>📍 {shop.address}</div>
                  </div>

                  {/* 💬 口コミ一覧表示エリア */}
                  <div className="space-y-2 border-t border-slate-800/60 pt-4">
                    <h3 className="text-xs font-bold text-slate-400 tracking-wider uppercase mb-2">
                      みんなの口コミ ({shop.reviews?.length || 0})
                    </h3>
                    {shop.reviews?.length === 0 ? (
                      <p className="text-xs text-slate-600 italic">まだ口コミはありません。最初の1件を投稿しよう！</p>
                    ) : (
                      <div className="max-h-32 overflow-y-auto space-y-2 pr-1">
                        {shop.reviews?.map((review) => (
                          <div key={review.id} className="bg-slate-950/50 border border-slate-800/40 p-2.5 rounded-xl text-xs">
                            <div className="text-amber-400 font-bold mb-1">{'★'.repeat(review.rating)}</div>
                            <p className="text-slate-300">{review.comment}</p>
                          </div>
                        ))}
                      </div>
                    )}
                  </div>
                </div>
              </div>

              {/* ✍️ レビュー投稿フォームエリア */}
              <div className="p-5 bg-slate-950/40 border-t border-slate-800/60 space-y-3">
                <div className="flex items-center justify-between">
                  <span className="text-xs font-bold text-slate-400">評価を投稿する</span>
                  <select
                    value={ratings[shop.id] || 5}
                    onChange={(e) => setRatings({ ...ratings, [shop.id]: Number(e.target.value) })}
                    className="bg-slate-900 border border-slate-800 text-amber-400 text-xs rounded-lg px-2 py-1 font-bold focus:outline-none"
                  >
                    <option value="5">★★★★★ (最高)</option>
                    <option value="4">★★★★☆ (満足)</option>
                    <option value="3">★★★☆☆ (普通)</option>
                    <option value="2">★★☆☆☆ (微妙)</option>
                    <option value="1">★☆☆☆☆ (不満)</option>
                  </select>
                </div>
                <div className="flex gap-2">
                  <input
                    type="text"
                    placeholder="夜中に食べるここのラーメンは犯罪..."
                    value={comments[shop.id] || ''}
                    onChange={(e) => setComments({ ...comments, [shop.id]: e.target.value })}
                    className="flex-1 bg-slate-900 border border-slate-800 rounded-xl px-3 py-2 text-xs text-slate-200 placeholder-slate-600 focus:outline-none focus:border-amber-500"
                  />
                  <button
                    onClick={() => handleReviewSubmit(shop.id)}
                    className="bg-amber-500 hover:bg-amber-600 text-slate-950 text-xs font-extrabold px-4 py-2 rounded-xl transition shadow-md"
                  >
                    投稿
                  </button>
                </div>
              </div>

            </div>
          ))}
        </div>
      )}
    </div>
  )
}