const crypto = require('crypto')
const fs = require('fs')

/* const BUFFER_SIZE = 8192

function md5FileSync (path) {
  const fd = fs.openSync(path, 'r')
  const hash = crypto.createHash('md5')
  const buffer = Buffer.alloc(BUFFER_SIZE)

  try {
    let bytesRead

    do {
      bytesRead = fs.readSync(fd, buffer, 0, BUFFER_SIZE)
      hash.update(buffer.slice(0, bytesRead))
    } while (bytesRead === BUFFER_SIZE)
  } finally {
    fs.closeSync(fd)
  }

  return hash.digest('hex')
}
module.exports.sync = md5FileSync
*/

function md5File (path,file) {
    return new Promise((resolve, reject) => {
        const output = crypto.createHash('md5')
        const input  = fs.createReadStream(path+file)

        input.on('error', (err) => {
          reject(err)
        })
        output.once('readable', () => {
          let hex_obj = {
              hexkey: output.read().toString('hex'), 
              path: path, 
              file: file};
          resolve(hex_obj)
        })
        input.pipe(output)
    })
}
module.exports = md5File;
