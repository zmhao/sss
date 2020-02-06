import storage from 'good-storage'

var storages = {
  set (key, value) {
    storage.set(key, value)
  },
  get (key) {
    return storage.get(key, [])
  },
  del (key) {
    storage.remove(key)
  },
  delAll () {
    storage.clear()
  }
}

export default storages