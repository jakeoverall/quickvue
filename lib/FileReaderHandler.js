import imageCompression from 'browser-image-compression'

export class FileReaderHandler {
  static async getBase64FromFile(file) {
    const reader = new FileReader()
    reader.readAsDataURL(file)
    await FileReaderHandler.WaitForResult(reader)
    return reader.result
  }

  static getFileFromBase64(base64) {
    const BASE64_MARKER = ';base64,'
    const parts = base64.split(BASE64_MARKER)
    const contentType = parts[0].split(':')[1]
    const raw = window.atob(parts[1])
    const rawLength = raw.length
    const uInt8Array = new Uint8Array(rawLength)

    for (let i = 0; i < rawLength; ++i) {
      uInt8Array[i] = raw.charCodeAt(i)
    }

    return new Blob([uInt8Array], { type: contentType })
  }

  static async compressFile(file, options = {
    maxSizeMB: 0.5,
    maxWidthOrHeight: 1920,
    useWebWorker: true
  }) {
    return await imageCompression(file, options)
  }

  static async compressBase64(base64) {
    const file = this.getFileFromBase64(base64)
    const compressed = await this.compressFile(file)
    return await this.getBase64FromFile(compressed)
  }

  static async WaitForResult(reader) {
    if (!(reader instanceof FileReader)) {
      throw new Error('You must pass an instance of a file reader')
    }
    return new Promise((resolve, reject) => {
      reader.onload = function() { resolve() }
      // eslint-disable-next-line prefer-promise-reject-errors
      reader.onerror = function() { reject() }
    })
  }
}
