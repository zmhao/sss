import Vue from 'vue'
import VueI18n from 'vue-i18n'
import elementEnLocale from 'element-ui/lib/locale/lang/en' // element-ui lang
import elementZhLocale from 'element-ui/lib/locale/lang/zh-CN' // element-ui lang
import elementKmLocale from 'element-ui/lib/locale/lang/km' // element-ui lang
import ElementLocale from 'element-ui/lib/locale'
import enLocale from './en'
import zhLocale from './zh'
import kmLocale from './km'
import storages from '@views/cache/cache'
import global from '@views/common/global'

Vue.use(VueI18n)

const messages = {
  en: {
    ...enLocale,
    ...elementEnLocale
  },
  zh: {
    ...zhLocale,
    ...elementZhLocale
  },
  km: {
    ...kmLocale,
    ...elementKmLocale
  }
}
const i18n = new VueI18n({
  locale:
    process.env.NODE_ENV === 'development'
      ? storages.get(global.LANG) || 'zh-CN'
      : process.env.LANGUAGE || 'zh-CN', // set locale
  messages, // set locale messages
  silentTranslationWarn: true
})

ElementLocale.i18n((key, value) => i18n.t(key, value))

export default i18n
