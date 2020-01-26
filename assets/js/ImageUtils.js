import CryptoJS from 'crypto-js'
import ImageTools from '~/assets/js/ImageTools.js'

export default class ImageUtils {
  constructor () {
    this.imageTools = new ImageTools()
  }

  readChunked = (file, chunkCallback, endCallback) => {
    const fileSize = file.size
    const chunkSize = 4 * 1024 * 1024 // 4MB
    let offset = 0

    const reader = new FileReader()

    reader.onload = function () {
      if (reader.error) {
        endCallback(reader.error || {})
        return
      }

      offset += reader.result.length

      // callback for handling read chunk
      // TODO: handle errors
      chunkCallback(reader.result, offset, fileSize)
      if (offset >= fileSize) {
        endCallback(null)
        return
      }

      readNext()
    }

    reader.onerror = function (err) {
      endCallback(err || {})
    }

    function readNext () {
      const fileSlice = file.slice(offset, offset + chunkSize)
      reader.readAsBinaryString(fileSlice)
    }

    readNext()
  }

  dataURLtoBlob = (dataURL) => {
    const BASE64_MARKER = ';base64,'
    if (!dataURL.includes(BASE64_MARKER)) {
      const parts = dataURL.split(',')
      const contentType = parts[0].split(':')[1]
      const raw = decodeURIComponent(parts[1])

      return new Blob([raw], {
        type: contentType
      })
    }
    const parts = dataURL.split(BASE64_MARKER)
    const contentType = parts[0].split(':')[1]
    const raw = window.atob(parts[1])
    const rawLength = raw.length
    const uInt8Array = new Uint8Array(rawLength)
    for (let i = 0; i < rawLength; ++i) {
      uInt8Array[i] = raw.charCodeAt(i)
    }

    return new Blob([uInt8Array], {
      type: contentType
    })
  }

  getMD5 = (blob, cbProgress) => new Promise((resolve, reject) => {
    const md5 = CryptoJS.algo.MD5.create()
    this.readChunked(blob, (chunk, offs, total) => {
      md5.update(CryptoJS.enc.Latin1.parse(chunk))
      if (cbProgress) {
        cbProgress(offs / total)
      }
    }, (err) => {
      if (err) {
        reject(err)
      } else {
        // TODO: Handle errors
        const hash = md5.finalize()
        const hashHex = hash.toString(CryptoJS.enc.Hex)
        resolve(hashHex)
      }
    })
  })

  createArray = (length, ...args) => {
    const arr = new Array(length || 0)
    let i = length

    if (args.length > 0) {
      while (i--) { arr[length - 1 - i] = this.createArray(...args) }
    }

    return arr
  }

  // https://github.com/jenssegers/imagehash/blob/master/src/Implementations/DifferenceHash.php
  // https://stackoverflow.com/questions/45297649/js-how-to-check-if-2-images-their-hash-are-similar
  getBinPhash = (imageObj) => {
    const canvas = document.createElement('canvas')
    const context = canvas.getContext('2d')
    const imageWidth = imageObj.width
    const imageHeight = imageObj.height
    context.drawImage(imageObj, 0, 0)
    const imageData = context.getImageData(0, 0, imageWidth, imageHeight)

    const pixels = this.createArray(imageHeight, imageWidth)
    const hash = []

    for (let i = 0; i < imageData.data.length; i += 4) {
      const j = (i === 0) ? 0 : i / 4
      const x = j % imageWidth
      const y = Math.floor((j / imageWidth) % imageHeight)

      const r = imageData.data[i]
      const g = imageData.data[i + 1]
      const b = imageData.data[i + 2]

      const gs = Math.floor((r * 0.299) + (g * 0.587) + (b * 0.114))
      pixels[y][x] = gs
    }

    for (let y = 0; y < imageHeight; y++) {
      let left = pixels[y][0]

      for (let x = 1; x < imageWidth; x++) {
        const right = pixels[y][x]

        hash.push(left > right ? 1 : 0)

        // Prepare the next loop.
        left = right
      }
    }

    return hash.join('')
  }

  getPHash = file => new Promise(async (resolve) => {
    const resizedFile = await this.imageTools.resizeIgnoreAspect(file, { width: 9, height: 8 })

    const imageObj = new Image()
    imageObj.addEventListener('load', () => {
      const phash = parseInt(this.getBinPhash(imageObj), 2)

      urlCreator.revokeObjectURL(imageUrl)

      resolve(phash)
    }, false)

    const urlCreator = window.URL || window.webkitURL
    const imageUrl = urlCreator.createObjectURL(resizedFile)
    imageObj.src = imageUrl
  })
}
