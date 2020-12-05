// Copyright (c) 2020 Thomas J. Otterson
// 
// This software is released under the MIT License.
// https://opensource.org/licenses/MIT

const elementCount = 1500

let ctx;
let radius;
let width;
let height;

const array = []

function getDisparity(num, index, size = elementCount) {
  const max = size / 2
  const d = Math.abs(index - num)
  return d > max ? size - d : d
}

function getColor(num, size = elementCount) {
  return `hsl(${Math.floor(num * 360 / size)}, 100%, 50%)`
}

function getLocation(value, index, max = elementCount / 2) {
  const disparity = getDisparity(value, index)
  const distance = (max - disparity) * radius / max
  const angle = index / max * Math.PI
  const x = Math.floor(distance * Math.cos(angle))
  const y = Math.floor(distance * Math.sin(angle))
  return { x, y }
}

function draw(array) {
  ctx.clearRect(-width / 2, -height / 2, width, height)
  for (const [index, value] of array.entries()) {
    const { x, y } = getLocation(value, index)
    const color = getColor(value)
    ctx.fillStyle = color
    ctx.fillRect(x, y, 1, 1)
  }
}

function init(array) {
  const canvas = document.getElementById('canvas')
  width = canvas.width
  height = canvas.height
  ctx = canvas.getContext('2d')

  ctx.clearRect(0, 0, width, height)
  ctx.translate(width / 2, height / 2)

  radius = Math.min(height, width) * 0.95 / 2
}

function initArray(array, ppf = 10) {
  let i = 0

  return new Promise(resolve => {
    requestAnimationFrame(function update(time) {
      for (let j = 0; j < ppf; j++) {
        array[i] = i++
        if (i >= elementCount) break
      }
      draw(array)

      if (i < elementCount) {
        requestAnimationFrame(update)
      } else {
        resolve()
      }
    })
  })
}

function shuffle(array, ppf = 10) {
  let i = array.length - 1

  return new Promise(resolve => {
    requestAnimationFrame(function update(time) {
      for (let x = 0; x < ppf; x++) {
        const j = Math.floor(Math.random() * (i + 1))
        const temp = array[i]
        array[i] = array[j]
        array[j] = temp
        i--
        if (i <= 0) break
      }
      draw(array)

      if (i > 0) {
        requestAnimationFrame(update)
      } else {
        resolve()
      }
    })
  })
}

function bubbleSort(array, ppf = 10) {
  let len = array.length
  let i = 0
  let j = 0
  let noswaps = true
  let running = true

  return new Promise(resolve => {
    requestAnimationFrame(function update(time) {
      for (let x = 0; x < ppf; x++) {
        if (array[j] > array[j + 1]) {
          [array[j + 1], array[j]] = [array[j], array[j + 1]]
          noswaps = false
        }
        j++

        if (j >= len) {
          if (noswaps) running = false
          noswaps = true
          j = 0
          i++
        }
        if (i >= len) break
      }
      draw(array)

      if (!running || i >= len) {
        resolve()
      } else {
        requestAnimationFrame(update)
      }
    })
  })
}

function insertionSort(array, ppf = 10) {
  let i = 1
  let j = 0

  return new Promise(resolve => {
    requestAnimationFrame(function update(time) {
      for (x = 0; x < ppf; x++) {
        if (array[j + 1] < array[j]) {
          [array[j + 1], array[j]] = [array[j], array[j + 1]]
        }
        j--

        if (j <= -1) {
          i++
          if (i >= array.length) break
          j = i - 1
        }
      }
      draw(array)

      if (i < array.length) {
        requestAnimationFrame(update)
      } else {
        resolve()
      }
    })
  })
}

function selectionSort(array, ppf = 10) {
  let i = 0
  let j = 1
  let min = 0

  return new Promise(resolve => {
    requestAnimationFrame(function update(time) {
      for (let x = 0; x < ppf; x++) {
        if (array[j] < array[min]) min = j
        j++

        if (j >= array.length) {
          if (min !== i) {
            [array[i], array[min]] = [array[min], array[i]]
          }
          i++

          if (i >= array.length) break
          min = i
          j = i + 1
        }
      }
      draw(array)

      if (i < array.length) {
        requestAnimationFrame(update)
      } else {
        resolve()
      }
    })
  })
}

init()
initArray(array, 10)
  .then(() => shuffle(array, 10))
  .then(() => bubbleSort(array, 1000))
  .then(() => shuffle(array, 10))
  .then(() => insertionSort(array, 1000))
  .then(() => shuffle(array, 10))
  .then(() => selectionSort(array, 1000))
