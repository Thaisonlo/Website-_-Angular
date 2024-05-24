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
import { Categories } from "../models/category.js";
const urlCategories = url + 'DanhMuc/';
const getAllCategories = () => __awaiter(void 0, void 0, void 0, function* () {
    const data = yield fetchAPI(urlCategories);
    showCategories(data);
    console.log('Categories', data);
});
const showCategories = (data) => {
    const tablebody = document.getElementById('table-body-cate');
    tablebody.innerHTML = data.map((category, index) => {
        return `
      <tr>
          <td>${index + 1}</td>
          <td>${category.Anh}</td>
          <td>${category.TenDanhMuc}</td>
          <td>
              <button class="btn btn-sm btn-primary" name="edit" id=${category.id}>Edit</button>
              <button class="btn btn-sm btn-primary" name="remove" id=${category.id}>Remove</button>
          </td>
      </tr>
      `;
    }).join('');
};
const getProductsByCatalogId = (catalogid) => __awaiter(void 0, void 0, void 0, function* () {
    const urlProCataId = urlCategories + '?MaDanhMuc=' + catalogid;
    const data = yield fetchAPI(urlProCataId);
    showCategories(data);
});
const getCategoryById = (id) => __awaiter(void 0, void 0, void 0, function* () {
    const urlProCataId = urlCategories + id;
    const data = yield fetchAPI(urlProCataId);
    return data;
});
const removeCategories = (id) => __awaiter(void 0, void 0, void 0, function* () {
    const urlProduct_id = urlCategories + id;
    const option = {
        method: 'DELETE',
        headers: {
            'Content-Type': 'application/json'
        },
    };
    yield fetchAPI(urlProduct_id, option);
    getAllCategories();
});
const submitForm = () => {
    const hiddentId = document.getElementById("id").value;
    if (hiddentId == "") {
        addNewCategory();
    }
    else {
        updateCategory(hiddentId);
    }
};
const addNewCategory = () => __awaiter(void 0, void 0, void 0, function* () {
    const TenDanhMuc = document.getElementById("TenDanhMuc").value;
    const category = new Categories(TenDanhMuc);
    const option = {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify(category)
    };
    yield fetchAPI(urlCategories, option);
    getAllCategories();
});
const updateCategory = (id) => __awaiter(void 0, void 0, void 0, function* () {
    const TenDanhMuc = document.getElementById("TenDanhMuc").value;
    const category = new Categories(TenDanhMuc);
    const urlEdit = urlCategories + id;
    const option = {
        method: 'PUT',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify(category)
    };
    yield fetchAPI(urlEdit, option);
    getAllCategories();
});
const loadCategory = (id) => __awaiter(void 0, void 0, void 0, function* () {
    const data = yield getCategoryById(id);
    console.log(data);
    document.getElementById("TenDanhMuc").value = data.TenDanhMuc;
    document.getElementById("id").value = data.id;
});
window.addEventListener('click', e => {
    const elementName = e.target.name;
    const elementId = e.target.id;
    console.log(elementId);
    switch (elementName) {
        case 'edit':
            loadCategory(elementId);
            break;
        case 'remove':
            removeCategories(elementId);
            break;
        case 'btnSubmit':
            submitForm();
            break;
        default:
            break;
    }
});
getAllCategories();
