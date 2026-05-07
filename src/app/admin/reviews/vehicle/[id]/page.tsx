'use client'

import axios from 'axios';
import { useParams } from 'next/navigation'
import React, { useEffect, useState } from 'react'

const page = () => {
    const { id } = useParams();
    const [data, setData] = useState();

    useEffect(() => {
        const load = async () => {
            try {
                const  {data} = await axios.get(`/api/admin/reviews/vehicle/${id}`);
                setData(data);

            } catch (error: any) {
                console.log(error.response.data.message ?? error);

            }
        }
        load();
    }, [id]);

    return (
        <div>

        </div>
    )
}

export default page;

//8:15:44