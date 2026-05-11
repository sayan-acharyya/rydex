'use client'
import React from 'react'
import L from "leaflet"
import { MapContainer } from "react-leaflet"
type props = {
    pickUp: string,
    drop: string,
    onChange: (p: string, d: string) => void,
    onDistance: (d: number) => void
}

const SearchMap = ({ pickUp, drop, onChange, onDistance }: props) => {
    return (
        <div className='relative h-full w-full bg-zinc-100'>
            <MapContainer
                style={{ width: "100%", height: "100%" }}

            />
        </div>
    )
}

export default SearchMap