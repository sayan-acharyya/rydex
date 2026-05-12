'use client'
import React, { useEffect, useState } from 'react'
import L from "leaflet"
import { MapContainer, Marker, Polyline, TileLayer, useMap } from "react-leaflet"
import axios from 'axios'
import { AnimatePresence, motion } from 'motion/react'
import { MapPin, Navigation, Navigation2 } from 'lucide-react'

type props = {
    pickUp: string,
    drop: string,
    onChange: (p: string, d: string) => void,
    onDistance: (d: number) => void
}

function FitBounds({ p1, p2 }: { p1: [number, number], p2: [number, number] }) {

    const map = useMap();
    useEffect(() => {
        map.invalidateSize();
        map.fitBounds([p1, p2], { padding: [72, 72], maxZoom: 15, animate: true, duration: 1 })
    }, [p1, p2, map])

    return null
}

const pickUpIcon = new L.DivIcon({
    html: `
    <div style="display: flex; flex-direction: column; align-items: center;">
      <!-- Label Bubble -->
      <div style="
        background: #000;
        color: #fff;
        padding: 6px 12px;
        border-radius: 4px;
        font-family: 'Inter', -apple-system, sans-serif;
        font-size: 11px;
        font-weight: 800;
        text-transform: uppercase;
        letter-spacing: 0.5px;
        position: relative;
        box-shadow: 0 4px 6px rgba(0,0,0,0.3);
      ">
        PICKUP
        <!-- Triangle pointer -->
        <div style="
          position: absolute;
          bottom: -5px;
          left: 50%;
          transform: translateX(-50%);
          width: 0; height: 0; 
          border-left: 6px solid transparent;
          border-right: 6px solid transparent;
          border-top: 6px solid #000;
        "></div>
      </div>

      <!-- Stem Line -->
      <div style="
        width: 2px;
        height: 12px;
        background: #000;
      "></div>

      <!-- Anchor Dot -->
      <div style="
        width: 12px;
        height: 12px;
        background: #000;
        border: 2px solid #fff;
        border-radius: 50%;
        box-shadow: 0 2px 4px rgba(0,0,0,0.4);
      "></div>
    </div>
  `,
    className: "",
    // iconSize needs to account for the bubble + stem + dot
    iconSize: [80, 60],
    // iconAnchor ensures the 'Anchor Dot' is exactly on the coordinates
    iconAnchor: [40, 56]
});


const dropIcon = new L.DivIcon({
    html: `
    <div style="display: flex; flex-direction: column; align-items: center;">
      <!-- Label Bubble -->
      <div style="
        background: #000;
        color: #fff;
        padding: 6px 12px;
        border-radius: 4px;
        font-family: 'Inter', -apple-system, sans-serif;
        font-size: 11px;
        font-weight: 800;
        text-transform: uppercase;
        letter-spacing: 0.5px;
        position: relative;
        box-shadow: 0 4px 6px rgba(0,0,0,0.3);
      ">
        DROP
        <!-- Triangle pointer -->
        <div style="
          position: absolute;
          bottom: -5px;
          left: 50%;
          transform: translateX(-50%);
          width: 0; height: 0; 
          border-left: 6px solid transparent;
          border-right: 6px solid transparent;
          border-top: 6px solid #000;
        "></div>
      </div>

      <!-- Stem Line -->
      <div style="
        width: 2px;
        height: 12px;
        background: #000;
      "></div>

      <!-- Anchor Dot -->
      <div style="
        width: 12px;
        height: 12px;
        background: #000;
        border: 2px solid #fff;
        border-radius: 50%;
        box-shadow: 0 2px 4px rgba(0,0,0,0.4);
      "></div>
    </div>
  `,
    className: "",
    // iconSize needs to account for the bubble + stem + dot
    iconSize: [80, 60],
    // iconAnchor ensures the 'Anchor Dot' is exactly on the coordinates
    iconAnchor: [40, 56]
});


