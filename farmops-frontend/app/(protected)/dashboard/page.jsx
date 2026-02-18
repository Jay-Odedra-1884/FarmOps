"use client"
import { MyHook } from '@/context/AppProvider';
import { getUserListings } from '@/services/listingApi';
import { useRouter } from 'next/navigation'
import React, { useEffect, useState } from 'react'
import {
  Card,
  CardAction,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card"
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';

function page() {

  const router = useRouter();
  const { authToken } = MyHook();
  const [listings, setListings] = useState([]);

  const getListings = async () => {
      // fetch user listings and display
      return await getUserListings(authToken)
  }

  useEffect(() => {
    getListings().then((data) => setListings(data.data));
  }, [authToken])
  

  return (
    <div className='mt-5 px-20'>
      {/* <h1 className='text-3xl font-bold'>Dashboard</h1> */}
      <div className='flex justify-between mt-5 mb-5'>
        <p className='font-semibold text-2xl'>Your Blogs</p>
        <div className='bg-black text-white rounded-sm px-2 py-1 cursor-pointer hover:scale-110' onClick={() => router.push('/listings/add-listing')}>+ Add New Blog</div>
      </div>
      <hr />
      <div className='grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 xl:grid-cols-4'>
        {
          listings && listings.map((listing) => (
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
              <CardFooter className={'gap-2'}>
                <Button onClick={() => router.push(`/listings/edit-listing/${listing.id}`)} className="w-1/2 bg-green-400">Edit</Button>
                <Button className="w-1/2 bg-red-500">Delete</Button>
              </CardFooter>
            </Card>
          ))
        }
      </div>
    </div>
  )
}

export default page
