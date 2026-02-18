"use client"

import React, { useEffect, useState } from 'react'
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import {
  Card,
  CardAction,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card"
import { getListings } from '@/services/listingApi'
import { MyHook } from '@/context/AppProvider'

function page() {
  const { authToken } = MyHook();
  const [listings, setListings] = useState([]);

  useEffect(() => 
  {
      getListings(authToken).then((data) => {
        setListings(data.data);
      });
  }, [authToken])

  return (
    <>
      
    </>
  )
}

export default page
