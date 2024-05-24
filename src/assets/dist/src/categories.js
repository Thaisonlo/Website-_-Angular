var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
import { url, fetchAPI } from "../src/app.js";
import { showProducts } from "../src/shop.js";
const urlCategory = url + 'categories/';
const urlProduct = url + 'Products/';
const getCategories = () => __awaiter(void 0, void 0, void 0, function* () {
    const option = {
        method: 'get',
        headers: {
            "Content-Type": "application/json",
        }
    };
    const data = yield fetchAPI(urlCategory, option);
    showCategories(data);
    return data;
});
const showCategories = (data) => {
    console.log('categories', data);
    const HTMLElement = document.getElementById('categories');
    HTMLElement.innerHTML = `
        <div class="col-lg-7 offset-lg-4">
        <div class="banner__item">
            <div class="banner__item__pic">
                <img src="../img/${data[0].img}" alt="">
            </div>
            <div class="banner__item__text">
                <h2>${data[0].TenDanhMuc}</h2>
                <a href="#">Mua ngay</a>
            </div>
        </div>
    </div>

    <div class="col-lg-5">
        <div class="banner__item banner__item--middle">
            <div class="banner__item__pic">
                <img src="../img/${data[1].Anh}" alt="">
            </div>
                <div class="banner__item__text">
                <h2>${data[1].TenDanhMuc}</h2>
                <a href="#">Mua ngay</a>
            </div>
        </div>
    </div>

    <div class="col-lg-7">
        <div class="banner__item banner__item--last">
            <div class="banner__item__pic">
                <img src="../img/${data[2].Anh}" alt="">
            </div>
            <div class="banner__item__text">
                <h2>${data[2].TenDanhMuc}</h2>
                <a href="#">Mua ngay</a>
            </div>
        </div>
    </div>
    `;
};
const getAllDanhmuc = () => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const data = yield fetchAPI(urlCategory);
        showDanhmuc(data);
    }
    catch (error) {
        console.error('Error fetching categories:', error);
    }
});
const showDanhmuc = (data) => __awaiter(void 0, void 0, void 0, function* () {
    const htmlElement = document.getElementById('loadDm');
    if (!htmlElement)
        return;
    htmlElement.innerHTML = data.map((item) => {
        return `
        <button id="${item.id}" class="category-button" data-filter=".new-arrivals">
            <img style="width:30px;" src="http://localhost:3000/images/${item.img}" alt="${item.name}" style="width: 150px; height: 100px;">
            <span>${item.name}</span>
        </button>`;
    }).join('');
    const buttons = document.querySelectorAll('.category-button');
    buttons.forEach(button => {
        button.addEventListener('click', () => {
            const categoryId = button.id;
            locDanhmuc(parseInt(categoryId));
        });
    });
});
const buttons = document.querySelectorAll('.category-button');
buttons.forEach(button => {
    button.addEventListener('click', () => {
        const categoryId = button.id;
        locDanhmuc(parseInt(categoryId));
    });
});
const locDanhmuc = (id) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const data = yield fetchAPI(urlProduct);
        if (id === -1) {
            showHome(data);
        }
        else {
            const filtered = data.filter(product => product.categoryId === id);
            showHome(filtered);
        }
    }
    catch (error) {
        console.error('Error filtering products:', error);
    }
});
const showHome = (data) => __awaiter(void 0, void 0, void 0, function* () {
    const productContainer = document.getElementById('showPro');
    if (!productContainer)
        return;
    productContainer.innerHTML = '';
    data.forEach(pro => {
        productContainer.innerHTML += `
        <div class="col-lg-3 col-md-6 col-sm-6 col-md-6 col-sm-6 mix new-arrivals">
        <div class="product__item">
            <div class="product__item__pic set-bg">
            <a href="./shop-details.html?id=${pro.id}"> <img src="http://localhost:3000/images/${pro.img}" height="200px">
            <span class="label">Mới</span><a>
            
                <ul class="product__hover">
                    <li><a href="#"><img src="img/icon/heart.png" alt=""></a></li>
                    <li><a href="#"><img src="img/icon/compare.png" alt=""> <span>Compare</span></a></li>
                    <li><a href="#"><img src="img/icon/search.png" alt=""></a></li>
                </ul>
            </div>
            <div class="product__item__text">
                <h6>${pro.name}</h6>
                <a href="#" class="add-cart">+ Thêm vào giỏ hàng</a>
                <div class="rating">
                    <i class="fa fa-star-o"></i>
                    <i class="fa fa-star-o"></i>
                    <i class="fa fa-star-o"></i>
                    <i class="fa fa-star-o"></i>
                    <i class="fa fa-star-o"></i>
                </div>
                <h5>${pro.price.toLocaleString('vi-VN', { style: 'currency', currency: 'VND' })}</h5>
                <div class="product__color__select">    
                    <label for="pc-${pro.id}">
                        <input type="radio" id="pc-${pro.id}">
                    </label>
                    <!-- Add more color options if needed -->
                </div>
            </div>
        </div>
    </div>
        `;
    });
});
const showCategoriesShop = (data) => __awaiter(void 0, void 0, void 0, function* () {
    const HTMLElement = document.getElementById('categoriesShop');
    if (!HTMLElement)
        return;
    HTMLElement.innerHTML = data.map((cat) => {
        return `
            <a id="${cat.id}">${cat.name}</a>
        `;
    }).join('');
});
window.addEventListener('click', e => {
    const target = event.target;
    if (target.getAttribute('id')) {
        const id = target.getAttribute('id');
        locCate(+id);
    }
});
const getAllDanhmucForShop = () => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const data = yield fetchAPI(urlCategory);
        showCategoriesShop(data);
    }
    catch (error) {
        console.error('Error fetching categories:', error);
    }
});
const locCate = (id) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const data = yield fetchAPI(urlProduct);
        const filters = data.filter(product => product.categoryId == id);
        console.log(filters);
        showProducts(filters);
    }
    catch (error) {
        console.error('Error filtering products:', error);
    }
});
getAllDanhmucForShop();
getAllDanhmuc();
