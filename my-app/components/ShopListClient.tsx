'use client' 

import { useState, useTransition } from 'react'
import { useRouter } from 'next/navigation'

type Shop = {
  id: string
  name: string
  description: string
  openTime: string
  closeTime: string
  address: string
  category: string
  imageUrl: string | null
}

type Props = {
  initialShops: Shop[]
  currentSearch?: string
  currentCategory?: string
}

// カテゴリーリスト
const CATEGORIES = ['すべて', 'ラーメン', '居酒屋', '居酒屋・バー', '定食・丼物']

export default function ShopListClient({ initialShops, currentSearch = '', currentCategory = 'すべて' }: Props) {
  const router = useRouter()
  const [isPending, startTransition] = useTransition()
  const [search, setSearch] = useState(currentSearch)
  const [selectedCategory, setSelectedCategory] = useState(currentCategory)

  // 検索条件が変わった時にURLを更新し、サーバーからデータを再取得させる関数
  const handleSearch = (searchTerm: string, categoryTerm: string) => {
    setSearch(searchTerm)
    setSelectedCategory(categoryTerm)

    startTransition(() => {
      // URLのパラメータを組み立て
      const params = new URLSearchParams()
      if (searchTerm) params.set('search', searchTerm)
      if (categoryTerm && categoryTerm !== 'すべて') params.set('category', categoryTerm)

      // 画面をリロードせずにURLだけを書き換え、裏でデータを最新にする
      router.push(`/?${params.toString()}`)
    })
  }

  return (
    <div className="space-y-8">
      {/* 検索・絞り込みコントロール */}
      <div className="bg-slate-900 border border-slate-800 p-6 rounded-2xl shadow-xl space-y-6">
        {/* キーワード検索窓 */}
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

        {/* カテゴリー切り替えタブ */}
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

      {/* ローディング状態の表示 */}
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
        <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-2">
          {initialShops.map((shop) => (
            <div
              key={shop.id}
              className="bg-slate-900 border border-slate-800 rounded-2xl overflow-hidden shadow-xl hover:border-slate-700 transition duration-300"
            >
              {shop.imageUrl && (
                <img src={shop.imageUrl} alt={shop.name} className="w-full h-48 object-cover" />
              )}
              <div className="p-5">
                <span className="inline-block bg-amber-500/10 text-amber-400 text-[10px] tracking-wider px-2.5 py-1 rounded-full font-bold mb-3 uppercase">
                  {shop.category}
                </span>
                <h2 className="text-xl font-bold mb-2 text-slate-100">{shop.name}</h2>
                <p className="text-sm text-slate-400 mb-4 line-clamp-2 leading-relaxed">{shop.description}</p>
                <div className="flex justify-between items-center text-xs text-slate-500 font-mono border-t border-slate-800 pt-3">
                  <div>⏰ {shop.openTime} 〜 {shop.closeTime}</div>
                  <div>📍 {shop.address}</div>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  )
}