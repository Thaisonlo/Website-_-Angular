const html = document.getElementById('showCart');
;
const showCart = () => {
    let products = JSON.parse(localStorage.getItem("cart"));
    if (!products || products.length === 0) {
        html.innerHTML = "<h2>Giỏ hàng của bạn đang trống óoo, thêm sản phẩm i nè.</h2>";
        return;
    }
    const cartHTML = products.map((product) => {
        return `
        <tr>
            <td class="product__cart__item" id="${product.id}">
                <div class="product__cart__item__pic">
                    <img style="width: 150px;" src="http://localhost:3000/images/${product.img}" alt="">
                    <div class="product__cart__item__text">
                        <h6>${product.name}</h6>
                        <h5 class="product-price">${product.price}</h5>
                    </div>
                </div>
            </td>
            <td class="quantity__item">
                <div class="quantity">
                    <button class="quantity-btn decrease-btn" data-product-id="${product.id}">-</button>
                    <input type="text" class="quantity-input" value="${product.quantity}" disabled>
                    <button class="quantity-btn increase-btn" data-product-id="${product.id}">+</button>
                </div>
            </td>
            <td class="cart__price" data-product-id="${product.id}">${(product.price * product.quantity).toLocaleString('vi-VN', { style: 'currency', currency: 'VND' })}</td>
            <td class="cart__close"><i class="fa fa-close" data-product-id="${product.id}"></i></td>
        </tr>
        `;
    });
    html.innerHTML = cartHTML.join('');
};
showCart();
const quantityButtons = document.querySelectorAll('.quantity-btn');
quantityButtons.forEach(button => {
    button.addEventListener('click', (event) => {
        var _a;
        const target = event.target;
        const productId = target.getAttribute('data-product-id');
        const input = (_a = target.parentElement) === null || _a === void 0 ? void 0 : _a.querySelector('.quantity-input');
        if (!input)
            return;
        let quantity = parseInt(input.value);
        if (button.classList.contains('decrease-btn')) {
            if (quantity > 1) {
                quantity--;
            }
            else {
                removeProduct(productId);
                return;
            }
        }
        else {
            quantity++;
        }
        input.value = quantity.toString();
        updateQuantity(productId, quantity);
        updateProductPrice(productId, quantity);
        displayTotal();
    });
});
function updateQuantity(productId, quantity) {
    let products = JSON.parse(localStorage.getItem("cart"));
    const updatedProducts = products.map(product => {
        if (product.id === productId) {
            product.quantity = quantity;
        }
        return product;
    });
    localStorage.setItem("cart", JSON.stringify(updatedProducts));
}
function updateProductPrice(productId, quantity) {
    const productPriceElement = document.querySelector(`.cart__price[data-product-id="${productId}"]`);
    if (!productPriceElement)
        return;
    let products = JSON.parse(localStorage.getItem("cart"));
    const product = products.find(product => product.id === productId);
    if (!product)
        return;
    productPriceElement.textContent = (product.price * product.quantity).toLocaleString('vi-VN', { style: 'currency', currency: 'VND' });
}
const closeButtons = document.querySelectorAll('.cart__close i');
closeButtons.forEach(button => {
    button.addEventListener('click', () => {
        const productId = button.getAttribute('data-product-id');
        removeProduct(productId);
    });
});
const removeProduct = (productId) => {
    const confirmModal = document.getElementById('confirmModal');
    confirmModal.style.display = 'block';
    console.log('Removing product with ID:', productId);
    const confirmYes = document.getElementById('confirmYes');
    confirmYes.onclick = () => {
        let products = JSON.parse(localStorage.getItem("cart"));
        console.log('Current cart:', products);
        const updatedProducts = products.filter(product => product.id !== productId);
        localStorage.setItem("cart", JSON.stringify(updatedProducts));
        showCart();
        displayTotal();
        confirmModal.style.display = 'none';
    };
    const confirmNo = document.getElementById('confirmNo');
    confirmNo.onclick = () => {
        confirmModal.style.display = 'none';
    };
};
const calculateTotal = () => {
    let products = JSON.parse(localStorage.getItem("cart"));
    let totalSub = 100000;
    let totalPrice = 0;
    products.forEach(product => {
        totalPrice += product.price * product.quantity;
    });
    totalPrice += totalSub;
    const formattedTotalSub = totalSub.toLocaleString('vi-VN', { style: 'currency', currency: 'VND' });
    const formattedTotalPrice = totalPrice.toLocaleString('vi-VN', { style: 'currency', currency: 'VND' });
    return { totalSub: formattedTotalSub, totalPrice: formattedTotalPrice };
};
const displayTotal = () => {
    const totalElement = document.querySelector('.cart__total ul');
    const totalPriceElement = totalElement.querySelector('li:nth-child(2) span');
    const totalSubPriceElement = totalElement.querySelector('li:nth-child(1) span');
    const { totalSub, totalPrice } = calculateTotal();
    totalPriceElement.textContent = totalPrice;
    totalSubPriceElement.textContent = totalSub;
};
displayTotal();
const getCurrentUser = () => {
    return JSON.parse(localStorage.getItem('currentUser'));
};
const checkoutButton = document.querySelector('.primary-btn');
checkoutButton.addEventListener('click', () => {
    const currentUser = getCurrentUser();
    const products = JSON.parse(localStorage.getItem("cart"));
    const queryString = products.map(product => `${product.name}=${product.quantity}`).join('&');
    localStorage.setItem("cartNew", JSON.stringify(products));
    window.location.href = `checkout.html?${queryString}`;
});
