const User = require("../model/User");
const Products = require("../model/Product");
const bcrypt = require("bcrypt");
const cookieParser = require("cookie-parser");
const Session = require("../model/Session");
const Rooms = require("../model/Rooms");
const jwt = require("jsonwebtoken");

exports.register = async (req, res, next) => {
  try {
    const email = await User.findOne({ email: req.body.email });
    if (email) return res.status(400).send("Username or email already exist");
    else {
      const salt = bcrypt.genSaltSync(10);
      const hash = bcrypt.hashSync(req.body.password, salt);
      const newUser = new User({
        email: req.body.email,
        password: hash,
        fullName: req.body.fullname,
        phoneNumber: req.body.phone,
      });
      await newUser.save();
      return res.json({ message: "User has been created" });
    }
  } catch (err) {
    next(err);
  }
};
exports.detail = async (req, res) => {
  const id = req.params.id;

  const users = await User.findOne({ _id: id });

  res.json(users);
};

exports.login = async (req, res, next) => {
  try {
    const { email, password } = req.body;
    const user = await User.findOne({ email: email });
    const secret = "secret";
    if (!user) return next(createError(404, "User not found"));
    const isPasswordCorrect = await bcrypt.compare(password, user.password);
    if (!isPasswordCorrect) {
      return res.status(400).send("Wrong password or username!");
    } else {
      const accessToken = jwt.sign(
        { userId: user._id.toString(), role: user.role, name: user.fullName },
        secret
      );
      const session = new Session({ user: user._id });
      await session.save();

      res.status(200).send(accessToken);
    }
  } catch (err) {
    next(err);
  }
};

exports.loginAdmin = async (req, res, next) => {
  const { email, password } = req.body;
  const secret = "secret";

  try {
    const user = await User.findOne({ email: email });
    if (!user) return next(createError(404, "User not found"));
    const isPasswordCorrect = await bcrypt.compare(password, user.password);
    if (!isPasswordCorrect)
      return res.status(400).send("Wrong password or username!");

    if (user.role === "customer" || user.role === "admin") {
      const accessToken = jwt.sign(
        { userId: user._id.toString(), role: user.role, name: user.fullName },
        secret
      );
      const session = new Session({ user: user._id });
      await session.save();

      res.status(200).send(accessToken);
    } else {
      res
        .status(404)
        .send("Incorrect email or password, please log in again!!");
    }
  } catch (err) {
    next(err);
  }
};
exports.addToCart = async (req, res, next) => {
  try {
    const { count, idProduct, idUser, quantity } = req.query;

    // Tìm user theo idUser
    const user = await User.findById(idUser);

    if (!user) {
      return res.status(404).send({ message: "User not found" });
    }

    // Tìm cart item trong mảng cart dựa trên idProduct
    const cartItem = user.cart.find(
      (item) => item.product.toString() === idProduct
    );

    if (cartItem) {
      // Nếu cart item đã tồn tại, tăng quantity lên count mới
      cartItem.quantity += parseInt(count);
    } else {
      // Nếu cart item chưa tồn tại, tạo mới cart item và thêm vào mảng cart
      user.cart.push({ product: idProduct, quantity: parseInt(count) });
    }
    // const product = Products.findById(idProduct);
    // product.quantity.push({quantity: quantity - count})

    // Lưu user đã cập nhật
    await user.save();

    // Trả về kết quả thành công
    res.send({ message: "Add to cart successful" });
  } catch (err) {
    console.error(err);
    res.status(500).send({ message: "Internal server error" });
  }
};
exports.getCart = async (req, res, next) => {
  try {
    const id = req.params.id;
    const cart = await User.findById(id).populate("cart.product");
    res.send(cart);
  } catch (err) {
    next(err);
  }
};
exports.getAllUsers = async (req, res, next) => {
  try {
    const user = await User.find();
    res.status(200).send(user);
  } catch (err) {
    next(err);
  }
};

exports.updateToCart = async (req, res) => {
  try {
    const idUser = req.query.idUser; // Lấy idUser của user cần sửa
    const idProduct = req.query.idProduct; // Lấy idProduct của user cần sửa
    const count = req.query.count; // Lấy count của user cần sửa

    const updatedUser = await User.findOneAndUpdate(
      {
        _id: idUser,
        "cart._id": idProduct,
      },
      {
        $set: {
          "cart.$.quantity": count,
        },
      },
      { new: true }
    );

    if (!updatedUser) {
      return res.status(404).send("User or product not found in cart");
    }

    res.send("Update Thanh Cong");
  } catch (error) {
    res.status(500).send("Internal Server Error");
  }
};

exports.deleteToCart = async (req, res) => {
  try {
    //Lấy idUSer của user cần xóa
    const idUser = req.query.idUser;

    //Lấy idProduct của user cần xóa
    const idProduct = req.query.idProduct;

    //Tìm đúng cái sản phẩm mà User đã thêm vào giỏ hàng
    const updatedUser = await User.findOneAndUpdate(
      { _id: idUser },
      { $pull: { cart: { _id: idProduct } } },
      { new: true }
    );

    if (!updatedUser) {
      return res.status(404).send("User not found");
    }

    res.send("Product removed from cart");
  } catch (error) {
    res.status(500).send("Internal Server Error");
  }
};

exports.logout = async (req, res, next) => {
  try {
    const secret = "secret";
    const {cookie} = req.body;

    const decoded = jwt.verify(cookie, secret);

    if (decoded) {
      // Xóa session dựa trên accessToken
      await Session.deleteOne({ user: decoded.userId });
      await Rooms.deleteOne({ id_user: decoded.userId });

      // Xóa cookie trong client
      res.clearCookie("accessToken");
    }

    res.send("Logout successful");
  } catch (err) {
    next(err);
  }
};
