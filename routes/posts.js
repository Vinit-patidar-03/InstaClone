const express = require('express');
const checkUser = require('../middleware/checkUser');
const Post = require('../models/Post');
const router = express.Router();

//For posts by all users
router.post('/createPosts', checkUser, async (req, res) => {
     try {
          let success = false;
          const { description, photo } = req.body;

          if (!description || !photo) {
               return res.status(422).json({ success, msg: 'Please Fill all the Required Fields' });
          }

          await Post.create({
               description: description,
               photo: photo,
               user: req.user.id,
               name: req.user.name
          })
          success = true;
          res.status(200).send({ success, msg: 'post created successfully' });
     } catch (error) {
          console.error('Unable to process');
     }
})

//For individual posts
router.get('/individualPosts', checkUser, async (req, res) => {

     let success = false;
     try {
          const userId = req.user.id;
          const Posts = await Post.find({ user: userId });
          res.status(200).send(Posts);
     } catch (error) {
          res.status(500).send({ success, msg: 'internal server error' })
     }
})

router.delete('/deletePost', async (req, res) => {
     try {
          let success = false;
          const { id } = req.body;
          console.log(id);
          await Post.findByIdAndDelete(id);
          success = true;
          res.json({ success, msg: "post deleted" });
     } catch (error) {
          console.error('error')
     }
})
router.get('/posts', async (req, res) => {
     const Posts = await Post.find();
     res.status(200).send(Posts);
})

router.put('/like', checkUser, async (req, res) => {
     try {
          let success = false;
          const { postId } = req.body;
          let posts = await Post.findById(postId);
          // console.log(posts.likes.includes(req.user.id));
          if(posts.likes.includes(req.user.id)) 
          {
               await Post.findByIdAndUpdate(postId, {$pull : { likes : req.user.id } }, { new: true }) 
               res.json({success,"msg":"post unliked"})
          }
          else
          { 
               await Post.findByIdAndUpdate(postId, {$push : { likes : req.user.id } }, { new: true })
               success = true;
               res.json({success,"msg":"post liked"});
          }
     } catch (error) {
          res.status(403).send('Unable to update');
     }

})
module.exports = router;