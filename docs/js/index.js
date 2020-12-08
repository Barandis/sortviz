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
  ctx.rotate(-Math.PI / 2)

  radius = Math.min(height, width) * 0.95 / 2
}

function execute(genFn, array, epf ) {
  const gen = genFn(array, epf)

  return new Promise(resolve => {
    requestAnimationFrame(function update(time) {
      const value = gen.next()
      draw(array)

      if (value.done) { 
        resolve() 
      } else {
        requestAnimationFrame(update)
      }
    })
  })
}

function *initArray(array, epf = 10) {
  let e = 0
  for (let i = 0; i < elementCount; i++) {
    array[i] = i

    if (++e >= epf) {
      e = 0
      yield i
    }
  }
}

function *shuffle(array, epf = 10) {
  let e = 0
  for (let i = array.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1))
    const temp = array[i]
    array[i] = array[j]
    array[j] = temp

    if (++e >= epf) {
      e = 0
      yield i
    }
  }
}

function *bubbleSort(array, epf = 10) {
  const len = array.length
  let e = 0

  for (let i = 0; i < len; i++) {
    for (let j = 0; j < len - i - 1; j++) {
      if (array[j] > array[j + 1]) {
        [array[j], array[j + 1]] = [array[j + 1], array[j]]
      }

      if (++e >= epf) {
        e = 0
        yield i
      }
    }
  }
}

function *insertionSort(array, epf = 10) {
  const len = array.length
  let e = 0

  for (let i = 0; i < len; i++) {
    const key = array[i]
    let j = i - 1

    while (j >= 0 && key < array[j]) {
      array[j + 1] = array[j]
      j -= 1

      if (++e >= epf) {
        e = 0
        yield i
      }
    }
    array[j + 1] = key
  }
}

function *selectionSort(array, epf = 10) {
  const len = array.length
  let e = 0

  for (let i = 0; i < len; i++) {
    let min = i
    for (let j = i + 1; j < len; j++) {
      if (array[min] > array[j]) min = j

      if (++e >= epf) {
        e = 0
        yield i
      }
    }
    [array[i], array[min]] = [array[min], array[i]]
  }
}

function *merge(array, start, mid, end, epf) {
  let e = 0
  let start2 = mid + 1

  if (array[mid] <= array[start2]) return

  while (start<= mid && start2 <= end) {
    if (array[start] <= array[start2]) {
      start++
    } else {
      const value = array[start2]
      let i = start2

      while (i !== start) {
        array[i] = array[i - 1]
        i--
      }

      if (++e >= epf) {
        e = 0
        yield i
      }

      array[start] = value

      if (++e >= epf) {
        e = 0
        yield i
      }

      start++
      mid++
      start2++
    }
  }
}

function *mergeSort(array, epf = 10, left = 0, right = array.length - 1) {
  if (left < right) {
    const mid = left + Math.floor((right - left) / 2)

    yield *mergeSort(array, epf, left, mid)
    yield *mergeSort(array, epf, mid + 1, right)

    yield *merge(array, left, mid, right, epf)
  }
}

function *partition(array, left, right, epf) {
  let pivot = array[right]
  let i = left - 1
  let e = 0

  for (let j = left; j < right; j++) {
    if (array[j] < pivot) {
      i++
      [array[i], array[j]] = [array[j], array[i]]
    }
    if (++e >= epf) {
      e = 0
      yield i
    }
  }
  [array[i + 1], array[right]] = [array[right], array[i + 1]]
  return i + 1
}

function *quickSort(array, epf = 10, left = 0, right = array.length - 1) {
  if (left < right) {
    const i = yield *partition(array, left, right, epf)
    yield *quickSort(array, epf, left, i - 1)
    yield *quickSort(array, epf, i + 1, right)
  }
}

initCanvas()
execute(initArray, array, 10)
  .then(() => execute(shuffle, array, 10))
  .then(() => execute(bubbleSort, array, 1500))
  .then(() => pause(2000))
  .then(() => execute(shuffle, array, 10))
  .then(() => execute(insertionSort, array, 750))
  .then(() => pause(2000))
  .then(() => execute(shuffle, array, 10))
  .then(() => execute(selectionSort, array, 1250))
  .then(() => pause(2000))
  .then(() => execute(shuffle, array, 10))
  .then(() => execute(mergeSort, array, 10))
  .then(() => pause(2000))
  .then(() => execute(shuffle, array, 10))
  .then(() => execute(quickSort, array, 10))
