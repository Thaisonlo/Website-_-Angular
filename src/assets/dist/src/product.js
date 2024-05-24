import { url } from '../src/app.js';
export const urlProducts = url + 'Products/';
const hot = document.getElementById('hot');
console.log(hot);
fetch('http://localhost:3000/api/producthot', {
    headers: {
        'Authorization': 'Bearer ' + localStorage.getItem('token')
    }
})
    .then(response => response.json())
    .then(data => {
    data.forEach(productHot => {
        hot.innerHTML += `
            <div style = "margin-top: -200px; margin-bottom: 100px;" class="col-lg-4 col-md-6 col-sm-6">
                <div class="blog__item">
                    <div class="blog__item__pic set-bg" data-setbg="img/blog/blog-1.jpg"></div>
                    <div class="blog__item__text">
                        <span><img src="http://localhost:3000/images/${productHot.img}" height="300px"></span>
                        <h5>${productHot.name}</h5>
                        <a href="#">Xem thêm</a>
                    </div>
                </div>
            </div>
            `;
    });
})
    .catch(err => console.log(err));
