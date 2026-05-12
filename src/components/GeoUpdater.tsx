'use client'
import { getSocket } from '@/lib/socket';
import React, { useEffect, useRef } from 'react'

const GeoUpdater = ({ userId }: { userId: string }) => {

    const socketref = useRef<any>(null)

    useEffect(() => {
        if (!userId) return;
        if (!navigator.geolocation) return;

        socketref.current = getSocket();
        socketref.current.emit("identity", userId)

        const watcher = navigator.geolocation.watchPosition(({ coords }) => {
            socketref.current.emit("update-location", {
                userId,
                latitude: coords.latitude,
                longitude: coords.longitude
            })
        }, (err) => {
            console.log(err);

        },
            {
                enableHighAccuracy: true,
                maximumAge: 5000
            }
        )
        return () => { navigator.geolocation.clearWatch(watcher) }
    }, [userId])

    return null;
}

export default GeoUpdater