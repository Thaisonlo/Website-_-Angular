const express = require('express');
const router = express.Router();
const connectDb = require('../models/db');
const bcrypt = require('bcrypt');

// // Import thư viện multer
const multer = require('multer');
//Thiết lập nơi lưu trữ và tên file
let storage = multer.diskStorage({
 destination: function (req, file, cb) {
 cb(null, './public/images')
 },
 filename: function (req, file, cb) {
 cb(null, file.originalname)
 }
 })
//Kiểm tra file upload
function checkFileUpLoad(req, file, cb){
 if(!file.originalname.match(/\.(jpg|jpeg|png|gif)$/)){
 return cb(new Error('Bạn chỉ được upload file ảnh'));
 }
 cb(null, true);
}
//Upload file
let upload = multer({ storage: storage, fileFilter: checkFileUpLoad });


/* Show trang danh sách người dùng. */
router.get('/', async (req, res, next) => {
  try {
      const db = await connectDb();
      const usersCollection = db.collection('users');
      const users = await usersCollection.find().toArray();
      res.render('users', { users });
  } catch (error) {
      console.error("Error fetching users:", error);
      res.status(500).send("Internal Server Error");
  }
});


/* GET trang đăng ký user. */
router.get('/register', function(req, res, next) {
  res.render('register');
});

/* POST để đăng ký user từ form */
router.post('/register', upload.single('img'), async (req, res, next) => {
  let { username, password, repassword, email, role } = req.body;
  let img = req.file ? req.file.originalname : null;

  // Kiểm tra độ dài mật khẩu
  if(password.length < 8) {
      return res.status(400).send("Mật khẩu phải ít nhất 8 ký tự.");
  }

  // Mã hóa mật khẩu
  const hashedPassword = await bcrypt.hash(password, 10); // 10 là số vòng lặp bcrypt sẽ thực hiện, càng cao càng an toàn nhưng cũng càng tốn thời gian

  const db = await connectDb();
  const userCollection = db.collection('users');

  //Kiểm tra Email
  const existingUser = await userCollection.findOne({ email });
  if(existingUser) {
      return res.status(400).send("Email này đã được sử dụng. Vui lòng chọn email khác và thử lại.")
  }

  try {
      let lastUsers = await userCollection.find().sort({ id: -1 }).limit(1).toArray();
      let id = lastUsers[0] ? lastUsers[0].id + 1 : 1;
      let newUser = { id, username, password: hashedPassword, email, img, isAdmin: role === 'admin' }; // Mật khẩu đã được mã hóa
      await userCollection.insertOne(newUser);
      res.redirect('/users/login');
  } catch (error) {
      console.error("Error registering user:", error);
      res.status(500).send("Đã xảy ra lỗi trong quá trình đăng ký. Vui lòng thử lại sau.");
  }
});


// GET trang đăng nhập
router.get('/login', function(req, res, next) {
  res.render('login');
});

  // POST để xử lý đăng nhập
  router.post('/login', async (req, res, next) => {
    try {
        const { username, password } = req.body;
        const db = await connectDb();
        const userCollection = db.collection('users');
        const user = await userCollection.findOne({ username });
        if (!user) {
            return res.status(400).send('Tên đăng nhập không tồn tại');
        }

        // So sánh mật khẩu đã mã hóa
        const validPassword = await (password, user.password);
        if (!validPassword) {
            return res.status(400).send('Mật khẩu không chính xác');
        }
        //nếu đăng nhập với phân quyền là admin sẽ chuyển vào trang product.ejs
        

        // Nếu tên đăng nhập và mật khẩu đúng, chuyển hướng đến trang chính
        res.redirect('https://www.fahasa.com/');
    } catch (error) {
        console.error('Lỗi đăng nhập:', error);
        res.status(500).send('Lỗi máy chủ nội bộ');
    }
  });


//Get trang sửa người dùng
router.get('/edit/:id', async (req, res, next) => {
  try {
    const db = await connectDb();
    const userCollection = db.collection('users');
    const id = req.params.id;
    const user = await userCollection.findOne({ id: parseInt(id) });
    res.render('editUser', { user: user }); // Truyền biến user vào để render trang
  } catch (error) {
    console.error('Error:', error);
    res.status(500).send('Internal Server Error');
  }
});

//Post sửa người dùng từ form
router.post('/edit', upload.single('img'), async(req, res, next)=>{
  const db=await connectDb();
  const userCollection =db.collection('users');
  let {id, username, password, email, isAdmin} = req.body;
  let img = req.file? req.file.originalname: req.body.imgOld;
  // Chuyển đổi giá trị của isAdmin từ chuỗi sang boolean
  const isAdminBoolean = isAdmin === '1'; // Nếu giá trị isAdmin là '1' (admin), thì sẽ là true, ngược lại sẽ là false
  let editUsers={username, password, email, img,isAdmin: isAdminBoolean};
  await userCollection.updateOne({id:parseInt(id)}, {$set:editUsers}); 
  res.redirect('/users');
  })

//xóa người dùng
router.get('/delete/:id', async(req, res)=>{    
  let id=req.params.id;
  const db=await connectDb();
  const userCollection =db.collection('users');
  await userCollection.deleteOne({id:parseInt(id)});
  res.send(`<script>alert('Người dùng đã được xóa thành công'); window.location.href = '/users';</script>`);
  });

module.exports = router;