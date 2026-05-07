'use client'
import { IVehicle } from '@/models/vehicle.model'
import React, { useState } from 'react'
import { motion, AnimatePresence } from "motion/react"
import { ImagePlus, IndianRupee, X } from 'lucide-react'
import axios from 'axios'
import toast from 'react-hot-toast'
import { useRouter } from 'next/navigation'

type PropsType = {
    open: boolean,
    onClose: (a: boolean) => void,
    data: IVehicle | null
}

const PricingModal = ({ open, onClose, data }: PropsType) => {
    const [image, setImage] = useState<File | null>(null);
    const [preview, setPreview] = useState<string | null>(data?.imageUrl ||null);
    const [baseFare, setBaseFare] = useState(data?.baseFare ||"");
    const [pricePerKM, setPricePerKM] = useState(data?.pricePerKM ||"");
    const [waitingCharge, setWaitingCharge] = useState(data?.waitingCharge ||"");
    const [loading, setLoading] = useState(false);
  

    const handleSubmit = async () => {
        try {
            setLoading(true)
            const formData = new FormData();
            formData.append("baseFare", baseFare);
            formData.append("waitingCharge", waitingCharge);
            formData.append("pricePerKM", pricePerKM);
            if (image) {
                formData.append("image", image);
            }

            const { data } = await axios.post("/api/partner/onboarding/pricing", formData);
            toast.success("saved successfully");
             
            setLoading(false);
            onClose(false);
        } catch (error: any) {
            console.log(error.response.data.message ?? error);
            setLoading(false)

        }
    }
    return (
        <AnimatePresence>
            {open && (
                <motion.div
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    exit={{ opacity: 0 }}
                    className='fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center z-50 px-4'
                >
                    <motion.div
                        initial={{ scale: 0.9, y: 40 }}
                        animate={{ scale: 1, y: 0 }}
                        exit={{ scale: 0.9, y: 40 }}
                        transition={{ duration: 0.2 }}
                        className='bg-white w-full max-w-lg rounded-3xl shadow-2xl overflow-hidden'
                    >

                        {/* Header */}
                        <div className='flex items-center justify-between p-6 border-b'>
                            <h2 className='text-xl font-bold'>Vehicle Details & Pricing</h2>
                            <button onClick={() => onClose(false)}>
                                <X className='text-gray-500 hover:text-black' />
                            </button>
                        </div>

                        {/* Body */}
                        <div className='p-6 space-y-6'>

                            {/* Image Upload */}
                            <label
                                htmlFor='imageLabel'
                                className='relative h-44 border-2 border-dashed rounded-2xl flex items-center justify-center cursor-pointer overflow-hidden group hover:border-black transition'
                            >
                                {!preview ? (
                                    <div className='flex flex-col items-center text-gray-500 group-hover:text-black'>
                                        <ImagePlus size={30} />
                                        <p className='text-sm mt-2'>Upload Vehicle Image</p>
                                    </div>
                                ) : (
                                    <>
                                        <img
                                            className='absolute inset-0 w-full h-full object-cover'
                                            src={preview}
                                        />
                                        <div className='absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 flex items-center justify-center text-white text-sm transition'>
                                            Change Image
                                        </div>
                                    </>
                                )}

                                <input
                                    id='imageLabel'
                                    type="file"
                                    accept="image/*"
                                    hidden
                                    onChange={(e) => {
                                        if (e.target.files?.[0]) {
                                            const file = e.target.files[0];
                                            setImage(file);
                                            setPreview(URL.createObjectURL(file));
                                        }
                                    }}
                                />
                            </label>

                            {/* Input Field Component */}
                            {[
                                { label: "Base Fare", value: baseFare, setter: setBaseFare, placeholder: "Enter base fare" },
                                { label: "Price Per KM", value: pricePerKM, setter: setPricePerKM, placeholder: "Enter price per km" },
                                { label: "Waiting Charge", value: waitingCharge, setter: setWaitingCharge, placeholder: "Enter waiting charge" }
                            ].map((field, i) => (
                                <div key={i}>
                                    <p className='text-sm font-semibold mb-1'>{field.label}</p>
                                    <div className='flex items-center gap-2  bg-gray-100 border border-gray-500 rounded-xl px-4 py-3 bg-gray-50 focus-within:border-black transition'>
                                        <IndianRupee size={18} className='text-gray-500' />
                                        <input
                                            type="number"
                                            value={field.value}
                                            placeholder={field.placeholder}
                                            onChange={(e) => field.setter(e.target.value)}
                                            className='w-full bg-transparent outline-none text-sm'
                                        />
                                    </div>
                                </div>
                            ))}

                        </div>

                        {/* Footer */}
                        <div className='p-6 border-t flex gap-3'>
                            <button
                                onClick={() => onClose(false)}
                                className='flex-1  bg-gray-200 hover:bg-gray-300 border border-gray-400 rounded-xl py-2 font-medium hover:bg-gray-100 transition'
                            >
                                Cancel
                            </button>

                            <button
                                disabled={loading}
                                onClick={handleSubmit}
                                className='flex-1 bg-black text-white rounded-xl py-2 font-medium hover:opacity-90 transition'
                            >
                                {loading ? "Saving . . . ." : "Save"}
                            </button>
                        </div>

                    </motion.div>
                </motion.div>
            )}
        </AnimatePresence>
    )
}

export default PricingModal;