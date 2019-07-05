import drawQrcode from '../../utils/weapp.qrcode.min.js'

Page({
  demo() {
    wx.navigateTo({
      url: "/pages/share/share",
    })
  },
  /*
    立即分享
    先用wx.canvasToTempFilePath将卡片中的二维码转化成图片
    再将图片和海报页面在canvas进行合成，并再次生成图片发送给success
  */
  share(e) {
    let that = this;
    let cardId = e.target.dataset.card;
    wx.canvasToTempFilePath({
      canvasId: cardId,
      success: function (res) {
        let tempFilePath = res.tempFilePath;
        that.drawPosters(tempFilePath);
      },
      fail: function (res) {
        console.log(res);
      }
    });
  },
  drawPosters(qrcode) {
    wx.showLoading({
      title: '加载中',
    })


    let that = this;

    // 获取屏幕宽度
    // let res = wx.getSystemInfoSync();
    // let width = res.windowWidth;
    // let height = res.windowHeight;

    let context = wx.createCanvasContext('mycanvas');
    context.setFillStyle("#108cee");
    context.fillRect(0, 0, 375, 667);
    //绘制背景图
    let bg = 'http://www.heshuai521.top/shuai/success.jpg'
    context.drawImage(bg, 0, 0, 375, 667);

    //绘制二维码
    let path = qrcode;
    context.drawImage(path, 135, 525, 107, 107);

    //将canvas绘制完成后生成的图片作为参数传递到success
    context.draw(false, () => {
      wx.canvasToTempFilePath({
        canvasId: 'mycanvas',
        success: function (res) {
          var tempFilePath = res.tempFilePath;
          console.log(tempFilePath);
          wx.hideLoading()
          wx.navigateTo({
            url: `/pages/poster/poster?qrcode=${tempFilePath}`,
          })
        },
        fail: function (res) {
          wx.hideLoading()
          console.log(res);
        }
      }, that);
    });




  },
  //设置不同屏幕宽度下的canvas宽度
  setCanvasSize() {
    var size = {};
    try {
      var res = wx.getSystemInfoSync();
      var scale = 750 / 185;//不同屏幕下canvas的适配比例；设计稿750宽/canvas185宽
      var width = res.windowWidth / scale;
      var height = width;//canvas画布为正方形
      size.w = width;
      size.h = height;
    } catch (e) {
      // Do something when catch error
      console.log("获取设备信息失败" + e);
    }
    return size;
  },
  //绘制二维码
  qrcode(cardId, cardUrl) {
    let width = Math.floor(this.setCanvasSize().w);
    let height = Math.floor(this.setCanvasSize().h);
    drawQrcode({
      width: width,
      height: height,
      canvasId: cardId,
      typeNumber: 10,
      text: cardUrl,
      callback(e) { }
    })
  },
  /**
   * 页面的初始数据
   */
  data: {
    cardList: [
      { img: 'https://www.baidu.com/', name: '粤卡通1', id: '001' },
      { img: 'https://www.cnblogs.com/web1/p/9232410.html', name: '粤卡通2', id: '002' },
      { img: 'https://www.cnblogs.com/web1/p/9232410.html', name: '粤卡通3', id: '003' },
      { img: 'https://www.cnblogs.com/web1/p/9232410.html', name: '粤卡通4', id: '004' },
      { img: 'https://www.cnblogs.com/web1/p/9232410.html', name: '粤卡通5', id: '005' },
      { img: 'https://www.cnblogs.com/web1/p/9232410.html', name: '粤卡通6', id: '006' },
      { img: 'https://www.cnblogs.com/web1/p/9232410.html', name: '粤卡通7', id: '007' },
    ]
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {

  },

  /**
   * 生命周期函数--监听页面初次渲染完成
   */
  onReady: function () {
    let that = this;
    let cardList = that.data.cardList;
    cardList.forEach((item, index) => {
      that.qrcode(item.id, item.img);
    });
  },

  /**
   * 生命周期函数--监听页面显示
   */
  onShow: function () {

  },

  /**
   * 生命周期函数--监听页面隐藏
   */
  onHide: function () {

  },

  /**
   * 生命周期函数--监听页面卸载
   */
  onUnload: function () {

  },

  /**
   * 页面相关事件处理函数--监听用户下拉动作
   */
  onPullDownRefresh: function () {

  },

  /**
   * 页面上拉触底事件的处理函数
   */
  onReachBottom: function () {

  },

  /**
   * 用户点击右上角分享
   */
  onShareAppMessage: function () {

  }
})