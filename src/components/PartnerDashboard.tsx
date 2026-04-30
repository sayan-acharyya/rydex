'use client'

import React from 'react'


type Step = {
    id: number,
    title: string,
    route?: string
};

const STEPS: Step[] = [
    { id: 1, title: "Vehicle", route: "/partner/onboarding/vehicle" },
    { id: 2, title: "Documents", route: "/partner/onboarding/documents" },
    { id: 3, title: "Bank", route: "/partner/onboarding/bank" },
    { id: 4, title: "Review" },
    { id: 5, title: "Video KYC" },
    { id: 6, title: "Pricing" },
    { id: 7, title: "Final Review" },
    { id: 8, title: "Live" },
]
const PartnerDashboard = () => {
    return (
        <div className='min-h-screen bg-gradient-to-r from-gray-100 to-gray-200
         px-4 pt-28 pb-20'>
             
        </div>
    )
}

export default PartnerDashboard