module.exports = (seconds) => {
  return new Promise((resolve, reject) => {
    setTimeout(() => {
      resolve()
    }, 1000 * seconds)
  })
}