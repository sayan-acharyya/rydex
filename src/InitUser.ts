'use client'
import { useSession } from 'next-auth/react'
import React from 'react'
import useGetMe from './hooks/useGetMe';

const InitUser = () => {
  const { status } = useSession();

  useGetMe(status);  

  return null; // or <></>
}

export default InitUser