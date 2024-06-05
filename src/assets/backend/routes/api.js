const express = require("express");
const router = express.Router();
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const multer = require("multer");
const connectDb = require("../models/db");

let storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, "./public/images");
  },
  filename: function (req, file, cb) {
    cb(null, file.originalname);
  },
});

// Kiểm tra file upload
function checkFileUpload(req, file, cb) {
  if (!file.originalname.match(/\.(jpg|jpeg|png|gif)$/)) {
    return cb(new Error("Bạn chỉ được upload file ảnh"));
  }
  cb(null, true);
}

// Upload file
let upload = multer({ storage: storage, fileFilter: checkFileUpload });

// // Middleware for authentication
function authenToken(req, res, next) {
  const authHeader = req.headers["authorization"];
  const token = authHeader && authHeader.split(" ")[1];
  if (!token) return res.sendStatus(401);

  jwt.verify(token, process.env.JWT_SECRET, (err, user) => {
    if (err) return res.sendStatus(403);
    req.user = user;
    next();
  });
}

// ---------------------------Products--------------------------------//

// Get list of hot products
router.get("/producthot", async (req, res) => {
  const db = await connectDb();
  const productCollection = db.collection("products");
  const product = await productCollection.find({ hot: 1 }).toArray();
  if (product) {
    res.status(200).json(product);
  } else {
    res.status(404).json({ message: "Product not found." });
  }
});

