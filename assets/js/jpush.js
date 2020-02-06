export default class jPush {
  /**
   * 判断字符串是否为空
   * @param str
   * @returns {boolean}
   */
  static isNull(str) {
    return str == null || str.length === 0 || str === "";
  }

  /**
   *
   * @desc  判断是否为身份证号
   * @param  {String|Number} str
   * @return {Boolean}
   */
  static isIdCard(str) {
    return /^(^[1-9]\d{7}((0\d)|(1[0-2]))(([0|1|2]\d)|3[0-1])\d{3}$)|(^[1-9]\d{5}[1-9]\d{3}((0\d)|(1[0-2]))(([0|1|2]\d)|3[0-1])((\d{4})|\d{3}[Xx])$)$/.test(
      str
    );
  }

  /**
   *
   * @desc   判断是否为手机号
   * @param  {String|Number} str
   * @return {Boolean}
   */
  static isPhoneNum(str) {
    return /^(0|86|17951)?(1[3-9][0-9])[0-9]{8}$/.test(str);
  }
  /**
   * 停止推送服务
   */
  static stopPush() {
    window.JPush.stopPush();
  }
  /**
   * 恢复推送服务
   */
  static resumePush() {
    window.JPush.resumePush();
  }
  /**
   * 设置别名
   *   @param  {String|Number} number 操作编号
   * @return {alias}//别名
   */
  static setAlias(number, alias) {
    console.log(number + "---" + typeof alias);
    return new Promise(function(resolve, reject) {
      window.JPush.setAlias(
        { sequence: number, alias: alias },
        result => {
          var sequence = result.sequence;
          // var alias = result.alias
          resolve(sequence);
        },
        error => {
          var sequence = error.sequence;
          var errorCode = error.code;
          console.log("errorCode" + errorCode + "sequence" + sequence);
          reject(errorCode);
        }
      );
    });
  }
  /**
   * 获取别名
   * @param {*操作序号} number
   */
  static getAlias(number) {
    return new Promise(function(resolve, reject) {
      window.JPush.getAlias(
        { sequence: number },
        result => {
          // var sequence = result.sequence
          var alias = result.alias;
          console.log(alias);
          resolve(alias);
        },
        error => {
          var sequence = error.sequence;
          var errorCode = error.code;
          reject(errorCode);
          console.log("errorCode" + errorCode + "sequence" + sequence);
        }
      );
    });
  }
  /**
   * 删除别名
   * @param {操作标识} number
   */
  static deleteAlias(number) {
    return new Promise(function(resolve, reject) {
      window.JPush.deleteAlias(
        { sequence: number },
        result => {
          var sequence = result.sequence;
          resolve(sequence);
        },
        error => {
          var sequence = error.sequence;
          var errorCode = error.code;
          reject(errorCode);
          console.log("errorCode" + errorCode + "sequence" + sequence);
        }
      );
    });
  }
  /**
   *设置消息分组标签 此操作会覆盖原有标签
   * @param {*操作编号} number
   * @param {*标签数组} tags
   */
  static setTag(number, tags) {
    console.log("setTag===:" + tags);
    return new Promise(function(resolve, reject) {
      window.JPush.setTags(
        { sequence: number, tags: tags },
        result => {
          var sequence = result.sequence;
          console.log("setTag" + result.sequence);
          // var tags = result.tags // 数组类型
          resolve(sequence);
        },
        error => {
          var sequence = error.sequence;
          var errorCode = error.code;
          reject(errorCode);
          console.log("errorCode" + errorCode + "sequence" + sequence);
        }
      );
    });
  }
  /**
   *新增tag标签
   * @param {*操作编号发送与返回的编码相同} number
   * @param {*添加标签的数组} tags
   */
  static addTags(number, tags) {
    return new Promise(function(resolve, reject) {
      window.JPush.addTags(
        { sequence: number, tags: tags },
        result => {
          // var sequence = result.sequence
          // var tags = result.tags // 数组类型
          console.log("addTags" + result.sequence);
          resolve(result.sequence);
        },
        error => {
          var sequence = error.sequence;
          var errorCode = error.code;
          reject(errorCode);
          console.log("errorCode" + errorCode + "sequence" + sequence);
        }
      );
    });
  }
  /**
   *删除指定tag标签
   * @param {*操作编号发送与返回的编码相同} number
   * @param {*添加标签的数组} tags
   */
  static deleteTags(number, tags) {
    return new Promise(function(resolve, reject) {
      window.JPush.deleteTags(
        { sequence: number, tags: tags },
        result => {
          var sequence = result.sequence;
          resolve(sequence);
        },
        error => {
          var sequence = error.sequence;
          var errorCode = error.code;
          reject(errorCode);
          console.log("errorCode" + errorCode + "sequence" + sequence);
        }
      );
    });
  }
  /**
   * 清空所有tag标签
   * @param {} number
   */
  static cleanTags(number) {
    return new Promise(function(resolve, reject) {
      window.JPush.cleanTags(
        { sequence: number },
        result => {
          var sequence = result.sequence;
          resolve(sequence);
        },
        error => {
          var sequence = error.sequence;
          var errorCode = error.code;
          reject(errorCode);
          console.log("errorCode" + errorCode + "sequence" + sequence);
        }
      );
    });
  }
  static getAllTags(number) {
    return new Promise(function(resolve, reject) {
      window.JPush.getAllTags(
        { sequence: number },
        result => {
          var sequence = result.sequence;
          resolve(sequence);
        },
        error => {
          var sequence = error.sequence;
          var errorCode = error.code;
          reject(errorCode);
          console.log("errorCode" + errorCode + "sequence" + sequence);
        }
      );
    });
  }
  /**
   * 查询指定tag当前用户绑定状态
   * @param {} number
   * @param {*} tag
   */
  static checkTagBindState(number, tag) {
    return new Promise(function(resolve, reject) {
      window.JPush.checkTagBindState(
        { sequence: number, tag: tag },
        result => {
          var sequence = result.sequence;
          resolve(sequence);
        },
        error => {
          var sequence = error.sequence;
          var errorCode = error.code;
          reject(errorCode);
          console.log("errorCode" + errorCode + "sequence" + sequence);
        }
      );
    });
  }
  /**
   * 获取点击的通知内容
   */
  static getClickNotification() {
    return new Promise(function(resolve, reject) {
      document.addEventListener(
        "jpush.openNotification",
        function(event) {
          var alertContent;
          if (device.platform === "Android") {
            alertContent = event.alert;
          } else {
            alertContent = event.aps.alert;
          }
          resolve(alertContent);
        },
        false
      );
    });
  }
  /**
   * 获取通知内容
   */
  static receiveNotification() {
    return new Promise(function(resolve, reject) {
      document.addEventListener(
        "jpush.receiveNotification",
        function(event) {
          var alertContent;
          if (device.platform === "Android") {
            alertContent = event.alert;
          } else {
            alertContent = event.aps.alert;
          }
          resolve(alertContent);
          // alert("open Notification:" + alertContent);
        },
        false
      );
    });
  }
  /**
   * 获取自定义消息内容
   */
  static receiveMessage() {
    return new Promise(function(resolve, reject) {
      document.addEventListener(
        "jpush.receiveMessage",
        function(event) {
          var message;
          if (device.platform === "Android") {
            message = event.message;
          } else {
            message = event.content;
          }
          resolve(message);
        },
        false
      );
    });
  }

  /**
   * 判断当前应用是否开启推送
   * 在 Android 中，返回值为 0 时，代表系统设置中关闭了推送；为 1 时，代表打开了推送（目前仅适用于Android 4.4+）。
    在 iOS 中，返回值为 0 时，代表系统设置中关闭了推送；大于 0 时，代表打开了推送，且能够根据返回值判断具体通知形式：
    UIRemoteNotificationTypeNone    = 0,      // 0
    UIRemoteNotificationTypeBadge   = 1 << 0, // 1
    UIRemoteNotificationTypeSound   = 1 << 1, // 2
    UIRemoteNotificationTypeAlert   = 1 << 2, // 4
    UIRemoteNotificationTypeNewsstandContentAvailability = 1 << 3 // 8
*/
  static getUserNotificationSettings() {
    return new Promise(function(resolve, reject) {
      window.JPush.getUserNotificationSettings(function(result) {
        resolve(result);
        //     if(result == 0) {
        //       // 系统设置中已关闭应用推送。
        //     } else if(result > 0) {
        //       // 系统设置中打开了应用推送。
        //     }
      });
    });
  }
}
