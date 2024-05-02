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



module.exports = {
  dummy,
  totalLikes,
  favoriteBlog
}


