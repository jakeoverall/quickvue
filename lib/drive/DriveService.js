import { UTILS } from '../utils'
import { reactive, ref } from '@vue/reactivity'
import { computed } from '@vue/runtime-core'
import { FileReaderHandler } from '../FileReaderHandler'
import { fileIcons } from './FileIcons'
import { createBlobFromUrl, saveAs, zipFiles } from './ZipService'
import { Logger } from '../monitoring/Logger'

export const selectedFiles = ref({})

const contents = ref([])
class CloudFile {
  constructor(file) {
    this.path = file.name
    this.directory = file.name.slice(0, file.name.lastIndexOf('/') + 1)
    this.name = file.name.slice(file.name.lastIndexOf('/') + 1)
    this.extension = file.name.slice(file.name.lastIndexOf('.') + 1)
    this.length = file.contentLength || 0
    this.sizeMb = Number(((file.contentLength || 0) / 1048576).toFixed(1))
    this.createdAt = file.creationTime || ''
    this.updatedAt = file.creationTime || ''
    this.url = file.url || ''
    this.type = file.contentSettings ? file.contentSettings.contentType : 'text/raw'
    this.icon = fileIcons[this.extension] || 'mdi-file-document'
    this.raw = file
  }
}

export const drive = reactive({
  contents,
  structure: computed(() => {
    const structure = { }
    buildStructure(structure)
    graphFolders(structure)
    return structure
  })
})

function buildStructure(structure) {
  contents.value.forEach(f => {
    const dirs = f.directory.split('/')
    dirs.forEach(d => {
      const i = f.directory.indexOf(d)
      if (i === -1 || i === 0) { return }
      const key = f.directory.slice(0, i + d.length + 1)
      if (!key) { return }
      structure[key] = structure[key] || {
        path: key,
        name: d,
        files: [],
        folders: [],
        icon: 'mdi-folder',
        type: 'directory'
      }
    })
    structure[f.directory] = structure[f.directory] || {
      path: f.directory,
      name: f.directory,
      files: [],
      folders: [],
      icon: 'mdi-folder',
      type: 'directory'
    }
    structure[f.directory].files.push(f)
  })
}

function graphFolders(structure) {
  Object.keys(structure).forEach(key => {
    structure[key].sizeMb = structure[key].files.reduce((acc, f) => acc + f.sizeMb, 0)
    Object.keys(structure)
      .filter(k => k.includes(key))
      .filter(k => {
        const dirs = k.split('/')
        const last = dirs.pop() // remove blank or last
        if (!last) {
          dirs.pop() // remove last
        }
        const current = dirs.join('/') + '/'
        return current === key
      })
      .map(k => {
        return structure[key].folders.push(structure[k])
      })
  })
}

export function getEmailRoot(email) {
  const i = email.indexOf('@')
  const p1 = email.slice(0, i)
  const p2 = Buffer.from(email.slice(i)).toString('base64')
  return `${p1}__${p2}/`
}

let _api = {
  async get(url) { return [] },
  async post(url, body) {},
  async put(url, body) {},
  async delete(url) {}
}

export class DriveService {
  static set api(api) {
    _api = api
  }

  static get api() {
    return _api
  }

  static async getFiles() {
    const res = await DriveService.api.get('media')
    if (Array.isArray(res)) {
      contents.value = res.map(f => new CloudFile(f))
    }
  }

  static async addFile(folder, file) {
    const payload = {
      ...file,
      base64: file.preview,
      path: folder.path,
      filename: file.file.name
    }
    return await DriveService.api.post('media', payload)
  }

  static async processFiles(files) {
    return await Promise.all(files.map(async file => {
      try {
        if (file.type.includes('image')) {
          file = await FileReaderHandler.compressFile(file)
        }
        const preview = await FileReaderHandler.getBase64FromFile(file)
        return { file, preview }
      } catch (e) {
        Logger.error('PROCESSING FILE ERROR', e)
      } finally {
        Promise.resolve()
      }
    }))
  }

  static async addFiles(folder, files) {
    await Promise.all(
      files.map((file) => DriveService.addFile(folder, file))
    )
    await this.getFiles()
  }

  static async removeFiles(files) {
    const yes = await UTILS.$confirm(`Remove ${files.length} Files`)
    if (!yes) { return }
    await Promise.all(files.map(file => this.removeFile(file)))
    this.getFiles()
  }

  static async removeFile(file) {
    return await DriveService.api.post('media/remove/file', {
      filename: file.path
    })
  }

  static generateZip(files, zipname) {
    return zipFiles(files, zipname)
  }

  static async saveFile(file) {
    const blob = await createBlobFromUrl(file.url, file.type)
    saveAs(blob, file.name)
  }

  static async moveFiles(to) {
    const files = Object.values(selectedFiles.value).map(f => {
      return {
        ...f,
        to
      }
    })
    await DriveService.api.post('media/move-files', files)
    selectedFiles.value = {}
    await this.getFiles()
  }
}
