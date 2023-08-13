//create web server
const express = require('express');
const router = express.Router();
//import database
const db = require('../db');
//import models
const Comment = require('../models/comment');
const User = require('../models/user');
const Post = require('../models/post');
//import middleware
const { asyncHandler } = require('../middleware/async-handler');
const { authenticateUser } = require('../middleware/auth-user');
const { validatePost } = require('../middleware/validate-post');
const { validateComment } = require('../middleware/validate-comment');
const { validateUser } = require('../middleware/validate-user');
//import helpers
const { createError } = require('../helpers/error');
const { checkId } = require('../helpers/check-id');
//import Sequelize
const { Op } = require('sequelize');
//import bcryptjs
const bcryptjs = require('bcryptjs');
//import jsonwebtoken
const jwt = require('jsonwebtoken');
//import dotenv
const dotenv = require('dotenv');
dotenv.config();

//get all comments
router.get('/', asyncHandler(async (req, res) => {
    const comments = await Comment.findAll();
    res.json(comments);
}));

//get all comments for a post
router.get('/post/:id', asyncHandler(async (req, res) => {
    const post = await Post.findByPk(req.params.id);
    if(post) {
        const comments = await Comment.findAll({
            where: {
                postId: req.params.id
            }
        });
        res.json(comments);
    } else {
        res.status(404).json({ message: 'Post not found.' });
    }
}));

//get a comment
router.get('/:id', asyncHandler(async (req, res) => {
    const comment = await Comment.findByPk(req.params.id);
    if(comment) {
        res.json(comment);
    } else {
        res.status(404).json({ message: 'Comment not found.' });
    }
}));

//create a comment
router.post('/', authenticateUser, validateComment, asyncHandler(async (req, res) => {
    const comment = await Comment.create(req.body);
    res.status(201).json(comment);
}));

//delete a comment
router.delete('/:id', authenticateUser, asyncHandler(async (req, res) => {
    const comment = await Comment.findByPk(req.params.id);
    if(comment) {
        if(comment.userId === req.currentUser.id) {
            await comment.destroy();
            res.status(204).end();