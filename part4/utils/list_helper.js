const _ = require('lodash')

const dummy = (blogs) => {
  return 1
}

const totalLikes = (blogs) => {
  const reducer = (sum, likes) => {
    return sum + likes
  }

  const blogLikes = blogs.map(blogs => blogs.likes)

  return blogs.length === 0 
  ? 0
  : blogLikes.reduce(reducer, 0)
}


const favoriteBlog = (blogs) => {
  const favBlog = blogs.reduce((mostLiked, currentBlog) => {
    return currentBlog.likes > mostLiked.likes ? currentBlog : mostLiked
  })
  return {
    title: favBlog.title,
    author: favBlog.author,
    likes: favBlog.likes,
  }
}

const mostBlogs = (blogs) => {
  const blogCount = _.countBy(blogs, 'author')

  const authorWithMostBlogs = _.maxBy(
    _.keys(blogCount), author => blogCount[author])

  return {
    author: authorWithMostBlogs,
    blogs: blogCount[authorWithMostBlogs]
  }
}

const mostLikes = (blogs) => {
  const authorsGrouped = _.groupBy(blogs, 'author')

  const likesByAuthor = _.mapValues(
    authorsGrouped, likes => _.sumBy(likes, 'likes'))

  const mostLikedAuthor = _.maxBy(
    _.keys(likesByAuthor), author => likesByAuthor[author])

  return {
    author: mostLikedAuthor,
    likes: likesByAuthor[mostLikedAuthor]
  }
}


module.exports = {
  dummy,
  totalLikes,
  favoriteBlog,
  mostBlogs,
  mostLikes
}


