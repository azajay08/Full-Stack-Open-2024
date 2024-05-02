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




module.exports = {
  dummy,
  totalLikes
}

