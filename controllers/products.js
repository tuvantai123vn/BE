const Products = require("../model/Product");
const cloudinary = require("../configs/cloudinaryConfig");

exports.topProducts = async (req, res, next) => {
  try {
    const products = await Products.find({});
    res.status(200).send(products);
  } catch (err) {
    next(err);
  }
};
exports.products_category = async (req, res, next) => {
  try {
    const category = req.query.category;
    const products = await Products.find({ category: category });
    res.status(200).send(products);
  } catch (err) {
    next(err);
  }
};
exports.productDetail = async (req, res, next) => {
  try {
    const id = req.params.id;
    const products = await Products.findById(id);
    res.status(200).send(products);
  } catch (err) {
    next(err);
  }
};

exports.getAll = async (req, res, next) => {
  try {
    const { page, count, search } = req.query;
    const pageNumber = parseInt(page) || 1;
    const limitNumber = parseInt(count) || 10;

    const query = {};
    if (search) {
      query.name = search;
    }

    const totalCount = await Products.countDocuments(query);
    const totalPages = Math.ceil(totalCount / limitNumber);

    const skip = (pageNumber - 1) * limitNumber;

    const products = await Products.find(query).skip(skip).limit(limitNumber);

    res.status(200).json({
      products,
      currentPage: pageNumber,
      totalPages,
      totalCount,
    });
  } catch (error) {
    next(error);
  }
};

exports.addProducts = async (req, res, next) => {
  const uploadImage = [];
  const name = req.body.name;
  const category = req.body.category;
  const inventory = req.body.inventory;
  const price = req.body.price;
  const short_desc = req.body.short_desc;
  const long_desc = req.body.long_desc;
  const imgs = req.files.map((file) => file);

  try {
    for (let img of imgs) {
      const results = await cloudinary.uploader.upload(img.path);
      uploadImage.push({
        url: results.secure_url,
        publicId: results.public_id,
      });
    }
    const newPrd = new Products({
      name,
      price,
      category,
      inventory,
      short_desc,
      long_desc,
      img1: uploadImage[0].url,
      img2: uploadImage[1].url,
      img3: uploadImage[2].url,
      img4: uploadImage[3].url,
    });
    await newPrd.save();
    return res.status(200).json({ message: "SUCCESS" });
  } catch (err) {
    next(err);
  }
};

exports.updateProduct = async (req, res, next) => {
  const id = req.body.id;
  const name = req.body.name;
  const category = req.body.category;
  const price = req.body.price;
  const short_desc = req.body.short_desc;
  const long_desc = req.body.long_desc;

  try {
    // Sử dụng findOneAndUpdate để cập nhật sản phẩm
    const updatedProduct = await Products.findOneAndUpdate(
      { _id: id },
      {
        name: name,
        category: category,
        price: price,
        short_desc: short_desc,
        long_desc: long_desc,
      },
      { new: true } // Đảm bảo rằng updatedProduct sẽ trả về sản phẩm sau khi đã cập nhật
    );

    if (!updatedProduct) {
      return res.status(404).json({ message: "Product not found" });
    }

    return res.status(200).json({ message: "Product updated successfully" });
  } catch (err) {
    next(err);
  }
};
exports.deleteProduct = async (req, res, next) => {
  try {
    const id = req.params.id;

    const deletedProduct = await Products.findOneAndDelete({ _id: id });
    if (!deletedProduct) {
      return res.status(404).json({ message: "Sản phẩm không tồn tại" });
    }
    return res.status(200).json({ message: "Xóa sản phẩm thành công" });
  } catch (err) {
    next(err);
  }
};
