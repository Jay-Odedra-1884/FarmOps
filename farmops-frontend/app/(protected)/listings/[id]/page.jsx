"use client"

import { Spinner } from '@/components/ui/spinner';
import { MyHook } from '@/context/AppProvider';
import { echo } from '@/lib/echo';
import { getComments, postComment } from '@/services/commentApi';
import { getListingById } from '@/services/listingApi';
import { useParams, useRouter } from 'next/navigation';

import React, { useEffect, useState } from 'react'

function page() {
    const { authToken } = MyHook();
    const { id } = useParams();
    const [listing, setListing] = useState(null);
    const [loading, setLoading] = useState(false);
    const [comments, setComments] = useState([]);
    const [commentsPage, setCommentsPage] = useState(1);
    const [commentsLoading, setCommentsLoading] = useState(false);
    const router = useRouter();

    useEffect(() => {
        if (authToken) {
            setLoading(true);
            getListingById(authToken, id)
                .then((res) => setListing(res.data))
                .catch((err) => console.log(err))
                .finally(() => setLoading(false));
        }

    }, [authToken, id])


    //to get the comment and set in comment state variable
    useEffect(() => {
        if (listing) {
            setCommentsLoading(true);
            getComments(authToken, listing.id, commentsPage)
                .then((res) => {
                    if (commentsPage === 1) {
                        setComments(res.data.data);
                    } else {
                        setComments(prev => [...prev, ...res.data.data]);
                    }
                })
                .catch((err) => console.log(err))
                .finally(() => setCommentsLoading(false));
        }
    }, [authToken, listing, commentsPage, id])

    useEffect(() => {
        if (!listing) return;

        const channel = echo.channel('listing.' + listing.id);

        channel.listen('.CommentCreated', (e) => {
            setComments(prev => [e.comment, ...prev]);
        });

        return () => {
            echo.leaveChannel('listing.' + listing.id);
        }
    }, [listing])


    //for comment post form submission
    const handleCommentPostSubmit = (e) => {
        e.preventDefault();
        const content = e.target.comment.value;
        if (content.trim() === "") return;
        postComment(authToken, listing.id, content)
            .then((res) => {
                if (res.success) {
                    e.target.reset();
                }
            })
            .catch((err) => console.log(err));
    }

    return (
        <div>
            {loading ? (
                <div className='mt-20 w-full flex flex-col justify-center items-center'>
                    <Spinner className="size-20 text-black" />
                    <p>Please wait...</p>
                </div>
            ) : (
                <div>
                    <div className='bg-black px-2 py-1 rounded-sm text-white w-fit m-5 cursor-pointer hover:scale-105 transition-all duration-100 hover:shadow-lg' onClick={() => router.push('/listings')}>Back to Read</div>
                    <div className='w-full flex flex-col items-center mt-10'>
                        <h1 className='text-3xl font-bold p-5 md:p-0'>{listing?.title}</h1>
                        <div className='w-full p-5 xl:w-1/2 xl:p-0'>
                            <img src={listing?.image ? 'http://127.0.0.1:8000/storage/' + listing.image : 'http://127.0.0.1:8000/storage/placeholder.png'} alt="Listing cover" className="size-full object-cover rounded-md my-4" />
                        </div>
                        <p className='text-xl'>Category: {listing?.category?.name || "Uncategorized"}</p>
                        <div className='text-xl w-full xl:w-1/2 mt-10 mb-10'>
                            <div
                                dangerouslySetInnerHTML={{ __html: listing?.description.replace(/<p><\/p>/g, '<br />') }}
                            ></div>
                        </div>
                        <div className='w-full flex flex-col items-center'>
                            <div className='w-full xl:w-1/2 px-2 bg-gray-200 rounded-t-sm'>
                                {/* <p className='font-semibold text-lg mt-4'>Comments</p> */}
                                <form onSubmit={handleCommentPostSubmit}>
                                    <div className='py-3 mt-2'>
                                        <textarea className='w-full outline-none' rows={3} name="comment" id="comment" placeholder='Add a comment'></textarea>
                                    </div>
                                    <div className="flex justify-end mt-2">
                                        <button className='bg-black text-white px-2 py-1 mb-3 rounded-sm'>
                                            Add Comment
                                        </button>
                                    </div>
                                </form>
                            </div>
                            <div className='w-1/2'>
                                <div>
                                    {commentsLoading ? (
                                        <div className='flex justify-center items-center'>
                                            <Spinner className="size-10 text-black" />
                                        </div>
                                    ) : (
                                        <div className='bg-gray-50 px-4 py-3'>
                                            {
                                                comments.map((comment) => (
                                                    <div key={comment.id} className='border border-gray-300 py-2 px-5 rounded-b-sm mt-5'>
                                                        <p className='font-semibold'>{comment.user?.name}</p>
                                                        <p>{comment.content}</p>
                                                    </div>
                                                ))
                                            }
                                            <div className=' w-fit text-gray-600 px-2 py-1 rounded-sm mt-5 cursor-pointer' onClick={() => setCommentsPage(prev => prev + 1)}>More comments</div>
                                        </div>
                                    )}
                                </div>
                            </div>
                        </div>
                        <div className='min-h-screen'></div>
                    </div>
                </div>
            )}
        </div>
    )
}

export default page
