'use client'
import React, { useEffect, useState } from 'react'
import L from "leaflet"
import { MapContainer, Marker, TileLayer, useMap } from "react-leaflet"
import axios from 'axios'

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

    const [p1, setP1] = useState<[number, number]>()
    const [p2, setP2] = useState<[number, number]>()

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

    useEffect(() => {
        if (pickUp && drop) {
            (async () => {
                const a = await geoCoding(pickUp);
                const b = await geoCoding(drop);

                if (!a || !b) {
                    return;
                }
                setP1(a);
                setP2(b);
            })()

        }
    }, [pickUp, drop])

    return (
        <div className='relative h-full w-full bg-zinc-100'>
            <MapContainer
                style={{ width: "100%", height: "100%" }}
                center={p1 ?? [0, 0]}
                zoom={13}
            >
                <TileLayer
                    attribution='&copy; OpenStreetMap contributors &copy; CARTO'
                    url="https://{s}.basemaps.cartocdn.com/light_all/{z}/{x}/{y}{r}.png"
                />

                {p1 && p2 && <FitBounds p1={p1} p2={p2} />}

                {p1 && <Marker
                    position={p1!}
                    icon={pickUpIcon}
                />}

                {p2 && <Marker
                    position={p2!}
                    icon={dropIcon}
                />}

            </MapContainer>
        </div>
    )
}

export default SearchMap

//2:56:15