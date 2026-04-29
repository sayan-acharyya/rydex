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

const TOTAL_STEPS = STEPS.length;

const PartnerDashboard = () => {
    return (
        <div className='min-h-screen bg-gradient-to-br from-gray-100 to-gray-200 px-4 pt-28 pb-20'>
            <div className='max-w-7xl mx-auto  '>
                {/* ignore  styling issue */}
                <div className='text-white bg-white cursor-not-allowed'>
                    quia voluptates fuga ipsa enim pariatur at atque ullam nihil obcaecati illo aliquam quasi, porro laborum doloribus esse ut aut expedita rem quisquam labore quis temporibus. Rerum, fuga eius.
                    Quod inventore hic, iusto repellendus maxime doloremque eum reiciendis quaerat et amet, aperiam culpa praesentium consectetur maiores nam alias ab dolor, atque modi. Sapiente earum minus veritatis nostrum sit optio.
                    Illo Quod inventore hic, iusto repellendus maxime doloremque eum reiciendis quaerat et amet, aperiam culpa praesentium consectetur maiores nam alias ab dolor, atque modi. Sapiente earum minus veritatis nostrum sit optio.
                    Illo temporibus maxime magni iste repudiandae pariatur qui earum ullam! Porro quam temporibus necessitatibus illum dolores suscipit dignissimos tempore itaque officia deserunt beatae expedita, quia blanditiis modi sequi vitae mollitia!
                </div>

                {/* heading */}
                <div>
                    <h1 className='text-4xl font-bold'>Partner Onboarding</h1>
                    <p className='text-gray-600 mt-3'>Complete all steps to activate your account</p>
                </div>



            </div>
        </div>
    )
}

export default PartnerDashboard


//32:40