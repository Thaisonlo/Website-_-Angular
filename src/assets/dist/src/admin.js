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
import { Product } from "../models/product.js";
const urlProduct = url + 'products/';
const getAllProducts = () => __awaiter(void 0, void 0, void 0, function* () {
    const data = yield fetchAPI(urlProduct);
    showProducts(data);
    console.log('Products', data);
});
const showProducts = (data) => {
    const tablebody = document.getElementById('table-body');
    tablebody.innerHTML = data.map((product, index) => {
        return `
        <tr>
            <td>${index + 1}</td>
            <td>${product.Anh}</td>
            <td>${product.MaDanhMuc}</td>
            <td>${product.TenSanPham}</td>
            <td>${product.Gia}</td>
            <td>${product.MoTa}</td>
            <td>
                <button class="btn btn-sm btn-primary" name="edit" id=${product.id}>Edit</button>
                <button class="btn btn-sm btn-primary" name="remove" id=${product.id}>Remove</button>
            </td>
        </tr>
        `;
    }).join('');
};
const getProductsByCatalogId = (catalogid) => __awaiter(void 0, void 0, void 0, function* () {
    const urlProCataId = urlProduct + '?MaDanhMuc=' + catalogid;
    const data = yield fetchAPI(urlProCataId);
    showProducts(data);
});
const getProductById = (id) => __awaiter(void 0, void 0, void 0, function* () {
    const urlProCataId = urlProduct + id;
    const data = yield fetchAPI(urlProCataId);
    return data;
});
const removeProduct = (id) => __awaiter(void 0, void 0, void 0, function* () {
    const urlProduct_id = urlProduct + id;
    const option = {
        method: 'DELETE',
        headers: {
            'Content-Type': 'application/json'
        },
    };
    yield fetchAPI(urlProduct_id, option);
    getAllProducts();
});
const submitForm = () => {
    const hiddentId = document.getElementById("id").value;
    if (hiddentId == "") {
        addNewProduct();
    }
    else {
        updateProduct(hiddentId);
    }
};
const addNewProduct = () => __awaiter(void 0, void 0, void 0, function* () {
    const TenSanPham = document.getElementById("TenSanPham").value;
    const Gia = parseFloat(document.getElementById("Gia").value);
    const MaDanhMuc = document.getElementById("MaDanhMuc").value;
    const MoTa = document.getElementById("MoTa").value;
    const product = new Product(TenSanPham, Gia, MaDanhMuc, MoTa);
    const option = {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify(product)
    };
    yield fetchAPI(urlProduct, option);
    getAllProducts();
});
const updateProduct = (id) => __awaiter(void 0, void 0, void 0, function* () {
    const TenSanPham = document.getElementById("TenSanPham").value;
    const Gia = parseFloat(document.getElementById("Gia").value);
    const MaDanhMuc = document.getElementById("MaDanhMuc").value;
    const MoTa = document.getElementById("MoTa").value;
    const product = new Product(TenSanPham, Gia, MaDanhMuc, MoTa);
    const urlEdit = urlProduct + id;
    const option = {
        method: 'PUT',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify(product)
    };
    yield fetchAPI(urlEdit, option);
    getAllProducts();
});
const loadProduct = (id) => __awaiter(void 0, void 0, void 0, function* () {
    const data = yield getProductById(id);
    console.log(data);
    document.getElementById("TenSanPham").value = data.TenSanPham;
    document.getElementById("Gia").value = data.Gia;
    document.getElementById("MaDanhMuc").value = data.MaDanhMuc;
    document.getElementById("MoTa").value = data.MoTa;
    document.getElementById("id").value = data.id;
});
window.addEventListener('click', e => {
    const elementName = e.target.name;
    const elementId = e.target.id;
    console.log(elementId);
    switch (elementName) {
        case 'edit':
            loadProduct(elementId);
            break;
        case 'remove':
            removeProduct(elementId);
            break;
        case 'btnSubmit':
            submitForm();
            break;
        default:
            break;
    }
});
getAllProducts();
