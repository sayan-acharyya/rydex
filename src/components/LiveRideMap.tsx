'use client'
import React, { useEffect, useState } from 'react'
import L from "leaflet"
import { MapContainer, Marker, Polyline, TileLayer, useMap } from "react-leaflet"
import axios from 'axios'
import { AnimatePresence, motion } from 'motion/react'
import { MapPin, Navigation, Navigation2 } from 'lucide-react'

type Props = {
    driverLocation: [Number, Number] | null,
    pickUpLocation: [Number, Number] | null,
    dropLoaction: [Number, Number] | null,
    mapStatus: "arriving" | "ongoing" | "completed",
    onStats: (data: {
        distanceToPickup: number,
        etaToPickUp: number,
        distanceToDrop: number,
        etaToDrop: number
    }) => void
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

const driverIcon = new L.DivIcon({
    html: `
    <div style="
      display:flex;
      flex-direction:column;
      align-items:center;
      font-family:Inter,system-ui,sans-serif;
    ">

      <div style="
        width:42px;
        height:42px;
        background:#000;
        border:3px solid #fff;
        border-radius:50%;
        display:flex;
        align-items:center;
        justify-content:center;
        color:#fff;
        font-size:18px;
        font-weight:700;
        box-shadow:
          0 8px 20px rgba(0,0,0,.35),
          0 2px 6px rgba(0,0,0,.2);
      ">
          <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="3" stroke-linecap="round" stroke-linejoin="round">
          <path d="M19 17h2c.6 0 1-.4 1-1v-3c0-.9-.7-1.7-1.5-1.9C18.7 10.6 16 10 16 10s-1.3-1.4-2.2-2.3c-.5-.4-1.1-.7-1.8-.7H5c-.6 0-1.1.4-1.4.9l-1.4 2.9A3.7 3.7 0 0 0 2 12v4c0 .6.4 1 1 1h2"/>
          <circle cx="7" cy="17" r="2"/>
          <circle cx="17" cy="17" r="2"/>
        </svg>
       
      </div>

      <div style="
        width:3px;
        height:10px;
        background:#000;
      "></div>

      <div style="
        width:12px;
        height:12px;
        background:#000;
        border:3px solid #fff;
        border-radius:50%;
        box-shadow:0 4px 10px rgba(0,0,0,.25);
      "></div>

    </div>
  `,
    className: "",
    iconSize: [50, 65],
    iconAnchor: [25, 65],
});


const LiveRideMap = ({ driverLocation, pickUpLocation, dropLoaction, mapStatus, onStats }: Props) => {

    const [routeToPickUp, setRouteToPickUp] = useState<[number, number][]>([]);
    const [routeToDrop, setRouteToDrop] = useState<[number, number][]>([]);

    useEffect(() => {
        if (
            !driverLocation ||
            !pickUpLocation ||
            !dropLoaction
        ) {
            return;
        }

        const [pLat, pLon] = pickUpLocation as [number, number]
        const [dLat, dLon] = dropLoaction as [number, number]
        const [drLat, drLon] = driverLocation as [number, number]

        const getRoute = async (startLat: number, startLon: number, endLat: number, endLon: number) => {
            const res = await axios.get(`https://router.project-osrm.org/route/v1/driving/${startLon},${startLat};${endLon},${endLat}?overview=full&geometries=geojson`)

            return res.data.routes?.[0]
        }

        const fetchRoutes = async () => {
            try {
                if (mapStatus === "arriving") {
                    const pickUpRoute = await getRoute(
                        drLat,
                        drLon,
                        pLat,
                        pLon
                    )
                    const dropRoute = await getRoute(
                        dLat,
                        dLon,
                        drLat,
                        drLon
                    )
                    if (pickUpRoute) {
                        setRouteToPickUp(pickUpRoute.geometry.coordinates.map(([lon, lat]: number[]) => [lat, lon]))
                    }
                    if (dropRoute) {
                        setRouteToDrop(dropRoute.geometry.coordinates.map(([lon, lat]: number[]) => [lat, lon]))

                    }

                    onStats?.({
                        distanceToPickup: (pickUpRoute?.distance ?? 0) / 1000,
                        etaToPickUp: (pickUpRoute?.duration ?? 0) / 60,
                        distanceToDrop: (dropRoute?.distance ?? 0) / 1000,
                        etaToDrop: (dropRoute?.duration ?? 0) / 60,
                    })

                } else {
                    setRouteToPickUp([]);
                    const dropRoute = await getRoute(
                        dLat,
                        dLon,
                        drLat,
                        drLon
                    )

                    if (dropRoute) {
                        setRouteToDrop(dropRoute.geometry.coordinates.map(([lon, lat]: number[]) => [lat, lon]))
                    }

                    onStats?.({
                        distanceToPickup: 0,
                        etaToPickUp: 0,
                        distanceToDrop: (dropRoute?.distance ?? 0) / 1000,
                        etaToDrop: (dropRoute?.duration ?? 0) / 60,
                    })
                }

            } catch (error) {
                console.log(error);

            }
        }

        fetchRoutes();

    }, [driverLocation, mapStatus]);

    const showPickMarker = mapStatus === "arriving"
    const showPickUpRoute = mapStatus === "arriving" && routeToPickUp.length > 0
    const showDropRoute = mapStatus != "completed" && routeToDrop.length > 0

    return (
        <div className='relative h-full w-full bg-zinc-100'>
            <MapContainer
                style={{ width: "100%", height: "100%" }}
                center={pickUpLocation as any}
                zoom={13}
                zoomControl={false}
            >
                <TileLayer
                    attribution='&copy; OpenStreetMap contributors &copy; CARTO'
                    url="https://{s}.basemaps.cartocdn.com/light_all/{z}/{x}/{y}{r}.png"
                />



                {showPickMarker && <Marker
                    position={pickUpLocation as any}
                    icon={pickUpIcon}
                    draggable

                />}

                {dropLoaction && <Marker
                    position={dropLoaction as any}
                    icon={dropIcon}
                    draggable

                />}

                {driverLocation && <Marker
                    position={driverLocation as any}
                    icon={driverIcon}
                    draggable

                />}

                {
                    showPickUpRoute && (
                        <Polyline
                            positions={routeToPickUp}
                            pathOptions={{ color: "#888", lineCap: "round", weight: 4, dashArray: "2 10" }}

                        />
                    )
                }

                {
                    showDropRoute && (
                        <Polyline
                            positions={routeToDrop}
                            pathOptions={{ color: "#0a0a0a", lineCap: "round", lineJoin: "round" }}

                        />
                    )
                }


            </MapContainer>


        </div>
    )
}

export default LiveRideMap;


