var express = require('express');
var router = express.Router();

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

// const  products = [
//     { id: 1, name: "product 1", price: 100, categoryId: 1,img: "1.jpg", description: "Description 1"},
//     { id: 2, name: "product 2", price: 200, categoryId: 2,img: "1.jpg", description: "Description 2"},
//     { id: 3, name: "product 3", price: 300, categoryId: 3,img: "1.jpg", description: "Description 3"},
//     { id: 4, name: "product 4", price: 400, categoryId: 1,img: "1.jpg", description: "Description 4"},
//     { id: 5, name: "product 5", price: 500, categoryId: 2,img: "1.jpg", description: "Description 5"},
//     { id: 6, name: "product 6", price: 600, categoryId: 3,img: "1.jpg", description: "Description 6"}
// ];


const connectDb = require('../models/db');
/* Show trang sản phẩm. */
router.get('/', async(req, res, next) => {
    const db = await connectDb();
    const productCollection = db.collection('products');
    const products = await productCollection.find().toArray();
    res.render('product', {products});
});
 

/* GET products add page. */
router.get('/add', function(req, res, next) {
    res.render('addPro');
});

    
//Post để thêm sản phẩm từ form
router.post('/add',upload.single('img'),async(req, res, next) => {
    let {name, price, categoryId, description}=req.body;
    let img = req.file ? req.file.originalname : null;
    const db = await connectDb();
    const productCollection = db.collection('products');
    //Lay san pham co id cao nhat bang cach sap xep giam dan (-1) va lay 1 phan tu
    let lastProducts = await productCollection.find().sort({id:-1}).limit(1).toArray();
    //Kiem tra xem co lastProduct hay khong, neu co thi id+1, khong co san pham nao thi id=1
    let id = lastProducts[0] ? lastProducts[0].id + 1 : 1;
    let newProduct = {id, name, price, categoryId, img, description};
    await productCollection.insertOne(newProduct);
    res.redirect('/products');
});

    //Get trang sửa sản phẩm
    router.get('/edit/:id', async(req, res, next)=> {
    const db=await connectDb();
    const productsCollection =db.collection('products');
    const id=req.params.id;
    const product= await productsCollection.findOne({id:parseInt(id)});
    res.render('editPro', {product});
    });

    //Post sửa sản phẩm từ form
    router.post('/edit', upload.single('img'), async(req, res, next)=>{
    const db=await connectDb();
    const productsCollection =db.collection('products');
    let {id, name, price, categoryId, description} = req.body;
    let img = req.file? req.file.originalname: req.body.imgOld;
    let editProduct={name,price, categoryId, img, description};
    await productsCollection.updateOne({id:parseInt(id)}, {$set:editProduct}); res.redirect('/products');
    })

    //Xóa sản phẩm
    router.get('/delete/:id', async(req, res)=>{    
        let id=req.params.id;
        const db=await connectDb();
        const productsCollection =db.collection('products');
        await productsCollection.deleteOne({id:parseInt(id)});
        res.redirect('/products');
        });
        
//     router.get('/:id', (req, res, next) => {
//         let id = req.params.id;
//         let product = products.find(p => p.id == id);
//         if(product){
//             res.send(`
//             <h1>${product.name}</h1>
//             <p>${product.price}</p>
//             <img src="../images/${product.img}" width="200px">
//             <p>${product.description}</p>
//             `);
//         }else{
//             res.send("không tìm thấy sản phẩm");
//         }
//     });

module.exports = router;

