import { getShops } from "../actions/shop";
import ShopListClient from "../components/ShopListClient";

// サーバーコンポーネント
export default async function Home({
  searchParams,
}: {
  searchParams: Promise<{ search?: string; category?: string }>;
}) {
  // URLから現在の検索文字とカテゴリーを取得
  const { search, category } = await searchParams;
  // 条件に合うお店のデータをバックエンドから取得
  const shops = await getShops(search, category);

  return (
    <main className="min-h-screen bg-slate-950 text-slate-50 p-6 md:p-12">
      <div className="max-w-5xl mx-auto">
        <h1 className="text-3xl md:text-4xl font-extrabold text-amber-400 mb-2 tracking-tight">
          🌙 深夜飯検索アプリ（仮）
        </h1>
        <p className="text-slate-400 mb-8 text-sm md:text-base">
          今から開いてる！深夜の胃袋を満たす最高のグルメ検索
        </p>

        {/* 検索UIとお店一覧を表示するクライアントコンポーネントにデータを渡す */}
        <ShopListClient initialShops={shops} currentSearch={search} currentCategory={category} />
      </div>
    </main>
  );
}