'use client'

import { useEffect } from 'react'
import { MapContainer, TileLayer, Marker, Popup, useMap } from 'react-leaflet'
import L from 'leaflet'
import 'leaflet/dist/leaflet.css'

// LeafletアイコンのパスがNext.jsでバグるのを防ぐ設定
const DefaultIcon = L.icon({
  iconUrl: 'https://unpkg.com/leaflet@1.7.1/dist/images/marker-icon.png',
  shadowUrl: 'https://unpkg.com/leaflet@1.7.1/dist/images/marker-shadow.png',
  iconSize: [25, 41],
  iconAnchor: [12, 41],
})
L.Marker.prototype.options.icon = DefaultIcon

type Shop = {
  id: string
  name: string
  lat: number | null
  lng: number | null
  address: string
}

type Props = {
  shops: Shop[]
}

// 検索結果に合わせて地図の表示位置を自動で動かすコンポーネント
function ChangeView({ center }: { center: [number, number] }) {
  const map = useMap()
  useEffect(() => {
    map.setView(center, map.getZoom())
  }, [center, map])
  return null
}

export default function Map({ shops }: Props) {
  // 緯度経度があるお店だけをピックアップ
  const validShops = shops.filter((shop) => shop.lat !== null && shop.lng !== null)

  // 初期位置（お店があれば1件目の場所、なければ東京周辺）
  const defaultCenter: [number, number] =
    validShops.length > 0
      ? [validShops[0].lat!, validShops[0].lng!]
      : [35.681236, 139.767125]

  return (
    <div className="w-full h-[350px] rounded-2xl overflow-hidden border border-slate-800 shadow-2xl relative z-0">
      <MapContainer
        center={defaultCenter}
        zoom={14}
        style={{ width: '100%', height: '100%', background: '#0f172a' }}
      >
        {/* アプリの雰囲気に合わせたダークモード風の地図 */}
        <TileLayer
          attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
          url="https://{s}.basemaps.cartocdn.com/dark_all/{z}/{x}/{y}{r}.png"
        />
        {/* <TileLayer
          attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
          url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png" // これが一撃で明るくなります！
        /> */}
        
        {validShops.length > 0 && <ChangeView center={[validShops[0].lat!, validShops[0].lng!]} />}

        {/* お店の位置にピンを立てる */}
        {validShops.map((shop) => (
          <Marker key={shop.id} position={[shop.lat!, shop.lng!]}>
            <Popup>
              <div className="text-slate-900 p-1">
                <h3 className="font-bold text-sm mb-1">{shop.name}</h3>
                <p className="text-xs text-slate-500">{shop.address}</p>
              </div>
            </Popup>
          </Marker>
        ))}
      </MapContainer>
    </div>
  )
}