import { apiUpdateUserInfo, apiNotAuthPic } from "@api/api";
import storages from "@views/cache/cache";
import global from "@views/common/global";
const publicapi = {
  updateUserInfo() {
    //更新用户信息
    apiUpdateUserInfo({}).then(res => {
      storages.set(global.USERINFO, res.data.data.userinfo);
      storages.del(global.HEADPIC);
    });
  },
  refreshHead() {
    let imgId = storages.get(global.USERINFO).head_portrait_img_no;
    return new Promise(function(resolve, reject) {
      if (imgId) {
      //获取图片地址
        apiNotAuthPic({ image_id: imgId }).then(res => {
          if (res.data.uid.image_str) {
            storages.set(global.HEADPIC, res.data.uid.image_str);
            resolve(false);
          } else {
            resolve(true)
          }
        }).catch(err => {
          resolve(true)
        })
      
      } else {
        storages.del(global.HEADPIC);
        resolve(true)
      }
  })
  }
};
export default publicapi;
