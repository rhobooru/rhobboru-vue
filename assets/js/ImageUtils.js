import ImageTools from '~/assets/js/ImageTools.js'
import CryptoJS from 'crypto-js'

export default class ImageUtils {

  constructor(){
    this.imageTools = new ImageTools();
  }

  readChunked = (file, chunkCallback, endCallback) => {
    var fileSize   = file.size
    var chunkSize  = 4 * 1024 * 1024 // 4MB
    var offset     = 0
    
    var reader = new FileReader()

    reader.onload = function() {
      if (reader.error) {
        endCallback(reader.error || {})
        return
      }

      offset += reader.result.length

      // callback for handling read chunk
      // TODO: handle errors
      chunkCallback(reader.result, offset, fileSize); 
      if (offset >= fileSize) {
        endCallback(null)
        return
      }

      readNext()
    };

    reader.onerror = function(err) {
      endCallback(err || {})
    };

    function readNext() {
      var fileSlice = file.slice(offset, offset + chunkSize)
      reader.readAsBinaryString(fileSlice)
    }

    readNext()
  }

  dataURLtoBlob = (dataURL) => {
    var BASE64_MARKER = ';base64,'
    if (dataURL.indexOf(BASE64_MARKER) == -1) {
      var parts = dataURL.split(',')
      var contentType = parts[0].split(':')[1]
      var raw = decodeURIComponent(parts[1])

      return new Blob([raw], {
        type: contentType
      });
    }
    var parts = dataURL.split(BASE64_MARKER)
    var contentType = parts[0].split(':')[1]
    var raw = window.atob(parts[1])
    var rawLength = raw.length
    var uInt8Array = new Uint8Array(rawLength)
    for (var i = 0; i < rawLength; ++i) {
      uInt8Array[i] = raw.charCodeAt(i)
    }

    return new Blob([uInt8Array], {
      type: contentType
    })
  }

  getMD5 = (blob, cbProgress) => new Promise((resolve, reject) => {
    var md5 = CryptoJS.algo.MD5.create()
    this.readChunked(blob, (chunk, offs, total) => {
      md5.update(CryptoJS.enc.Latin1.parse(chunk))
      if (cbProgress) {
        cbProgress(offs / total)
      }
    }, err => {
      if (err) {
        reject(err)
      } else {
        // TODO: Handle errors
        var hash = md5.finalize()
        var hashHex = hash.toString(CryptoJS.enc.Hex)
        resolve(hashHex)
      }
    })
  })

  createArray = (length, ...args) => {
    var arr = new Array(length || 0),
      i = length;

    if (args.length > 0) {
      while(i--) arr[length-1 - i] = this.createArray(...args);
    }

    return arr;
  }

  // https://github.com/jenssegers/imagehash/blob/master/src/Implementations/DifferenceHash.php
  // https://stackoverflow.com/questions/45297649/js-how-to-check-if-2-images-their-hash-are-similar
  getBinPhash = (imageObj) => {
    let canvas = document.createElement('canvas')
    let context = canvas.getContext('2d')
    const imageWidth = imageObj.width
    const imageHeight = imageObj.height
    context.drawImage(imageObj, 0, 0)
    var imageData = context.getImageData(0, 0, imageWidth, imageHeight)

    var pixels = this.createArray(imageHeight, imageWidth)
    var hash = []
    
    for (var i=0;i<imageData.data.length;i+=4){
        var j = (i==0) ? 0 : i/4
        var x = j % imageWidth
        var y = Math.floor((j / imageWidth) % imageHeight)
        
        var r = imageData.data[i]
        var g = imageData.data[i+1]
        var b = imageData.data[i+2]

        var gs = Math.floor((r*0.299)+(g*0.587)+(b*0.114))
        pixels[y][x] = gs
    }


    for (let y = 0; y < imageHeight; y++){
      var left = pixels[y][0]

      for (let x = 1; x < imageWidth; x++) {
        var right = pixels[y][x]

        hash.push(left > right ? 1 : 0)

        // Prepare the next loop.
        left = right
      }
    }

    return hash.join('')
  }

  getPHash = (file) => new Promise(async (resolve) => {
    let resizedFile = await this.imageTools.resizeIgnoreAspect(file, { width: 9, height: 8 })

    var imageObj = new Image()
    imageObj.addEventListener('load', () => {
      const phash = parseInt(this.getBinPhash(imageObj), 2)
      
      urlCreator.revokeObjectURL(imageUrl)

      resolve(phash)
    }, false);

    var urlCreator = window.URL || window.webkitURL;
    var imageUrl = urlCreator.createObjectURL(resizedFile);
    imageObj.src = imageUrl
  })
}