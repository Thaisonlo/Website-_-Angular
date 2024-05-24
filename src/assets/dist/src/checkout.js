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
import { Cart } from "../models/cart.js";
import { cart_detail } from "../models/cart_detail.js";
console.log("checkOut");
document.addEventListener("DOMContentLoaded", function () {
    const cartData = localStorage.getItem("cart");
    if (cartData) {
        const products = JSON.parse(cartData);
        const productListElement = document.querySelector('.checkout__total__products');
        let productListHTML = '';
        products.forEach((product, index) => {
            productListHTML += `
                <li>${index + 1}. ${product.name} <span>${product.price.toLocaleString('vi-VN', { style: 'currency', currency: 'VND' })}</span> <br>Số lượng: ${product.quantity}</li>
            `;
        });
        productListElement.innerHTML = productListHTML;
        const totalSub = products.reduce((total, product) => total + (product.price * product.quantity), 0);
        const totalPrice = totalSub;
        const totalSubPriceElement = document.querySelector('.checkout__total__all li:nth-child(1) span');
        const totalPriceElement = document.querySelector('.checkout__total__all li:nth-child(2) span');
        if (totalSubPriceElement && totalPriceElement) {
            totalSubPriceElement.textContent = totalSub.toLocaleString('vi-VN', { style: 'currency', currency: 'VND' });
            totalPriceElement.textContent = totalPrice.toLocaleString('vi-VN', { style: 'currency', currency: 'VND' });
        }
        const totalQuantityElement = document.querySelector('.checkout__total__all li:nth-child(3) span');
        const totalQuantity = products.reduce((total, product) => total + product.quantity, 0);
        if (totalQuantityElement) {
            totalQuantityElement.textContent = totalQuantity.toString();
        }
    }
});
export const checkOut = () => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const cartData = localStorage.getItem("cart");
        if (cartData) {
            const username = document.getElementById("username").value;
            const address = document.getElementById("address").value;
            const phone = document.getElementById("phone").value;
            const totalElement = document.getElementById("total");
            const total = totalElement ? parseFloat(totalElement.innerText) : 0;
            if (!username || !address || !phone) {
                alert("Vui lòng nhập đầy đủ thông tin của bạn trước khi thanh toán.");
                return;
            }
            const cartItem = new Cart(username, address, phone, total);
            const urlCart = url + 'GioHang';
            const option = {
                method: "post",
                headers: {
                    "content-type": "application/json"
                },
                body: JSON.stringify(cartItem)
            };
            const result = yield fetchAPI(urlCart, option);
            const orderId = result.id;
            let orderIds = JSON.parse(localStorage.getItem('orderIds')) || [];
            orderIds.push(orderId);
            localStorage.setItem('orderIds', JSON.stringify(orderIds));
            addCartDetail(orderId);
            localStorage.removeItem('cart');
            alert("Thanh toán thành công!");
            window.location.href = "index.html";
        }
        else {
            alert("Không có sản phẩm nào trong giỏ hàng để thanh toán.");
        }
    }
    catch (error) {
        console.error("Lỗi khi thanh toán:", error);
    }
});
const saveCartToLocalStorage = (cartData) => {
    localStorage.setItem("cart", JSON.stringify(cartData));
};
const addCartDetail = (cart_id) => __awaiter(void 0, void 0, void 0, function* () {
    const cartData = localStorage.getItem('cart');
    const cartItems = JSON.parse(cartData);
    if (!cartItems) {
        console.error("Không tìm thấy giỏ hàng trong LocalStorage.");
        return;
    }
    const cartDetails = [];
    for (let i = 0; i < cartItems.length; i++) {
        const { product_id, price, quantity } = cartItems[i];
        const detail = new cart_detail(cart_id, product_id, price, quantity);
        cartDetails.push(detail);
    }
    const urlCartDetail = url + 'ThongTinGioHang';
    const options = {
        method: "POST",
        headers: {
            "Content-Type": "application/json"
        },
        body: JSON.stringify(cartDetails)
    };
    try {
        const response = yield fetch(urlCartDetail, options);
        if (!response.ok) {
            throw new Error(`HTTP error! status: ${response.status}`);
        }
        console.log("Chi tiết đơn hàng đã được thêm vào cơ sở dữ liệu.");
    }
    catch (error) {
        console.error("Lỗi khi thêm chi tiết đơn hàng:", error);
    }
});
let orderIds = JSON.parse(localStorage.getItem('orderIds')) || [];
const displayOrderDetails = () => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const cartData = localStorage.getItem("cartNew");
        if (!cartData) {
            console.error("Không tìm thấy giỏ hàng mới trong LocalStorage.");
            return;
        }
        const cartItems = JSON.parse(cartData);
        let totalOrderPrice = 0;
        for (let i = 0; i < cartItems.length; i++) {
            const { TenSanPham, id, Gia, quantity } = cartItems[i];
            const total = Gia * quantity;
            totalOrderPrice += total;
            const orderHTML = `
                <div class="order">
                    <h2>Sản phẩm ${i + 1}</h2>
                    <p>Sản phẩm: ${TenSanPham}</p>
                    <p>ID: ${id}</p>
                    <p>Giá: ${Gia.toLocaleString('vi-VN', { style: 'currency', currency: 'VND' })}</p>
                    <p>Số lượng: ${quantity}</p>
                    <p>Tổng tiền: ${total.toLocaleString('vi-VN', { style: 'currency', currency: 'VND' })}</p>
                </div>
            `;
            const orderListElement = document.querySelector('#orderItemList');
            orderListElement.innerHTML += orderHTML;
        }
        document.getElementById("total").innerText = totalOrderPrice.toLocaleString('vi-VN', { style: 'currency', currency: 'VND' });
    }
    catch (error) {
        console.error("Lỗi khi hiển thị thông tin đơn hàng:", error);
    }
});
document.addEventListener("DOMContentLoaded", displayOrderDetails);
document.addEventListener("DOMContentLoaded", function () {
    const viewOrderDetailsBtn = document.getElementById("viewOrderDetailsBtn");
    if (viewOrderDetailsBtn) {
        viewOrderDetailsBtn.addEventListener("click", function () {
            window.location.href = "order-details.html";
        });
    }
});
const orderId = localStorage.getItem("cartNew");
const fetchOrderDetails = (orderId) => __awaiter(void 0, void 0, void 0, function* () {
    const urlOrderDetails = url + `GioHang/${orderId}`;
    try {
        const response = yield fetch(urlOrderDetails);
        const data = yield response.json();
        return data;
    }
    catch (error) {
        console.error("Lỗi khi lấy thông tin đơn hàng:", error);
    }
});
document.addEventListener("DOMContentLoaded", function () {
    return __awaiter(this, void 0, void 0, function* () {
        const orderDetails = yield fetchOrderDetails(orderId);
        if (orderDetails) {
            document.getElementById("customerName").innerText = orderDetails.username;
            document.getElementById("customerAddress").innerText = orderDetails.address;
            document.getElementById("customerPhone").innerText = orderDetails.phone;
            document.getElementById("total").innerText = orderDetails.total.toLocaleString('vi-VN', { style: 'currency', currency: 'VND' });
        }
    });
});
const getCurrentUser = () => {
    return JSON.parse(localStorage.getItem('token'));
};
document.addEventListener("DOMContentLoaded", function () {
    const currentUser = getCurrentUser();
    if (currentUser) {
        document.getElementById('customerName').innerText = currentUser.TenKhachHang;
        document.getElementById('email').innerText = currentUser.Email;
        document.getElementById('customerId').innerText = currentUser.id;
    }
    else {
        console.error("Không tìm thấy thông tin người dùng.");
    }
});
