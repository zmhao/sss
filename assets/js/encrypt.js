// 校验字符串是否包含中文
import storages from '../../views/cache/cache'
import globals from '../../views/common/global'

export function encryptGetKey (callback) {
  cordova.plugins.encryption.getSecretKey([], function (result) {
    let data = JSON.parse(result)
    if (data.code === 0) {
      var dd = JSON.parse(JSON.stringify(data.data))
      dd = JSON.parse(dd)
      self.form.private_keys = dd.private_key
      self.form.public_keys = dd.public_key
      storages.set(globals.PRIVATE_KEY, self.form.private_keys)
      storages.set(globals.PUBLIC_KEY, self.form.public_keys)
      callback()
    } else {
      callback(new Error(data.msg))
    }
  })
}
export function encryptData (data, callback) {
  coedova.plugins.encryptData.rsaEncrypt([data, storages.get(globals.PRIVATE_KEY)], function (result) {
    let data = JSON.parse(result)
    if (data.code === 0) {
      var dd = JSON.parse(JSON.stringify(data.data))
      dd = JSON.parse(dd)
      callback(dd.data, dd.sing)
    } else {
      callback(new Error(data.msg))
    }
  })
}
export function decryptData (data, sing, callback) {
  coedova.plugins.encryptData.rsaDecrypt([data, storages.get(globals.PUBLIC_KEY), sing], function (result) {
    if (data.code === 0) {
      let data = JSON.parse(result)
      callback(data.data)
    } else {
      callback(new Error(data.msg))
    }
  })
}
