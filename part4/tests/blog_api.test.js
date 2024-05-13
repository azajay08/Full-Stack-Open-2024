const { test, after, beforeEach, describe } = require('node:test')
const assert = require('node:assert')
const mongoose = require('mongoose')
const supertest = require('supertest')
const app = require('../app')
const api = supertest(app)

const helper = require('./test_helper')

const Blog = require('../models/blog')

beforeEach(async () => {
  await Blog.deleteMany({})

  await Blog.insertMany(helper.initialBlogs) 
})

describe('when there is initially some blogs saved', () => {

  test('blogs are returned as json', async () => {
    await api
      .get('/api/blogs')
      .expect(200)
      .expect('Content-Type', /application\/json/)
  })
  
  test('correct amount of blogs are returned', async () => {
    const respone = await api.get('/api/blogs')
    
    assert.strictEqual(respone.body.length, helper.initialBlogs.length)
  })
  
  test('unique identifier property of the blog posts is named id', async () => {
    const blogsAtStart = await helper.blogsInDb()
    
    const blogToView = blogsAtStart[0]
    
    resultBlog = await api
      .get(`/api/blogs/${blogToView.id}`)
      .expect(200)
      .expect('Content-Type', /application\/json/)
    
    assert.deepStrictEqual(resultBlog.body, blogToView)
  })
  
  describe('addition of new blog', () => {

    test('a valid blog can be added', async () => {
      const newBlog = {
        title: 'Blogger',
        author: 'Joe Blogs',
        url: 'www.averagejoe.com',
        likes: 2,
      }
      
      await api
        .post('/api/blogs')
        .send(newBlog)
        .expect(201)
        .expect('Content-Type', /application\/json/)
      
      const blogsAtEnd = await helper.blogsInDb()
      
      const contents = blogsAtEnd.map(blog => blog.title)
      
      assert.strictEqual(blogsAtEnd.length, helper.initialBlogs.length + 1)
      
      assert(contents.includes('Blogger'))
    })
    
    test('a new blog missing likes property defaults to 0', async () => {
      const newBlog = {
        title: 'Blogger',
        author: 'Joe Blogs',
        url: 'www.averagejoe.com',
      }
      
      await api
        .post('/api/blogs')
        .send(newBlog)
        .expect(201)
        .expect('Content-Type', /application\/json/)
      
      const blogsAtEnd = await helper.blogsInDb()
      
      assert.strictEqual(blogsAtEnd.length, helper.initialBlogs.length + 1)
      
      const blogToView = blogsAtEnd[blogsAtEnd.length - 1]
      
      assert.strictEqual(blogToView.likes, 0)
    })
    
    test('a new blog missing title property will not be added', async () => {
      const newBlog = {
        author: 'Joe Blogs',
        url: 'www.averagejoe.com',
        likes: 3,
      }
      
      await api
        .post('/api/blogs')
        .send(newBlog)
        .expect(400)
      
      const blogsAtEnd = await helper.blogsInDb()
      
      assert.strictEqual(blogsAtEnd.length, helper.initialBlogs.length)
    })
    
    test('a new blog missing url property will not be added', async () => {
      const newBlog = {
        title: 'Blogger',
        author: 'Joe Blogs',
        likes: 3,
      }
      
      await api
        .post('/api/blogs')
        .send(newBlog)
        .expect(400)
      
      const blogsAtEnd = await helper.blogsInDb()
      
      assert.strictEqual(blogsAtEnd.length, helper.initialBlogs.length)
    })
  })

  describe('deletion of a blog', () => {
    
    test('a blog can be deleted', async () => {
      const blogsAtStart = await helper.blogsInDb()
      const blogToDelete = blogsAtStart[0]

      await api
        .delete(`/api/blogs/${blogToDelete.id}`)
        .expect(204)

      const blogsAtEnd = await helper.blogsInDb()

      assert.strictEqual(blogsAtEnd.length, helper.initialBlogs.length - 1)

      const contents = blogsAtEnd.map(blog => blog.title)
      assert(!contents.includes(blogToDelete.title))
    })
  })

  describe('updating a blog', () => {

    test('updating information of an individual blog post', async () => {
      const blogsAtStart = await helper.blogsInDb()

      const blogToUpdate = blogsAtStart[0]

      const updatedBlog = {
        title: blogToUpdate.title,
        author: blogToUpdate.author,
        url: blogToUpdate.url,
        likes: 12345,
      }

      await api
        .put(`/api/blogs/${blogToUpdate.id}`)
        .send(updatedBlog)
        .expect(200)
        .expect('Content-Type', /application\/json/)
      
      const blogsAtEnd = await helper.blogsInDb()

      assert.strictEqual(blogsAtEnd.length, helper.initialBlogs.length)

      const likesAtStart = blogsAtStart.map(blog => blog.likes)
      const likesAtEnd = blogsAtEnd.map(blog => blog.likes)

      assert(!likesAtEnd.includes(likesAtStart))
    })
  })
})
  
after(async () => {
  await mongoose.connection.close()
})