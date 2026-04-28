'use client'
import React, { useState } from 'react'
import { motion } from "motion/react";
import { ArrowLeft, FileCheck, UploadCloud, CheckCircle } from 'lucide-react';
import { useRouter } from 'next/navigation';
import axios from 'axios';
import toast from 'react-hot-toast';

type docsType = "aadhar" | "license" | "rc"

const Page = () => {
    const router = useRouter();

    const [docs, setDocs] = useState<Record<docsType, File | null>>({
        aadhar: null,
        license: null,
        rc: null
    });

    const [loading, setLoading] = useState(false);

    const handleImage = (doc: docsType, file: File | null) => {
        if (!file) return;
        setDocs((prev) => ({ ...prev, [doc]: file }))
    }

    const isUploaded = (doc: docsType) => docs[doc] !== null;

    const handleDocs = async () => {
        if (!docs.aadhar || !docs.license || !docs.rc) {
            toast.error("Please upload all documents");
            return;
        }

        try {
            setLoading(true);

            const formdata = new FormData();
            formdata.append("aadhar", docs.aadhar);
            formdata.append("license", docs.license);
            formdata.append("rc", docs.rc);

            await axios.post(
                "/api/partner/onboarding/documents",
                formdata,
                {
                    headers: {
                        "Content-Type": "multipart/form-data",
                    },
                }
            );

            toast.success("Documents uploaded successfully");

            router.push("/partner/onboarding/bank");

        } catch (error: any) {
            console.error(error);
            toast.error(error?.response?.data?.message || "Upload failed");
        } finally {
            setLoading(false);
        }
    };

    const RenderUpload = (
        doc: docsType,
        title: string,
        subtitle: string
    ) => (
        <motion.label
            whileHover={{ scale: 1.02 }}
            className={`flex items-center justify-between p-4 rounded-2xl border cursor-pointer transition
            ${isUploaded(doc)
                    ? "border-green-500 bg-green-50"
                    : "border-gray-200 hover:border-black"
                }`}
        >
            <div>
                <p className='text-sm font-semibold'>{title}</p>

                {docs[doc] ? (
                    <p className='text-xs text-green-600 mt-1 truncate max-w-[160px]'>
                        {docs[doc]?.name}
                    </p>
                ) : (
                    <p className='text-xs text-gray-500'>{subtitle}</p>
                )}
            </div>

            <div className='flex flex-col items-center'>
                {docs[doc] ? (
                    <CheckCircle size={22} className="text-green-600" />
                ) : (
                    <>
                        <span className='text-xs text-gray-400'>Upload</span>
                        <div className='w-10 h-10 rounded-full bg-black text-white flex items-center justify-center'>
                            <UploadCloud size={18} />
                        </div>
                    </>
                )}
            </div>

            <input
                type='file'
                hidden
                accept="image/*,application/pdf"
                onChange={(e) => handleImage(doc, e.target.files?.[0] || null)}
            />
        </motion.label>
    );

    return (
        <div className='min-h-screen bg-white flex items-center justify-center px-4'>
            <motion.div
                initial={{ opacity: 0, y: 28 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.4 }}
                className='w-full max-w-xl bg-white rounded-3xl border border-gray-200 
                shadow-[0_25px_70px_rgba(0,0,0,0.15)] p-6 sm:p-8'
            >
                <div className='relative text-center'>
                    <button
                        onClick={() => router.back()}
                        className='absolute left-0 top-0 w-9 h-9 rounded-full border border-gray-300 
                        flex items-center justify-center hover:bg-gray-100 transition'
                    >
                        <ArrowLeft size={18} />
                    </button>

                    <p className='text-xs text-gray-500 font-medium'>
                        step 2 of 3
                    </p>

                    <h1 className='text-2xl font-bold mt-1'>
                        Upload Documents
                    </h1>

                    <p className='text-sm text-gray-500 mt-2'>
                        Required for verification
                    </p>
                </div>

                <div className='mt-8 space-y-5'>
                    {RenderUpload("aadhar", "Aadhaar / ID Proof", "Government issued ID")}
                    {RenderUpload("license", "Driving License", "Valid driving license")}
                    {RenderUpload("rc", "Vehicle RC", "Registration Certificate")}
                </div>

                <div className='mt-6 flex items-start gap-3 text-xs text-gray-500'>
                    <FileCheck size={16} className='mt-0.5' />
                    <p>Documents are securely stored and manually verified by our team</p>
                </div>

                <motion.button
                    onClick={handleDocs}
                    disabled={loading || !docs.aadhar || !docs.license || !docs.rc}
                    whileHover={{ scale: loading ? 1 : 1.02 }}
                    whileTap={{ scale: loading ? 1 : 0.97 }}
                    className='mt-8 w-full h-14 rounded-2xl bg-black text-white font-semibold flex
                    items-center justify-center gap-2 disabled:opacity-40 transition'
                >
                    {loading ? "Uploading..." : "Continue"}
                </motion.button>
            </motion.div>
        </div>
    )
}

export default Page;