const SearchMap = ({ pickUp, drop, onChange, onDistance }: props) => {

    const [p1, setP1] = useState<[number, number]>();
    const [p2, setP2] = useState<[number, number]>();
    const [route, setRoute] = useState<[number, number][]>([]);
    const [km, setKm] = useState<number | null>(0);
    const [ready, setReady] = useState(false)

    const geoCoding = async (q: string): Promise<[number, number] | null> => {
        try {
            const { data } = await axios.get(
                `https://photon.komoot.io/api/?q=${encodeURIComponent(q)}&limit=1`
            );

            if (!data.features || data.features.length === 0) {
                return null;
            }

            const [lon, lat] = data.features[0].geometry.coordinates;

            return [lat, lon];
        } catch (error) {
            console.error("Geocoding error:", error);
            return null;
        }
    };

    const loadRoute = async (p: [number, number], d: [number, number]) => {

        try {
            const { data } = await axios.get(`https://router.project-osrm.org/route/v1/driving/${p[1]},${p[0]};${d[1]},${d[0]}?overview=full&geometries=geojson`);
            if (!data.routes.length) return;

            setRoute(data.routes[0].geometry.coordinates.map(([lon, lat]: number[]) => [lat, lon]))
            const distKm = +((data.routes[0].distance) / 1000).toFixed(2);
            setKm(distKm)
            onDistance(distKm)
        } catch (error) {
            console.log(error);

        }
    }

    const reverseGeoCoding = async (lat: number, lon: number) => {
        const { data } = await axios.get(
            `https://nominatim.openstreetmap.org/reverse?lat=${lat}&lon=${lon}&format=json`
        );

        return data?.display_name || null;
    }




    const dragPickUp = async (lat: number, lon: number) => {
        const addr = await reverseGeoCoding(lat, lon)
        setP1([lat, lon])
        if (p2) {
            loadRoute([lat, lon], p2)
        }
        onChange?.(addr!, drop)
    }

    const dragDrop = async (lat: number, lon: number) => {
        const addr = await reverseGeoCoding(lat, lon)
        setP2([lat, lon])
        if (p1) {
            loadRoute(p1, [lat, lon]);
        }
        onChange?.(pickUp, addr!)
    }


    useEffect(() => {
        setReady(false)
        if (pickUp && drop) {
            (async () => {
                const a = await geoCoding(pickUp);
                const b = await geoCoding(drop);

                if (!a || !b) {
                    return;
                }
                await loadRoute(a, b);
                setP1(a);
                setP2(b);
                setReady(true)
            })()

        }
    }, [pickUp, drop])

    return (
        <div className='relative h-full w-full bg-zinc-100'>
            <MapContainer
                style={{ width: "100%", height: "100%" }}
                center={p1 ?? [0, 0]}
                zoom={13}
                zoomControl={false}
            >
                <TileLayer
                    attribution='&copy; OpenStreetMap contributors &copy; CARTO'
                    url="https://{s}.basemaps.cartocdn.com/light_all/{z}/{x}/{y}{r}.png"
                />

                {p1 && p2 && <FitBounds p1={p1} p2={p2} />}

                {p1 && <Marker
                    position={p1!}
                    icon={pickUpIcon}
                    draggable
                    eventHandlers={{
                        dragend: e => {
                            const m = e.target.getLatLng()
                            dragPickUp(m.lat, m.lng)
                        }
                    }}
                />}

                {p2 && <Marker
                    position={p2!}
                    icon={dropIcon}
                    draggable
                    eventHandlers={{
                        dragend: e => {
                            const m = e.target.getLatLng()
                            dragDrop(m.lat, m.lng)
                        }
                    }}
                />}

                {
                    route?.length > 0 && (
                        <>
                            <Polyline
                                positions={route}
                                pathOptions={{ color: "#0a0a0a", lineCap: "round", lineJoin: "round" }}
                            />
                        </>
                    )
                }

            </MapContainer>

            <AnimatePresence>
                {!ready && (
                    <motion.div
                        initial={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                        transition={{ duration: 0.45 }}
                        className='absolute inset-0 z-999 bg-white/90 backdrop-blur-md 
                    flex flex-col items-center justify-center gap-4 '
                    >
                        <div className='relative w-14 h-14 flex items-center justify-center'>
                            <motion.div
                                animate={{ rotate: 360 }}
                                transition={{ duration: 1.1, repeat: Infinity, ease: "linear" }}
                                className='absolute inset-0 rounded-full border-2 border-transparent border-t-zinc-900'
                            />
                            <motion.div
                                animate={{ rotate: -360 }}
                                transition={{ duration: 1.8, repeat: Infinity, ease: "linear" }}
                                className='absolute inset-2 rounded-full border-2 border-transparent border-t-zinc-300'
                            />

                            <MapPin size={15} className='text-zinc-800' />
                        </div>
                        <div className='text-center'>
                            <p className='text-zinc-900 text-xs font-black tracking-[0.22em] uppercase'>
                                Loading Map</p>
                            <p className='text-zinc-400 text-[10px] font-medium tracking-wider mt-0.5'>
                                Plotting your route...</p>
                        </div>
                    </motion.div>
                )}
            </AnimatePresence>

            <AnimatePresence>
                {ready && km !== null && (
                    <motion.div
                        initial={{ opacity: 0, y: 8, scale: 0.95 }}
                        animate={{ opacity: 1, y: 0, scale: 1 }}
                        exit={{ opacity: 0 }}
                        transition={{ duration: 0.4, ease: [0.22, 1, 0.36, 1] }}
                        className='absolute bottom-20 left-4 z-500 flex items-center gap-2 bg-white 
                        border  border-zinc-200 px-3.5 py-2 rounded-xl shadow-lg'
                    >
                        <Navigation2 size={13} className='text-zinc-900' />
                        <span className='text-zinc-900 text-xs font-bold'>{km} km</span>
                        <span className='w-px h-3 bg-zinc-300' />
                        <span>~{Math.max(3, Math.round((km / 25) * 60))} min</span>
                    </motion.div>
                )}
            </AnimatePresence>
        </div>
    )
}

export default SearchMap

