const timeDifference = (current, previous) => {
  var msPerMinute = 60 * 1000
  var msPerHour = msPerMinute * 60
  var msPerDay = msPerHour * 24
  var msPerMonth = msPerDay * 30
  var msPerYear = msPerDay * 365

  var elapsed = new Date(current) - new Date(previous)
  console.log(elapsed)
  console.log(current + ' asc ' + previous)
  if (elapsed < msPerMinute) {
    return Math.round(elapsed / 1000)
  } else if (elapsed < msPerHour) {
    return Math.round(elapsed / msPerMinute)
  } else if (elapsed < msPerDay) {
    return Math.round(elapsed / msPerHour)
  } else if (elapsed < msPerMonth) {
    return Math.round(elapsed / msPerDay)
  } else if (elapsed < msPerYear) {
    return Math.round(elapsed / msPerMonth)
  } else {
    return Math.round(elapsed / msPerYear)
  }
}

module.exports = {
  timeDifference: timeDifference
}
