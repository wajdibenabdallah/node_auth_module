import mongoose from 'mongoose';
// TODO
import { Post } from '../models/post';
import jwt from 'jsonwebtoken';
import path from 'path';

// me
const me = (req, res) => {
  let token = req.headers.authorization.split(' ')[1];
  let user;
  try {
    user = jwt.verify(token, process.env.SECRET);
  } catch (e) {
    console.log(e);
    return res.status(401).send('unauthorized');
  }
  res.status(200).send(user);
};

// publish new
const publish = (req, res) => {
  let Post = mongoose.model('Post');
  let post = new Post();

  /*
  if (!post.isValid(req.body)) {
    res.status(400).json('Données invalide');
    return;
  }
  */

  post.data.title = req.body.title;
  post.data.text = req.body.text;
  post.data.creationDate = new Date();

  if (req.file) {
    post.data.imageUri = path.join(req.file.destination, req.file.filename);
  }

  post.save((err) => {
    if (err) {
      res.status(500).json({ error: err });
      return;
    }
    res.status(200).json({ success: true, post: post });
  });
};

// load news
const load = (req, res) => {
  let Post = mongoose.model('Post');
  Post.find({}, (err, data) => {
    if (err) res.status(500).send('Error');
    res.status(200).send(data);
  });
};

export { me, publish, load };
