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
import { useRouter } from 'next/navigation'

function page() {
  const { authToken } = MyHook();
  const [listings, setListings] = useState([]);
  const [currentPage, setCurrentPage] = useState(1);
  const [lastPage, setLastPage] = useState(1);
  const router = useRouter();

  useEffect(() => {
    if (authToken) {
      getListings(authToken, currentPage)
        .then((res) => {
          if (res.success) {
            setListings(res.data.data);
            setLastPage(res.last_page);
          }
    });
  }
}, [authToken, currentPage]);

return (
  <>
    <div className='grid grid-cols-1 md:grid-cols-3 xl:grid-cols-5 gap-6 mt-10'>
      {listings ? (
        listings.map((listing) => (
          <Card key={listing.id} onClick={() => router.push(`/listings/${listing.id}`)} className="relative mx-auto my-3 w-full max-w-sm pt-0 overflow-hidden">
            <div className="absolute inset-0 z-30 aspect-video bg-black/35" />
            <img
              src={listing.image ? 'http://127.0.0.1:8000/storage/' + listing.image : 'http://127.0.0.1:8000/storage/placeholder.png'}
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
      <div className='flex gap-4 w-full justify-center items-center mt-5 mb-10'>
        <div onClick={() => setCurrentPage(prev => prev > 1 ? prev - 1 : prev)} className={`bg-black px-2 py-1 rounded-sm text-white ${currentPage === 1 ? 'opacity-50 cursor-not-allowed' : 'cursor-pointer'}`}>Prev</div>
        <div>{currentPage} of {lastPage}</div>
        <div onClick={() => setCurrentPage(prev => prev < lastPage ? prev + 1 : prev)} className={`bg-black px-2 py-1 rounded-sm text-white ${currentPage === lastPage ? 'opacity-50 cursor-not-allowed' : 'cursor-pointer'}`}>Next</div>
      </div>
  </>
)
}

export default page
