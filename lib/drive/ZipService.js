const JSZip = require('jszip')

export async function zipFiles(files, filename) {
  const zip = new JSZip()
  const name = filename + '.zip'
  const blobs = await Promise.all(files.map(async f => {
    const blob = await createBlobFromUrl(f.url, f.type)
    return { blob, file: f }
  }))

  blobs.forEach(b => {
    const fname = b.file.name || `file_${~~(Math.random() * 99999)}.${b.file.extension || 'raw'}`
    zip.file(fname, b.blob, {
      binary: true
    })
  })

  const content = await zip.generateAsync({
    type: 'blob'
  })
  saveAs(content, name)
}
function getBinaryContent(path, callback, progress) {
  try {
    const xhr = new window.XMLHttpRequest()

    xhr.open('GET', path, true)

    // recent browsers
    if ('responseType' in xhr) {
      xhr.responseType = 'arraybuffer'
    }

    // older browser
    if (xhr.overrideMimeType) {
      xhr.overrideMimeType('text/plain; charset=x-user-defined')
    }

    xhr.onreadystatechange = function(evt) {
      let file, err
      // use `xhr` and not `this`... thanks IE
      if (xhr.readyState === 4) {
        if (xhr.status === 200 || xhr.status === 0) {
          file = null
          err = null
          try {
            file = xhr.response || xhr.responseText
          } catch (e) {
            err = new Error(e)
          }
          callback(err, file)
        } else {
          callback(new Error('Ajax error for ' + path + ' : ' + this.status + ' ' + this.statusText), null)
        }
      }
    }
    if (progress) xhr.onprogress = progress
    xhr.send()

    return xhr
  } catch (e) {
    callback(new Error(e), null)
  }
};

export function createBlobFromUrl(url, type) {
  const promise = new Promise((resolve, reject) => {
    getBinaryContent(url, (err, data) => {
      if (err) {
        return reject(err)
      }
      resolve(new Blob([data], { type }))
    }, function(e) {
      promise.progress[e.target.responseURL] = e
      let total = 0; let prog = 0
      for (const prop in promise.progress) {
        total += Number(promise.progress[prop].total) || 0
        prog += Number(promise.progress[prop].loaded) || 0
      }
      // console.log(prog / total)
      promise.progress.percentage = prog / total
    })
  })
  promise.progress = {}
  return promise
}

export function saveAs(blob, name) {
  const a = document.createElement('a')
  name = name || blob.name || 'download'
  a.download = name
  a.rel = 'noopener'
  a.href = URL.createObjectURL(blob)
  document.body.appendChild(a)
  a.click()
  setTimeout(function() {
    URL.revokeObjectURL(a.href)
    a.remove()
  }, 4E4 * 4E4) // 40s * 40s
}
