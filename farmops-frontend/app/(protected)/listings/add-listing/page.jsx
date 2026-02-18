"use client"

import RichTextEditor from '@/components/RichTextEditor'
import { MyHook } from '@/context/AppProvider';
import { getCategory } from '@/services/categoryApi';
import { addListing } from '@/services/listingApi';
import { useEffect, useRef, useState } from 'react'

function page() {
  const { authToken } = MyHook();
  const editorRef = useRef(null);
  const [categories, setCategories] = useState([]);
  
   const getCategories = async () => {
    const res = await getCategory(authToken);
    setCategories(res.data);
    
  }

  useEffect(() => {
    getCategories();
  }, [authToken]);



  const handleSubmit = async (e) => {
    e.preventDefault();
    if(editorRef.current) {
      // Get the HTML content from TipTap editor
      const description = editorRef.current.getHTML();
      // Set the value of the hidden input to the editor content
      document.querySelector('input[name="description"]').value = description;
      
      // Log form data for debugging
      const formData = new FormData(e.target);
      console.log("Form Data:", Object.fromEntries(formData));
      
      const result = await addListing(authToken, formData);
      if(result) {
        alert('Listing added successfully!');
        e.target.reset();
      } else {
        alert('Failed to add listing. Please check the form data.');
      }
    }
  }

  return (
    <div className="min-h-screen bg-white py-8 px-4 sm:px-6 lg:px-8">
      <div className="max-w-2xl mx-auto bg-gray-50 rounded-lg shadow-md p-8">
        <h1 className="text-3xl font-bold text-gray-900 mb-6">Add New Listing</h1>
        
        <form encType='multipart/form-data' onSubmit={handleSubmit} className="space-y-6">
          
          {/* Title Field */}
          <div>
            <label className="block text-sm font-semibold text-gray-700 mb-2">Title *</label>
            <input 
              type="text" 
              name='title' 
              placeholder='Enter listing title' 
              required
              className="w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-black focus:border-transparent transition-all"
            />
          </div>

          {/* Description Field */}
          <div>
            <label className="block text-sm font-semibold text-gray-700 mb-2">Description *</label>
            <RichTextEditor editorRef={editorRef} />
            {/* Hidden input to store TipTap content */}
            <input type="hidden" name="description" />
          </div>


          {/* category */}
          <div>
            <label className="block text-sm font-semibold text-gray-700 mb-2">Category *</label>
            <select 
              name='category_id' 
              required
              className="w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-black focus:border-transparent transition-all"
            >
              <option value="">Select a category</option>
              {categories && categories.map((cat) => (
                <option key={cat.id} value={cat.id}>{cat.name}</option>
              ))}
            </select>
          </div>

          {/* Image Field */}
          <div>
            <label className="block text-sm font-semibold text-gray-700 mb-2">Image (optional)</label>
            <input 
              type="file" 
              name='image' 
              accept="image/*"
              className="w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-black focus:border-transparent transition-all file:mr-4 file:py-2 file:px-4 file:rounded-md file:border-0 file:text-sm file:font-semibold file:bg-gray-200 file:text-black hover:file:bg-gray-300"
            />
          </div>

          {/* Submit Button */}
          <div className="flex gap-4 pt-4">
            <button 
              type='submit'
              className="flex-1 bg-black hover:bg-gray-800 text-white font-semibold py-3 rounded-md transition-colors duration-200 focus:outline-none focus:ring-2 focus:ring-black focus:ring-offset-2"
            >
              Submit
            </button>
            
          </div>
        </form>
      </div>
    </div>
  )
}

export default page
