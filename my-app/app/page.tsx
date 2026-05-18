import { getShops } from "@/actions/shop";

export default async function Home() {
  // バックエンド関数を呼び出して、DBからお店データを取得（サーバーサイドで実行されます）
  const shops = await getShops();

  return (
    <main className="min-h-screen bg-slate-950 text-slate-50 p-8">
      <div className="max-w-4xl mx-auto">
        <h1 className="text-3xl font-extrabold text-amber-400 mb-2">
          🌙 深夜飯検索アプリ（仮）
        </h1>
        <p className="text-slate-400 mb-8">データベースから直接取得したリアルタイムデータ</p>

        <div className="grid gap-6 md:grid-cols-2">
          {shops.map((shop) => (
            <div 
              key={shop.id} 
              className="bg-slate-900 border border-slate-800 rounded-2xl overflow-hidden shadow-xl"
            >
              {shop.imageUrl && (
                <img 
                  src={shop.imageUrl} 
                  alt={shop.name} 
                  className="w-full h-48 object-cover"
                />
              )}
              <div className="p-5">
                <span className="inline-block bg-amber-500/10 text-amber-400 text-xs px-2.5 py-1 rounded-full font-semibold mb-3">
                  {shop.category}
                </span>
                <h2 className="text-xl font-bold mb-2">{shop.name}</h2>
                <p className="text-sm text-slate-400 mb-4 line-clamp-2">
                  {shop.description}
                </p>
                <div className="flex justify-between items-center text-xs text-slate-500 font-mono border-t border-slate-800 pt-3">
                  <div>⏰ {shop.openTime} 〜 {shop.closeTime}</div>
                  <div>📍 {shop.address}</div>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </main>
  );
}