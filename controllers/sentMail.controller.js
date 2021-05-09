var nodemailer = require('nodemailer');
const tour = require('../models/tour.model');
const TOURCONSTANT = require('../constants/tour.constant');
const tourModel = require('../models/tour.model');

const sentEmailConfirm = async (req, res) => {
  try {
    const {
      tour,
      user,
      productCart,
      inforBooking,
      inforAdults,
      inforChildren,
      inforYoung,
    } = req.body;
    var transporter = nodemailer.createTransport({
      // config mail server
      service: 'Gmail',
      auth: {
        user: 'hungffun.1@gmail.com',
        pass: '1641999dohung',
      },
    });
    var mainOptions = {
      // thiết lập đối tượng, nội dung gửi mail
      from: 'Thanh Batmon',
      to: user.email,
      subject: 'Xác thực đăng ký Tour của BandaFly',
      text: 'You recieved message from ',
      html:
        `<table  cellpadding="0" cellspacing="0" width="1000" border="0">
          <tbody><tr>
              <td colspan="2">
                  <div style="height:70px;width:760px">
                      <div style="float:left;width:380px;margin-top:10px">
                         
                      </div>
                      <div style="float:left;width:380px;margin-top:10px">
                          <div style="margin-left:260px;text-align:left">
                              <span style="color:#c50000;font-weight:bold;font-size:20px">1900 1839</span><br>
                              <span style="color:#333;font-size:11px">cước gọi 1000đ/phút</span>
                          </div>
                        
                      </div>
                  </div>
              </td>
          </tr>
          <tr>
              <td colspan="2">
                  <div style="text-align:center;font-weight:bold;text-transform:uppercase;color:#000;font-size:24px;padding-top:20px;padding-bottom:20px;border-bottom:1px dotted #ccc;border-top:1px dotted #ccc;margin-bottom:30px">Booking của quý khách</div>
              </td>
          </tr>
          <tr>
              <td colspan="2">
                  <div style="font-weight:bold;text-transform:uppercase;color:#c50000;margin-bottom:10px;font-size:16px">I. Phiếu xác nhận booking:</div>
                  <div style="background:#f1f1f1;padding:15px;height:190px;margin-bottom:20px">
                      <div style="width:100%;float:left">
                          <div style="padding:0 15px 0 15px">
                              <div style="font-size:16px;text-align:justify;line-height:18px;color:#025da6;margin-bottom:10px">Bay cùng Vietravel Airlines: Sapa - Hà Nội -  Yên Tử - Hạ Long - Bái Đính - Tràng An  - Tuyệt Tịnh Cốc An (Tặng Vé Tàu Hỏa Mường Hoa, Khách Sạn 3 Sao)</div>
                              <div style="float:left;width:100%;margin-bottom:7px">
                                  <div style="float:left;width:20%;font-weight:bold;color:#333">Mã tour:</div>
                                  <div style="float:left;width:80%">` +
        tour.tourId +
        `</div>
                              </div>
                              <div style="float:left;width:100%;margin-bottom:7px">
                                  <div style="float:left;width:20%;font-weight:bold;color:#333">Hành trình:</div>
                                  <div style="float:left;width:80%">` +
        tour.tourName +
        `</div>
                              </div>
                              <div style="float:left;width:100%;margin-bottom:7px">
                                  <div style="float:left;width:20%;font-weight:bold;color:#333">Ngày đi:</div>
                                  <div style="float:left;width:30%">` +
        tour.startDate +
        `</div>
                                  <div style="float:left;width:20%;font-weight:bold;color:#333">Ngày về:</div>
                                  <div style="float:left;width:30%">` +
        tour.endDate +
        `</div>
                              </div>
                              <div style="float:left;width:100%;margin-bottom:7px">
                                  <div style="float:left;width:20%;font-weight:bold;color:#333">Nơi tập trung:</div>
                                  <div style="float:left;width:30%">06:30 sáng tại Cột 14 Cổng D3 -Ga đi trong nước-Sân bay Tân Sơn Nhất</div>
                                  <div style="float:left;width:20%;font-weight:bold;color:#333">Điểm khởi hành:</div>
                                  <div style="float:left;width:30%"> ` +
        tour.startPlace +
        `</div>
                              </div>
                          </div>
                      </div>
                      <div style="clear:both"></div>
                  </div>
                  <div style="line-height:22px;text-align:justify;margin-bottom:25px">
                      <strong>Ghi chú:</strong> LH: Tổng đài tư vấn 1900 1839 (từ 8-23h)//.Vé máy bay không hoàn,không dời,đổi,hủy mất 100%.Quý khách vui lòng khai báo y tế trước giờ bay 24 tiếng theo link: <a href="https://tokhaiyte.vn" target="_blank" data-saferedirecturl="https://www.google.com/url?q=https://tokhaiyte.vn&amp;source=gmail&amp;ust=1619546833360000&amp;usg=AFQjCNHjGEvyoVnM-esPd0BKvTCN5Hj7Tg">https://tokhaiyte.vn</a>
                  </div>
              </td>
          </tr>
          <tr>
              <td colspan="2" class="m_8740785467110873926chitietbooking">
                  <div style="font-weight:bold;text-transform:uppercase;color:#c50000;margin-bottom:10px;font-size:16px">II. Chi tiết booking:</div>
                  <table width="100%" style="margin-bottom:20px">
                      <tbody><tr>
                          <td class="m_8740785467110873926td-left">Số booking:</td>
                          <td class="m_8740785467110873926td-right">
                              <span style="font-weight:bold">` +
        inforBooking.bookId +
        `<br>
                              <span style="font-style:italic">Quý khách vui lòng nhớ số booking (Booking No) để thuận tiện cho các giao dịch sau này.</span>
                          </td>
                      </tr>
                      <tr>
                          <td class="m_8740785467110873926td-left">Trị giá booking:</td>
                          <td class="m_8740785467110873926td-right">
                              <span style="font-weight:bold;color:#c50000">` +
        inforBooking.totalMoney +
        ` đ</span>
                          </td>
                      </tr>
                      <tr>
                          <td class="m_8740785467110873926td-left">Ngày đăng ký:</td>
                          <td class="m_8740785467110873926td-right">
                              <span>` +
        inforBooking.dateBook +
        `(Theo giờ Việt Nam) </span>
                          </td>
                      </tr>
                      <tr>
                          <td class="m_8740785467110873926td-left">Hình thức thanh toán:</td>
                          <td class="m_8740785467110873926td-right">
                              <span>` +
        inforBooking.payments +
        `</span>
                          </td>
                      </tr>
                      <tr>
                          <td class="m_8740785467110873926td-left">Thời hạn thanh toán:</td>
                          <td class="m_8740785467110873926td-right">
                              18/04/2021 16:47:33 (Theo giờ Việt Nam)<br>
                              <span style="font-style:italic">Nếu quá thời hạn trên mà quý khách chưa thanh toán, Vietravel sẽ hủy booking này.</span>
                          </td>
                      </tr>
                      <tr>
                          <td class="m_8740785467110873926td-left">Tình trạng:</td>
                          <td class="m_8740785467110873926td-right" style="color:#c50000;font-weight:bold">
                              Booking của quý khách đã được chúng tôi xác nhận thành công
                          </td>
                      </tr>
                  </tbody></table>
              </td>
          </tr>
          <tr>
              <td colspan="2" class="m_8740785467110873926thongtinlienlac">
                  <div style="font-weight:bold;text-transform:uppercase;color:#c50000;margin-bottom:10px;font-size:16px">III. Thông tin liên lạc:</div>
                  <table width="100%" style="margin-bottom:20px">
                      <tbody><tr>
                          <td class="m_8740785467110873926td-left">Họ và tên:</td>
                          <td class="m_8740785467110873926td-right">
                          ` +
        user.fullName +
        `
                          </td>
                      </tr>
                      <tr>
                          <td class="m_8740785467110873926td-left">Địa chỉ:</td>
                          <td class="m_8740785467110873926td-right">
                          ` +
        user.address +
        `
                          </td>
                      </tr>
                      <tr>
                          <td class="m_8740785467110873926td-left">Điện thoại:</td>
                          <td class="m_8740785467110873926td-right">
                          ` +
        user.phone +
        `
                          </td>
                      </tr>
                      <tr>
                          <td class="m_8740785467110873926td-left">Di động:</td>
                          <td class="m_8740785467110873926td-right">
                          ` +
        user.phone +
        `
                          </td>
                      </tr>
                      <tr>
                          <td class="m_8740785467110873926td-left">Email:</td>
                          <td class="m_8740785467110873926td-right">
                              <a href="mailto:hung.fun40@gmail.com" style="color:#306eb7;font-style:italic" target="_blank"> ` +
        user.email +
        `</a>
                          </td>
                      </tr>
                      <tr>
                          <td class="m_8740785467110873926td-left">Ghi chú:</td>
                          <td class="m_8740785467110873926td-right">
                            Thời hạn thanh toán 1 ngày sau khi nhân được Email này. </td>
                      </tr>
                      <tr>
                          <td class="m_8740785467110873926td-left">Lưu ý:</td>
                          <td class="m_8740785467110873926td-right" style="font-weight:bold">
                              Số ghế trên xe được hệ thống tự động sắp xếp dựa trên thứ tự Quý khách đăng ký và thanh toán tour. <br>
                              <i>(Áp dụng đối với dịch vụ tour trọn gói)</i>
                          </td>
                      </tr>
                      <tr>
                          <td class="m_8740785467110873926td-left">Tổng số khách:</td>
                          <td class="m_8740785467110873926td-right">
                              <span style="float:left;color:#c50000;font-weight:bold">
                                  1
                              </span>
                              <span style="float:left;font-weight:bold;color:#333">
                                  &nbsp; &nbsp; &nbsp; Người lớn:
                              </span>
                              <span style="float:left">
                                  1
                              </span>
                              <span style="float:left;font-weight:bold;color:#333">
                                  &nbsp; &nbsp; &nbsp; Trẻ em:
                              </span>
                              <span style="float:left">
                                  0
                              </span>
                              <span style="float:left;font-weight:bold;color:#333">
                                  &nbsp; &nbsp; &nbsp;   Trẻ nhỏ:
                              </span>
                              <span style="float:left">
                                  0
                              </span>
                              <span style="float:left;font-weight:bold;color:#333">
                                  &nbsp; &nbsp; &nbsp;   Em bé:
                              </span>
                              <span style="float:left">
                                  0
                              </span>
                          </td>
                      </tr>
                  </tbody></table>
              </td>
          </tr>
          <tr>
              <td colspan="2" style="font-weight:bold">
                  <div style="margin-bottom:15px">
                      Chúc quý khách 1 chuyến du lịch thật vui vẻ và bổ ích!
                  </div>
              </td>
          </tr>
          
          <tr>
              <td colspan="2">&nbsp;</td>
          </tr>
         
      </tbody></table>`,
    };
    transporter.sendMail(mainOptions, function (err, info) {
      if (err) {
        console.log(err);
      } else {
        console.log('Message sent: ' + info.response);
      }
    });
  } catch (error) {
    res.status(500).send({ message: TOURCONSTANT.NOT_FOUND_TOUR });
  }
};
module.exports = {
  sentEmailConfirm,
};
