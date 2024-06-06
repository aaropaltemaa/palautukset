const dummy = (blogs) => {
    if (blogs) {
      return 1
    }
  }
  
  module.exports = {
    dummy
  }


const totalLikes = (blogs) => blogs.reduce(
    (sum, blog) => sum + blog.likes, 0)

module.exports = {
  totalLikes
}

const favoriteBlog = (blogs) => {
  const maxLikes = Math.max(...blogs.map(b => b.likes))
  const favorite = blogs.find(blog => blog.likes === maxLikes)
  return favorite
}

module.exports = {
  favoriteBlog
}