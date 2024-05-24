export class Product {
    constructor(TenSanPham, Gia, MaDanhMuc, MoTa = '', tilegiamgia = 0) {
        this.TenSanPham = TenSanPham,
            this.Gia = Gia,
            this.MaDanhMuc = MaDanhMuc,
            this.MoTa = MoTa,
            this.tilegiamgia = tilegiamgia;
    }
    getDiscount() {
        return this.Gia * (1 - this.tilegiamgia);
    }
}
const product = new Product('Áo sơ mi', 250000, '2');
console.log(product.TenSanPham, product.Gia);
