import React, { useEffect, useState } from 'react'
import axios from 'axios';
import { useNavigate } from 'react-router-dom';

const PostCard = () => {

    const Navigate = useNavigate();
    const [preview, setPreview] = useState('');
    const [image, setImage] = useState('');
    const [text, setText] = useState('');
    const [loading, setLoading] = useState(false);
    const [user, setUser] = useState('');

    useEffect(() => {
        fetchUserDetails();
    }, [])

    const selectFile = (event) => {
        setPreview(URL.createObjectURL(event.target.files[0]));
        setImage(event.target.files[0]);
    }

    const savePost = async () => {
        if(image && text)
        {
        setLoading(true);
        const data = new FormData();
        data.append("file", image);
        data.append("upload_preset", "hackerInsta");
        data.append("cloud_name", "hacker03");

        const photoRes = await axios.post('https://api.cloudinary.com/v1_1/hacker03/image/upload', data);

        const response = await fetch("/instagram/posts/createPosts", {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
                "authToken": localStorage.getItem('token1')
            },
            body: JSON.stringify({ description: text, photo: photoRes.data.url })
        });

        const result = await response.json()
        if (result.success) {
            setLoading(false);
            Navigate('/');
        }
    }
    else
    {
        alert("Please select something to post...");
    }
    }

    const fetchUserDetails = async () => {
        const response = await fetch('/instagram/auth/getUser', {
            method: "GET",
            headers: {
                "Content-Type": "application/json",
                "authToken": localStorage.getItem('token1')
            }
        })

        const userDetails = await response.json();
        setUser(userDetails);
    }
    return (
        <>
            {
                loading ?
                    <img src="/images/spinner.gif" alt="loader" />
                    :
                    <div className=' p-2 w-[90%] m-auto bg-white rounded-2xl createdPostCard flex flex-col justify-evenly'>
                        <h1 className='p-2 text-center font-bold text-xl'>Create Post and Share Your Best Time</h1>
                        <hr />
                        <div className='m-2 flex items-center'>
                            <img src="https://cdn-icons-png.flaticon.com/128/3135/3135715.png" className='w-8' alt="logo" />
                            <h5 className='ml-2 font-bold'>{user.name}</h5>
                        </div>
                        <div className='py-3'>
                            {preview ? <img src={preview} alt="preview" className='w-[50%] m-auto' id='preview' /> : <img src='/images/default_images.png' className='w-[50%] m-auto' alt="preview" id='preview' />}
                        </div>
                        <div className='p-2'>
                            <input type="file" name="file" id="file" className='my-2 text-xs' onChange={selectFile} />
                            <div className='flex'>
                                <textarea name="description" id="description" className='border-2 border-gray-400 text-black px-2 text-sm w-full' placeholder='write something about your post...' onChange={(event) => { setText(event.target.value) }}></textarea>
                                <button className='py-1 ml-2 px-5 rounded-full bg-gray-300 hover:bg-gray-400 transition-all' onClick={savePost}><i className="fa-solid fa-arrow-right fa-xl"></i></button>
                            </div>
                        </div>
                    </div>
            }
        </>
    )
}

export default PostCard