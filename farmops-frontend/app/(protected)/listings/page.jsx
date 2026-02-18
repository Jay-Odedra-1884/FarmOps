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

  useEffect(() => {
    getListings(authToken).then((data) => {
      setListings(data.data);
      console.log("Fetched Listings:", data.data);
    });
  }, [authToken])

  return (
    <>
      <div className='grid grid-cols-1 md:grid-cols-3 xl:grid-cols-4 gap-6 mt-10'>
        {listings ? (
          listings.map((listing) => (
            <Card key={listing.id} className="relative mx-auto my-3 w-full max-w-sm pt-0 overflow-hidden">
              <div className="absolute inset-0 z-30 aspect-video bg-black/35" />
              <img
                src={listing.image ? 'http://127.0.0.1:8000/storage/'+listing.image : 'http://127.0.0.1:8000/storage/placeholder.png' }
                alt="Event cover"
                className="relative z-20 aspect-video w-full object-cover dark:brightness-40"
              />
              <CardHeader>
                <CardAction>
                  <Badge variant="secondary">{listing.category?.name || "Uncategorized"}</Badge>
                </CardAction>
                <CardTitle>{listing.title}</CardTitle>
                <CardDescription>
                  <div
                    dangerouslySetInnerHTML={{ __html: listing.description }}
                  ></div>
                </CardDescription>
              </CardHeader>
              <CardFooter>
                <Button className="w-full">Read More</Button>
              </CardFooter>
            </Card>
          ))
        ) : (
          <p>No listings available.</p>
        )}
      </div>
    </>
  )
}

export default page
