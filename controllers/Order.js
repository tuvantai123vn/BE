const nodemailer = require("nodemailer");
const User = require("../model/User");
const Order = require("../model/Order");
const { ObjectId } = require("mongodb");

exports.checkout = async (req, res, next) => {
  try {
    // Lấy thông tin từ yêu cầu POST
    const { to, fullname, phone, address, idUser } = req.body;

    const products = await User.findById(idUser).populate("cart.product");

    // Gửi email xác nhận đơn hàng
    await sendConfirmationEmail(to, fullname, phone, address, idUser);

    // Phản hồi với thông báo xác nhận
    res.send("Đơn hàng đã được xác nhận và email xác nhận đã được gửi đi.");

    // Hàm gửi email xác nhận đơn hàng
    async function sendConfirmationEmail(to, fullname, phone, address, idUser) {
      // Tạo một bản ghi Order mới
      const order = new Order({
        products: products.cart.map((value) => ({
          product: value.product._id,
          quantity: value.quantity,
          total: value.quantity * value.product.price,
        })),
        user: idUser, // Người dùng đặt hàng
        status: false, // Trạng thái đơn hàng
        orderDate: Date.now(), // Ngày đặt hàng
        delivery: false, // Trạng thái giao hàng
        address: address,
        phone: phone,
        total: products.cart.reduce((accumulator, value) => {
          const productTotal = value.quantity * value.product.price;
          return accumulator + productTotal;
        }, 0),
      });
      console.log('order',order);

      // Lưu bản ghi Order
      await order.save();

      // Cập nhật giỏ hàng của người dùng
      const user = await User.findById(idUser);
      user.cart = []; // Xóa giỏ hàng sau khi đặt hàng thành công

      console.log('user',user);
      await user.save();

      // Tạo một transporter để gửi email
      const transporter = nodemailer.createTransport({
        service: "gmail",
        auth: {
          user: "mailernode00@gmail.com", // Địa chỉ email của bạn
          pass: "ogasuybcmgnnvxxq", // Mật khẩu email của bạn
        },
      });

      // Chuẩn bị nội dung email
      const mailOptions = {
        from: "mailernode00@gmail.com", // Địa chỉ email người gửi
        to: to, // Địa chỉ email người nhận
        subject: "Xác nhận đơn hàng", // Tiêu đề email
        html: `
              <h2>Xin chào ${fullname}</h2>
              <p>Thời gian đặt hàng: ${Date.now()}</p>
              <h3>Số điện thoại: ${phone}</h3>
              <h3>Địa chỉ: ${address}</h3>
              <table style="border: 1px solid black;">
                <thead>
                  <tr>
                    <th>Tên sản phẩm</th>
                    <th>Hình ảnh</th>
                    <th>Giá</th>
                    <th>Số lượng</th>
                    <th>Thành tiền</th>
                  </tr>
                </thead>
                <tbody>
                  ${generateProductRows(products)}
                </tbody>
              </table>
              <h2>Tổng thanh toán:</h2>
              <h2>${products.cart.reduce((accumulator, value) => {
                const productTotal = value.quantity * value.product.price;
                return accumulator + productTotal;
              }, 0)}</h2>
            `,
      };

      // Gửi email
      await transporter.sendMail(mailOptions);
    }

    // Hàm tạo các dòng trong bảng dữ liệu sản phẩm
    function generateProductRows(products) {
      let rows = "";
      products.cart.map((value) => {
        rows += `
        <tr>
          <td style="border: 1px solid black; font-size: 1.2rem; text-align: center;">${
            value.product.name
          }</td>
          <td style="border: 1px solid black; font-size: 1.2rem; text-align: center;"><img src="${
            value.product.img1
          } width="80" height="80" alt="${value.product.name}"></td>
          <td style="border: 1px solid black; font-size: 1.2rem; text-align: center;">${
            value.product.price
          } VND</td>
          <td style="border: 1px solid black; font-size: 1.2rem; text-align: center;">${
            value.quantity
          }</td>
          <td style="border: 1px solid black; font-size: 1.2rem; text-align: center;">${
            value.quantity * value.product.price
          } VND</td>
        </tr>
      `;
      });

      return rows;
    }
  } catch (err) {
    next(err);
  }
};

exports.Order = async (req, res, next) => {
  try {
    const { id } = req.params;
    const cart = await Order.findById(id)
      .populate("user")
      .populate("products.product");
    res.send(cart);
  } catch (err) {
    next(err);
  }
};
exports.OrderUser = async (req, res, next) => {
  try {
    const { id } = req.params;
    const cart = await Order.find({ user: id }).populate("user");
    res.send(cart);
  } catch (err) {
    next(err);
  }
};

exports.getAllOrder = async (req, res, next) => {
  try {
    const cart = await Order.find({})
      .populate("user")
      .populate("products.product");
    res.send(cart);
  } catch (err) {
    next(err);
  }
};
