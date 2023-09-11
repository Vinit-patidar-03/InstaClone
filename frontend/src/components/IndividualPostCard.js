import React from 'react'
import { useNavigate } from 'react-router-dom';

const IndividualPostCard = (props) => {
  const Navigate = useNavigate('');
    const {post} = props;

    const deletePost = async ()=>
    {
        const response = await fetch('/instagram/posts/deletePost',{
          method : 'DELETE',
          headers : {
          'Content-Type' : 'application/json'
          },
          body : JSON.stringify({id : post._id})
        })

        const result = await response.json();

        if(result.success === true)
        {
          Navigate('/');
        }
    }
  return (
    <>
        <div className='cursor-pointer mt-10 p-5 shadow-lg'>
             <div className='relative h-[300px] transition-all hover:scale-110'>
                    <img src={post.photo} className='h-full rounded-xl shadow-lg' alt="logo" />
                    <i className="fa-solid fa-trash absolute right-3 top-3 cursor-pointer text-red-600" onClick={deletePost}></i>
             </div>
        </div>
    </>
  )
}

export default IndividualPostCard