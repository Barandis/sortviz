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

function pause(delay) {
  return new Promise(resolve => {
    setTimeout(resolve, delay)
  })
}

function initCanvas() {
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

function merge(array, start, mid, end, ppf) {
  let start2 = mid + 1

  return new Promise(resolve => {
    if (array[mid] <= array[start2]) {
      resolve()
    } else {
      requestAnimationFrame(function update(time) {
        for (let x = 0; x < ppf; x++) {
          if (start > mid || start2 > end) break

          if (array[start] <= array[start2]) {
            start++
          } else {
            const value = array[start2]
            let i = start2

            while (i !== start) {
              array[i] = array[i - 1]
              i--
            }
            array[start] = value

            start++
            mid++
            start2++
          }
        }
        draw(array)

        if (start > mid || start2 > end) {
          resolve()
        } else {
          requestAnimationFrame(update)
        }
      })
    }
  })
}

function mergeSort(array, ppf = 10, left = 0, right = array.length - 1) {
  if (left < right) {
    const mid = left + Math.floor((right - left) / 2)
    return mergeSort(array, ppf, left, mid)
      .then(() => mergeSort(array, ppf, mid + 1, right))
      .then(() => merge(array, left, mid, right, ppf))
  }
  return Promise.resolve()
}

function partition(array, start, end, ppf) {
  let pivot = array[start]
  let swap = start
  let i = start + 1

  return new Promise(resolve => {
    requestAnimationFrame(function update(time) {
      for (let x = 0; x < ppf; x++) {
        if (array[i] < pivot) {
          swap++
          [array[i], array[swap]] = [array[swap], array[i]]
        }
        i++

        if (i > end) break
      }
      draw(array)
  
      if (i <= end) {
        requestAnimationFrame(update)
      } else {
        [array[swap], array[start]] = [array[start], array[swap]]
        resolve(swap)
      }
    })
  })
}

function quickSort(array, ppf = 10, left = 0, right = array.length - 1) {
  if (left < right) {
    const pa = partition(array, left, right, ppf)
    const pb = pa.then(pivot => quickSort(array, ppf, left, pivot - 1))
    return Promise.all([pa, pb]).then(([pivot, _]) => quickSort(array, ppf, pivot + 1, right))
  }
  return Promise.resolve()
}

initCanvas()
initArray(array, 10)
  .then(() => shuffle(array, 10))
  .then(() => bubbleSort(array, 1500))
  .then(() => pause(2000))
  .then(() => shuffle(array, 10))
  .then(() => insertionSort(array, 1000))
  .then(() => pause(2000))
  .then(() => shuffle(array, 10))
  .then(() => selectionSort(array, 1000))
  .then(() => pause(2000))
  .then(() => shuffle(array, 10))
  .then(() => mergeSort(array, 10))
  .then(() => pause(2000))
  .then(() => shuffle(array, 10))
  .then(() => quickSort(array, 10))
