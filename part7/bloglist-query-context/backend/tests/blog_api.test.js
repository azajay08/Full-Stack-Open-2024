const { test, after, beforeEach, describe } = require("node:test");
const assert = require("node:assert");
const mongoose = require("mongoose");
const supertest = require("supertest");
const bcrypt = require("bcrypt");
const app = require("../app");
const api = supertest(app);

const helper = require("./test_helper");

const Blog = require("../models/blog");
const User = require("../models/user");

let token = null;

beforeEach(async () => {
  await User.deleteMany({});
  await Blog.deleteMany({});

  const password = "password1";
  const saltRounds = 10;
  const passwordHash = await bcrypt.hash(password, saltRounds);

  const user = new User({
    username: "User1",
    name: "User One",
    blogs: [],
    passwordHash,
  });

  await user.save();

  const userLogin = {
    username: "User1",
    password: "password1",
  };

  const login = await api.post("/api/login").send(userLogin);

  token = login.body.token;

  const blogObjects = helper.initialBlogs.map(
    (blog) =>
      new Blog({
        title: blog.title,
        author: blog.author,
        url: blog.url,
        user: user._id,
        likes: blog.likes ? blog.likes : 0,
      }),
  );

  const promiseBlogs = blogObjects.map((blog) => blog.save());
  await Promise.all(promiseBlogs);
});

describe("when there is initially some blogs saved", () => {
  test("blogs are returned as json", async () => {
    await api
      .get("/api/blogs")
      .expect(200)
      .expect("Content-Type", /application\/json/);
  });

  test("correct amount of blogs are returned", async () => {
    const response = await api.get("/api/blogs");

    assert.strictEqual(response.body.length, helper.initialBlogs.length);
  });

  test("unique identifier property of the blog posts is named id", async () => {
    const blogsAtStart = await helper.blogsInDb();

    const blogToView = blogsAtStart[0];

    const resultBlog = await api
      .get(`/api/blogs/${blogToView.id}`)
      .expect(200)
      .expect("Content-Type", /application\/json/);

    assert.strictEqual(resultBlog.id, blogToView._id);
    assert.strictEqual(resultBlog._id, undefined);
  });

  describe("addition of new blog", () => {
    test("a valid blog can be added", async () => {
      const newBlog = {
        title: "Blogger",
        author: "Joe Blogs",
        url: "www.averagejoe.com",
        likes: 2,
      };

      await api
        .post("/api/blogs")
        .send(newBlog)
        .set("Authorization", `Bearer ${token}`)
        .expect(201)
        .expect("Content-Type", /application\/json/);

      const blogsAtEnd = await helper.blogsInDb();

      const titles = blogsAtEnd.map((blog) => blog.title);

      assert.strictEqual(blogsAtEnd.length, helper.initialBlogs.length + 1);

      assert(titles.includes("Blogger"));
    });

    test("a new blog missing likes property defaults to 0", async () => {
      const newBlog = {
        title: "Blogger",
        author: "Joe Blogs",
        url: "www.averagejoe.com",
      };

      await api
        .post("/api/blogs")
        .send(newBlog)
        .set("Authorization", `Bearer ${token}`)
        .expect(201)
        .expect("Content-Type", /application\/json/);

      const blogsAtEnd = await helper.blogsInDb();

      assert.strictEqual(blogsAtEnd.length, helper.initialBlogs.length + 1);

      const blogToView = blogsAtEnd[blogsAtEnd.length - 1];

      assert.strictEqual(blogToView.likes, 0);
    });

    test("a new blog missing title property will not be added", async () => {
      const newBlog = {
        author: "Joe Blogs",
        url: "www.averagejoe.com",
        likes: 3,
      };

      await api
        .post("/api/blogs")
        .send(newBlog)
        .set("Authorization", `Bearer ${token}`)
        .expect(400);

      const blogsAtEnd = await helper.blogsInDb();

      assert.strictEqual(blogsAtEnd.length, helper.initialBlogs.length);
    });

    test("a new blog missing url property will not be added", async () => {
      const newBlog = {
        title: "Blogger",
        author: "Joe Blogs",
        likes: 3,
      };

      await api
        .post("/api/blogs")
        .send(newBlog)
        .set("Authorization", `Bearer ${token}`)
        .expect(400);

      const blogsAtEnd = await helper.blogsInDb();

      assert.strictEqual(blogsAtEnd.length, helper.initialBlogs.length);
    });

    test("adding a blog fails with unauthorized users", async () => {
      const newBlog = {
        title: "Blogger",
        author: "Joe Blogs",
        url: "www.averagejoe.com",
        likes: 2,
      };

      await api
        .post("/api/blogs")
        .send(newBlog)
        .expect(401)
        .expect("Content-Type", /application\/json/);

      const blogsAtEnd = await helper.blogsInDb();

      const contents = blogsAtEnd.map((blog) => blog.title);

      assert.strictEqual(blogsAtEnd.length, helper.initialBlogs.length);

      assert(!contents.includes("Blogger"));
    });
  });

  describe("deletion of a blog", () => {
    test("a blog can be deleted", async () => {
      const blogsAtStart = await helper.blogsInDb();
      const blogToDelete = blogsAtStart[0];

      await api
        .delete(`/api/blogs/${blogToDelete.id}`)
        .set("Authorization", `Bearer ${token}`)
        .expect(204);

      const blogsAtEnd = await helper.blogsInDb();

      assert.strictEqual(blogsAtEnd.length, helper.initialBlogs.length - 1);

      const contents = blogsAtEnd.map((blog) => blog.title);
      assert(!contents.includes(blogToDelete.title));
    });

    test("deletion of invalid blog does not succeed", async () => {
      const invalidBlogId = "5hsfkf99393ksf";

      await api
        .delete(`/api/blogs/${invalidBlogId}`)
        .set("Authorization", `Bearer ${token}`)
        .expect(400);
    });
  });

  describe("updating a blog", () => {
    test("updating information of an individual blog post", async () => {
      const blogsAtStart = await helper.blogsInDb();

      const blogToUpdate = blogsAtStart[0];

      const updatedBlog = {
        title: blogToUpdate.title,
        author: blogToUpdate.author,
        url: blogToUpdate.url,
        likes: 12345,
      };

      await api
        .put(`/api/blogs/${blogToUpdate.id}`)
        .send(updatedBlog)
        .expect(200)
        .expect("Content-Type", /application\/json/);

      const blogsAtEnd = await helper.blogsInDb();

      assert.strictEqual(blogsAtEnd.length, helper.initialBlogs.length);

      const likesAtStart = blogsAtStart.map((blog) => blog.likes);
      const likesAtEnd = blogsAtEnd.map((blog) => blog.likes);

      assert(!likesAtEnd.includes(likesAtStart));
    });
  });
});

