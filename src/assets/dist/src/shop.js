var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
import { url, fetchAPI } from '../src/app.js';
const itemsPerPage = 6;
const urlProduct = url + 'Products/';
const getAllProducts = () => __awaiter(void 0, void 0, void 0, function* () {
    const data = yield fetchAPI(urlProduct);
    showProducts(data);
});
export const showProducts = (data) => {
    const html = document.getElementById('showProduct1');
    if (Array.isArray(data)) {
        html.innerHTML = data.map(pro => {
            return `
             <div class="col-lg-4 col-md-6 col-sm-6">
            <div class="product__item">
                <div class="product__item__pic set-bg" data-setbg="${pro.id}">
                <img style="height: 250px;" src="http://localhost:3000/images/${pro.img}" alt="">
                    <ul class="product__hover">
                        <li><a href="#"><img src="img/icon/heart.png" alt=""></a></li>
                        <li><a href="#"><img src="img/icon/compare.png" alt=""> <span>Compare</span></a>
                        </li>
                        <li><a href="#"><img src="img/icon/search.png" alt=""></a></li>
                    </ul>
                </div>
                <div class="product__item__text">
                    <h6>${pro.name}</h6>
                    <a id=${pro.id} dataId=${pro.id} href="#" class="add-cart">+ Thêm vào giỏ hàng</a>
                    <div class="rating">
                        <i class="fa fa-star-o"></i>
                        <i class="fa fa-star-o"></i>
                        <i class="fa fa-star-o"></i>
                        <i class="fa fa-star-o"></i>
                        <i class="fa fa-star-o"></i>
                    </div>
                    <h5>${pro.price.toLocaleString('vi-VN', { style: 'currency', currency: 'VND' })}</h5>
                    <div class="product__color__select">
                        <label for="pc-4">
                            <input type="radio" id="pc-4">
                        </label>
                        <label class="active black" for="pc-5">
                            <input type="radio" id="pc-5">
                        </label>
                        <label class="grey" for="pc-${pro.id}">
                            <input type="radio" id="pc-${pro.id}">
                        </label>
                    </div>
                </div>
            </div>
        </div>
            `;
        }).join('');
    }
    else {
        console.error('Data is not an array');
    }
};
export const getProductBycateId = (...args_1) => __awaiter(void 0, [...args_1], void 0, function* (cateId = '') {
    const urlProductByCateId = cateId === '' ? urlProduct : urlProduct + `?MaDanhMuc=${cateId}`;
    const data = yield fetchAPI(urlProductByCateId);
    return showProducts(data);
});
function showProductDetailById(productId) {
    return __awaiter(this, void 0, void 0, function* () {
        const urlProduct = url + 'Products/' + productId;
        const product = yield fetchAPI(urlProduct);
        localStorage.setItem("product", JSON.stringify(product));
        window.location.href = "shop-details.html";
    });
}
document.addEventListener('click', (event) => {
    const target = event.target;
    console.log("target", target);
    const div = target.parentElement;
    console.log("div", div);
    if (div.getAttribute('data-setbg')) {
        const id = div.getAttribute('data-setbg');
        showProductDetailById(id);
    }
});
getAllProducts();
window.addEventListener('click', e => {
    const target = event.target;
    console.log(target);
    if (target.getAttribute('id') && target.getAttribute('dataId')) {
        console.log("oke");
        const id = target.getAttribute('id');
        const dataId = target.getAttribute('dataId');
        addCart(id, dataId);
    }
});
const addCart = (id, MaDanhMuc) => __awaiter(void 0, void 0, void 0, function* () {
    let cart = JSON.parse(localStorage.getItem('cart') || '[]');
    let data = yield fetchAPI(`${url}Products/${id}`);
    const existingProduct = cart.find((product) => product.id === data.id);
    if (existingProduct) {
        existingProduct.quantity += 1;
    }
    else {
        const product = {
            id: data.id,
            TenSanPham: data.TenSanPham,
            Gia: data.Gia,
            Anh: data.Anh,
            SoLuong: 1,
            quantity: 1
        };
        cart.push(product);
    }
    localStorage.setItem("cart", JSON.stringify(cart));
});
