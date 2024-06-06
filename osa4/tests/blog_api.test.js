const { test, after, beforeEach } = require('node:test')
const assert = require('node:assert')
const mongoose = require('mongoose')
const supertest = require('supertest')
const app = require('../app')
const helper = require('./test_helper')
const Blog = require('../models/blog')
const bcrypt = require('bcryptjs')
const User = require('../models/user')

const api = supertest(app)

beforeEach(async () => {
  await Blog.deleteMany({})
  await Blog.insertMany(helper.initialBlogs)
})

test('GET /api/blogs - blogs are returned as json', async () => {
  await api
    .get('/api/blogs')
    .expect(200)
    .expect('Content-Type', /application\/json/)
})

test('GET /api/blogs - blog identification field is called id', async () => {
  const response = await api.get('/api/blogs')

  const validateId = response.body.map(blog => blog._id)
  assert.notStrictEqual(validateId, undefined)
})

test('POST /api/blogs - a valid blog can be added', async () => {
  const newBlog = {
    title: 'I sneezed so loud my glass broke',
    author: 'BrokenGlassMan',
    likes: 12
  }

  await api
    .post('/api/blogs')
    .send(newBlog)
    .expect(201)
    .expect('Content-Type', /application\/json/)

  const response = await api.get('/api/blogs')

  const content = response.body.map(r => r.title)

  console.log('Test blogs:')
  content.forEach((i) => console.log(i))
  assert.strictEqual(response.body.length, helper.initialBlogs.length + 1)

  assert(content.includes('I sneezed so loud my glass broke'))
})

test('POST /api/blogs - blog with undefined likes equals to zero', async () => {
  const newBlog = {
    title: 'Amazing blog',
    author: 'Magnificent blogger',
    likes: 18
  }

  await api
    .post('/api/blogs')
    .send(newBlog)
    .expect(201)

  const response = await api.get('/api/blogs')

  assert.strictEqual(response.body.length, helper.initialBlogs.length + 1)
})

test('POST /api/blogs - blog without title or URL is not added', async () => {
  const newBlog = {
    author: 'Retard',
    likes: 6
  }

  await api
    .post('/api/blogs')
    .send(newBlog)
    .expect(400)

  const response = await api.get('/api/blogs')

  assert.strictEqual(response.body.length, helper.initialBlogs.length)
})

test('DELETE /api/blogs/:id - succeeds with status code 204 if id is valid', async () => {
  const blogsAtStart = await helper.blogsInDb()
  const blogToDelete = blogsAtStart[0]

  await api.delete(`/api/blogs/${blogToDelete.id}`).expect(204)

  const blogsAtEnd = await helper.blogsInDb()

  assert.strictEqual(blogsAtEnd.length, helper.initialBlogs.length - 1)

  const contents = blogsAtEnd.map(r => r.title)
  assert(!contents.includes(blogToDelete.title))
})

test('PUT /api/blogs/:id - a blog\'s likes are editable', async () => {
  const blogsAtStart = await helper.blogsInDb()
  const blogToUpdate = blogsAtStart[0]
  const newBlog = {
    title: 'Kuvaamataiteen työ',
    author: 'Leonardo da Vinci',
    likes: 5
  }

  await api
    .put(`/api/blogs/${blogToUpdate.id}`)
    .send(newBlog)
    .expect(200)

  const blogsAtEnd = await helper.blogsInDb()
  const blogToUpdateAgain = blogsAtEnd.find(b => b.id === blogToUpdate.id)

  assert.strictEqual(blogToUpdateAgain.likes, 5)
  assert.strictEqual(blogsAtEnd.length, helper.initialBlogs.length)

  const contents = blogsAtEnd.filter(b => b.id !== blogToUpdate.id)
  assert(contents.length === helper.initialBlogs.length - 1)
})

beforeEach(async () => {
  await User.deleteMany({})

  const passwordHash = await bcrypt.hash('sekret', 10)
  const user = new User({ username: 'root', passwordHash })

  await user.save()
})

test('User API - creation succeeds with a fresh username', async () => {
  const usersAtStart = await helper.usersInDb()

  const newUser = {
    username: 'testuser',
    name: 'Test User',
    password: 'testpassword',
  }

  await api
    .post('/api/users')
    .send(newUser)
    .expect(201)
    .expect('Content-Type', /application\/json/)

  const usersAtEnd = await helper.usersInDb()
  assert.strictEqual(usersAtEnd.length, usersAtStart.length + 1)

  const usernames = usersAtEnd.map(u => u.username)
  assert(usernames.includes(newUser.username))
})

test.only('User API - creation fails with proper statuscode and message if username already taken', async () => {
  const usersAtStart = await helper.usersInDb()

  const newUser = {
    username: 'root',
    name: 'Superuser',
    password: 'salainen',
  }

  const result = await api
    .post('/api/users')
    .send(newUser)
    .expect(400)
    .expect('Content-Type', /application\/json/)

  const usersAtEnd = await helper.usersInDb()
  assert(result.body.error.includes('expected `username` to be unique'))

  assert.strictEqual(usersAtEnd.length, usersAtStart.length)
})

after(async () => {
  await User.deleteMany({})
  await mongoose.connection.close()
})