describe("when there is initially one user in db", () => {
  beforeEach(async () => {
    await User.deleteMany({});

    const passwordHash = await bcrypt.hash("sekret", 10);
    const user = new User({ username: "root", passwordHash });

    await user.save();
  });

  test("creation succeeds with a fresh username", async () => {
    const usersAtStart = await helper.usersInDb();

    const newUser = {
      username: "mluukkai",
      name: "Matti Luukkainen",
      password: "salainen",
    };

    await api
      .post("/api/users")
      .send(newUser)
      .expect(201)
      .expect("Content-Type", /application\/json/);

    const usersAtEnd = await helper.usersInDb();
    assert.strictEqual(usersAtEnd.length, usersAtStart.length + 1);

    const usernames = usersAtEnd.map((u) => u.username);
    assert(usernames.includes(newUser.username));
  });

  test("creation fails with proper statuscode and message if username already taken", async () => {
    const usersAtStart = await helper.usersInDb();

    const newUser = {
      username: "root",
      name: "Superuser",
      password: "salainen",
    };

    const result = await api
      .post("/api/users")
      .send(newUser)
      .expect(400)
      .expect("Content-Type", /application\/json/);

    const usersAtEnd = await helper.usersInDb();
    assert(result.body.error.includes("expected `username` to be unique"));

    assert.strictEqual(usersAtEnd.length, usersAtStart.length);
  });

  test("creation fails with proper statuscode and message if username not given", async () => {
    const usersAtStart = await helper.usersInDb();

    const newUser = {
      name: "Superuser",
      password: "salainen",
    };

    const result = await api
      .post("/api/users")
      .send(newUser)
      .expect(400)
      .expect("Content-Type", /application\/json/);

    const usersAtEnd = await helper.usersInDb();
    assert(result.body.error.includes("username and password must be given"));

    assert.strictEqual(usersAtEnd.length, usersAtStart.length);
  });

  test("creation fails with proper statuscode and message if password not given", async () => {
    const usersAtStart = await helper.usersInDb();

    const newUser = {
      username: "example",
      name: "X Ample",
    };

    const result = await api
      .post("/api/users")
      .send(newUser)
      .expect(400)
      .expect("Content-Type", /application\/json/);

    const usersAtEnd = await helper.usersInDb();
    assert(result.body.error.includes("username and password must be given"));

    assert.strictEqual(usersAtEnd.length, usersAtStart.length);
  });

  test("creation fails with proper statuscode and message if username not at least 3 characters long", async () => {
    const usersAtStart = await helper.usersInDb();

    const newUser = {
      username: "ex",
      name: "X Ample",
      password: "password",
    };

    const result = await api
      .post("/api/users")
      .send(newUser)
      .expect(400)
      .expect("Content-Type", /application\/json/);

    const usersAtEnd = await helper.usersInDb();
    assert(
      result.body.error.includes("username must be at least 3 characters long"),
    );

    assert.strictEqual(usersAtEnd.length, usersAtStart.length);
  });

  test("creation fails with proper statuscode and message if password not at least 3 characters long", async () => {
    const usersAtStart = await helper.usersInDb();

    const newUser = {
      username: "example",
      name: "X Ample",
      password: "pa",
    };

    const result = await api
      .post("/api/users")
      .send(newUser)
      .expect(400)
      .expect("Content-Type", /application\/json/);

    const usersAtEnd = await helper.usersInDb();
    assert(
      result.body.error.includes("password must be at least 3 characters long"),
    );

    assert.strictEqual(usersAtEnd.length, usersAtStart.length);
  });
});

after(async () => {
  await mongoose.connection.close();
});