// Get products by category ID
router.get("/products/categoryId/:id", async (req, res) => {
  try {
    const categoryId = parseInt(req.params.id);
    const db = await connectDb();
    const productCollection = db.collection("products");
    const products = await productCollection
      .find({ categoryId: categoryId })
      .toArray();
    if (products.length > 0) {
      res.status(200).json(products);
    } else {
      res.status(404).json({ message: "No products found for this category." });
    }
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// Get products by category name
router.get("/products/categoryName/:name", async (req, res) => {
  try {
    const categoryName = req.params.name;
    const db = await connectDb();
    const categoriesCollection = db.collection("categories");
    const category = await categoriesCollection.findOne({
      name: { $regex: categoryName, $options: "i" },
    });
    if (!category) {
      return res.status(404).json({ message: "Category not found." });
    }
    const categoryId = category.id;
    const productCollection = db.collection("products");
    const products = await productCollection
      .find({ categoryId: categoryId })
      .toArray();
    if (products.length > 0) {
      res.status(200).json(products);
    } else {
      res.status(404).json({ message: "No products found for this category." });
    }
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// Get products with pagination
router.get("/products/page/:page/limit/:limit", async (req, res) => {
  try {
    const page = parseInt(req.params.page) || 1;
    const limit = parseInt(req.params.limit) || 10;
    const skip = (page - 1) * limit;
    const db = await connectDb();
    const productCollection = db.collection("products");
    const products = await productCollection
      .find()
      .skip(skip)
      .limit(limit)
      .toArray();
    if (products.length > 0) {
      res.status(200).json(products);
    } else {
      res.status(404).json({ message: "No products found." });
    }
  } catch (error) {
    res.status(500).json({ message: "Internal Server Error" });
  }
});

// Get products by search keyword
router.get("/products/search/:keyword", async (req, res) => {
  try {
    const keyword = req.params.keyword;
    const db = await connectDb();
    const productCollection = db.collection("products");
    const products = await productCollection
      .find({ name: { $regex: keyword, $options: "i" } })
      .toArray();
    if (products.length > 0) {
      res.status(200).json(products);
    } else {
      res
        .status(404)
        .json({ message: "No products found matching the search keyword." });
    }
  } catch (error) {
    res.status(500).json({ message: "Internal Server Error" });
  }
});

// Get all products
router.get("/products", async (req, res) => {
  const db = await connectDb();
  const productCollection = db.collection("products");
  const products = await productCollection.find().toArray();
  if (products) {
    res.status(200).json(products);
  } else {
    res.status(404).json({ message: "Products not found" });
  }
});

// Get product by ID
router.get("/products/:id", async (req, res) => {
  const db = await connectDb();
  const productCollection = db.collection("products");
  const id = req.params.id;
  const product = await productCollection.findOne({ id: parseInt(id) });
  if (product) {
    res.status(200).json(product);
  } else {
    res.status(404).json({ message: "Product not found" });
  }
});

// Add a new product
router.post("/products/add", upload.single("img"), async (req, res) => {
  try {
    const { name, price, categoryId, description } = req.body;
    const img = req.file.filename;

    const db = await connectDb();
    const productCollection = db.collection("products");

    const lastProduct = await productCollection
      .find()
      .sort({ id: -1 })
      .limit(1)
      .toArray();

    const id = lastProduct[0] ? lastProduct[0].id + 1 : 1;
    const newProduct = { id, name, price, categoryId, description, img };

    await productCollection.insertOne(newProduct);

    if (newProduct) {
      res.status(200).json(newProduct);
    } else {
      res.status(404).json({ message: "Failed to add product" });
    }
  } catch (error) {
    res.status(500).json({ message: "Server error", error: error.message });
  }
});

// Edit a product
router.put("/products/:id", upload.single("img"), async (req, res) => {
  try {
    const id = req.params.id;
    let img = "";
    if (req.file) {
      img = req.file.filename;
    }
    const db = await connectDb();
    const productCollection = db.collection("products");
    const { name, price, categoryId, description } = req.body;
    const product = await productCollection.findOne({ id: parseInt(id) });
    if (!product) {
      return res.status(404).json({ message: "Product not found" });
    }
    const editProduct = { name, price, categoryId, description };
    if (img !== "") {
      editProduct.img = img;
    }
    await productCollection.updateOne(
      { id: parseInt(id) },
      { $set: editProduct }
    );
    res.status(200).json(editProduct);
  } catch (error) {
    console.error("Error editing product:", error);
    res.status(500).json({ message: "Internal server error" });
  }
});

// Delete a product
router.delete("/products/:id", async (req, res) => {
  const id = req.params.id;
  const db = await connectDb();
  const productCollection = db.collection("products");
  const product = await productCollection.deleteOne({ id: parseInt(id) });
  if (product) {
    res.status(200).json({ message: "Product deleted successfully" });
  } else {
    res.status(404).json({ message: "Product not found" });
  }
});

// ---------------------------Categories--------------------------------//

// Get list of categories
router.get("/categories", async (req, res) => {
  try {
    const db = await connectDb();
    const categoriesCollection = db.collection("categories");
    const categories = await categoriesCollection.find().toArray();
    res.status(200).json(categories);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// Get category by ID
router.get("/categories/:id", async (req, res) => {
  try {
    const id = req.params.id;
    const db = await connectDb();
    const categoriesCollection = db.collection("categories");
    const category = await categoriesCollection.findOne({ id: parseInt(id) });
    if (category) {
      res.status(200).json(category);
    } else {
      res.status(404).json({ message: "Category not found" });
    }
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// Add a new category
router.post("/categories/add", upload.single("img"), async (req, res) => {
  try {
    if (!req.file) {
      return res.status(400).json({ message: "Image file is required" });
    }

    const { name } = req.body;
    const img = req.file.filename;

    const db = await connectDb();
    const categoriesCollection = db.collection("categories");

    const lastCategory = await categoriesCollection
      .find()
      .sort({ id: -1 })
      .limit(1)
      .toArray();

    const id = lastCategory[0] ? lastCategory[0].id + 1 : 1;
    const newCategory = { id, name, img };

    await categoriesCollection.insertOne(newCategory);

    if (newCategory) {
      res.status(200).json(newCategory);
    } else {
      res.status(404).json({ message: "Failed to add category" });
    }
  } catch (error) {
    res.status(500).json({ message: "Server error", error: error.message });
  }
});

// Edit a category
router.put("/categories/:id", upload.single("img"), async (req, res) => {
  try {
    const id = req.params.id;
    let img = "";
    if (req.file) {
      img = req.file.filename;
    }

    const db = await connectDb();
    const categoriesCollection = db.collection("categories");
    const { name } = req.body;

    const category = await categoriesCollection.findOne({ id: parseInt(id) });
    if (!category) {
      return res.status(404).json({ message: "Category not found" });
    }

    const editCategory = { name };
    if (img !== "") {
      editCategory.img = img;
    }

    await categoriesCollection.updateOne(
      { id: parseInt(id) },
      { $set: editCategory }
    );

    res.status(200).json(editCategory);
  } catch (error) {
    console.error("Error editing category:", error);
    res.status(500).json({ message: "Internal server error" });
  }
});

// Delete a category
router.delete("/categories/:id", async (req, res) => {
  try {
    const db = await connectDb();
    const categoriesCollection = db.collection("categories");
    await categoriesCollection.deleteOne({ id: parseInt(req.params.id) });
    res.status(200).json({ message: "Category deleted successfully" });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// ---------------------------Users--------------------------------//

// Get list of users
router.get("/users", async (req, res) => {
  //authenToken
  const db = await connectDb();
  const userCollection = db.collection("users");
  const users = await userCollection.find().toArray();
  if (users) {
    res.status(200).json(users);
  } else {
    res.status(404).json({ message: "Users not found" });
  }
});

// Get user by ID
router.get("/users/:id", async (req, res) => {
  const db = await connectDb();
  const userCollection = db.collection("users");
  const id = req.params.id;
  const user = await userCollection.findOne({ id: parseInt(id) });
  if (user) {
    res.status(200).json(user);
  } else {
    res.status(404).json({ message: "User not found" });
  }
});

// Delete user by ID
router.delete("/users/:id", async (req, res) => {
  const db = await connectDb();
  const userCollection = db.collection("users");
  const id = req.params.id;
  const user = await userCollection.deleteOne({ id: parseInt(id) });
  if (user) {
    res.status(200).json({ message: "User deleted successfully" });
  } else {
    res.status(404).json({ message: "User not found" });
  }
});

// Login
router.post("/login", upload.single("img"), async (req, res, next) => {
  const { email, password } = req.body;
  try {
    const db = await connectDb();
    const userCollection = db.collection("users");
    const user = await userCollection.findOne({ email: email });

    if (user) {
      if (bcrypt.compareSync(password, user.password)) {
        const token = jwt.sign(
          {
            email: user.email,
            // isAdmin: user.isAdmin, 
            fullName: user.fullName,
          },
          "secretkey",
          { expiresIn: "60s" }
        );
        res.status(200).json({
          token: token,
          email: email,
          password: password,
          isAdmin: user.isAdmin,
          fullName: user.fullName
        });
      } else {
        res.status(403).json({ message: "Email  mật khẩu không chính xác" });
      }
    } else {
      res.status(403).json({ message: "Email hoặc mật khẩu không chính xác" });
    }
  } catch (error) {
    console.error("Error:", error);
    res.status(500).json({ message: "Lỗi máy chủ" }); // Server error response
  }
});

//Register
router.post("/register", upload.single("img"), async (req, res, next) => {
  const { email, password, fullName } = req.body;
  let img = req.file.originalname; // Get the file path
  console.log(email);

  const db = await connectDb();
  const userCollection = db.collection("users");

  try {
    let user = await userCollection.findOne({ email: email });
    console.log(user);

    if (user) {
      res.status(409).json({ message: "Email đã tồn tại" });
    } else {
      let lastUser = await userCollection
        .find()
        .sort({ id: -1 })
        .limit(1)
        .toArray();
      let id = lastUser[0] ? lastUser[0].id + 1 : 1;
      const salt = bcrypt.genSaltSync(10);
      let hashPassword = bcrypt.hashSync(password, salt);
      let newUser = {
        id: id,
        email,
        password: hashPassword,
        fullName,
        img,
        isAdmin: 0,
      };

      try {
        let result = await userCollection.insertOne(newUser);
        console.log(result);

        // Generate JWT token
        const token = jwt.sign(
          { id: newUser.id, email: newUser.email, isAdmin: newUser.isAdmin },
          "secretkey",
          { expiresIn: "1h" }
        );

        res.status(200).json({ message: "Đăng ký thành công", token: token });
      } catch (error) {
        console.error(error);
        res.status(500).json({ message: "Lỗi khi thêm người dùng mới" });
      }
    }
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Internal Server Error" });
  }
});
// const jwt = require('jsonwebtoken');
//  // Import bcrypt for password comparison
// function authenToken(req, res, next) {
//   const bearerHeader = req.headers['authorization'];
//   if (typeof bearerHeader !== 'undefined') {
//     const bearerToken = bearerHeader.split(' ')[1];
//     req.token = bearerToken;
//     jwt.verify(req.token, 'secretkey', (err, authData) => {
//       if (err) {
//         res.status(403).json({ message: "Không có quyền truy cập" });
//       } else {
//         req.authData = authData;
//         next();
//       }
//     });
//   } else {
//     res.status(403).json({ message: "Không có quyền truy cập" });
//   }
// }
// router.get('/some-protected-route', authenToken, (req, res) => {
//   res.json({ message: "This is a protected route", user: req.authData });
// });

// Edit a user
router.put("/users/:id", upload.single("img"), async (req, res) => {
  try {
    const id = req.params.id;
    let img = "";
    if (req.file) {
      img = req.file.filename;
    }

    const db = await connectDb();
    const userCollection = db.collection("users");
    const { fullName, email, isAdmin } = req.body;

    const user = await userCollection.findOne({ id: parseInt(id) });
    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    const editUser = { fullName, email, isAdmin };
    if (img !== "") {
      editUser.img = img;
    }

    await userCollection.updateOne({ id: parseInt(id) }, { $set: editUser });

    res.status(200).json(editUser);
  } catch (error) {
    console.error("Error editing user:", error);
    res.status(500).json({ message: "Internal server error" });
  }
});

module.exports = router;
