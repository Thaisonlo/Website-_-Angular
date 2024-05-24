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
const urlCategory = url + "categories/";
function showProductDetailById() {
    const id = window.location.href.split("id=")[1];
    const detail = document.querySelector("#detail");
    fetch(`http://localhost:3000/api/products/${id}`)
        .then((response) => response.json())
        .then((data) => {
        detail.innerHTML += `
        <div class="col-lg-6 col-md-9">
                    <div class="tab-content">
                        <div class="tab-pane active" id="tabs-1" role="tabpanel">
                            <div class="product__details__pic__item">
                                <img src="http://localhost:3000/images/${data.img}" width="200px">
                            </div>
                        </div>
                    </div>
                </div>
                <div class="product__details__content">
                    <div class="container">
                        <div class="row d-flex justify-content-center">
                            <div class="col-lg-8">
                                <div class="product__details__text">
                                    <h4>${data.name}</h4>
                                    <div class="rating">
                                        <i class="fa fa-star"></i>
                                        <i class="fa fa-star"></i>
                                        <i class="fa fa-star"></i>
                                        <i class="fa fa-star"></i>
                                        <i class="fa fa-star-o"></i>
                                        <span> - 5 Đánh giá</span>
                                    </div>
                                    <h3>${data.price.toLocaleString("vi-VN", {
            style: "currency",
            currency: "VND",
        })}<span></span></h3>
                                    <p>${data.description}</p>
                                    <div class="product__details__cart__option">
                                        <div class="quantity">
                                            <div class="pro-qty">
                                                <input type="text" value="1">
                                            </div>
                                        </div>
                                        <a id=${data.id}  dataId=${data.categoryId} href="#" class="primary-btn">Thêm vào giỏ hàng</a>
                                    </div>
                                    <div class="product__details__btns__option">
                                        <a><i class="fa fa-heart"></i> Thêm vào danh sách yêu thích</a>
                                    </div>
                                    <div class="product__details__last__option">
                                        <img src="img/shop-details/details-payment.png" alt="">
                                        <ul>
                                            <li><span>Danh mục:</span> ${data.name}s</li>
                                        </ul>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
 `;
    })
        .catch((err) => console.log(err));
}
window.addEventListener("click", (e) => {
    const target = event.target;
    console.log(target);
    if (target.getAttribute("id") && target.getAttribute("dataId")) {
        console.log("oke");
        const id = target.getAttribute("id");
        const dataId = target.getAttribute("dataId");
        addCart(id, dataId);
    }
});
const addCart = (id, MaDanhMuc) => __awaiter(void 0, void 0, void 0, function* () {
    let cart = JSON.parse(localStorage.getItem("cart") || "[]");
    let data = yield fetchAPI(`${url}Products/${id}`);
    const existingProduct = cart.find((product) => product.id === data.id);
    if (existingProduct) {
        existingProduct.quantity += 1;
    }
    else {
        const product = {
            id: data.id,
            name: data.name,
            price: data.price,
            img: data.img,
            SoLuong: 1,
            quantity: 1,
        };
        cart.push(product);
    }
    localStorage.setItem("cart", JSON.stringify(cart));
    window.location.href = "shopping-cart.html";
});
showProductDetailById();
