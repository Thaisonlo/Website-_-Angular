export class Product {
    id:string;
    TenSanPham: String;
    Gia: number;
    MaDanhMuc: String;
    MoTa:string;
    tilegiamgia: number;

    constructor(TenSanPham:string, Gia:number, MaDanhMuc:string, MoTa:string = '', tilegiamgia: number = 0){
        this.TenSanPham = TenSanPham,
        this.Gia = Gia,
        this.MaDanhMuc = MaDanhMuc,
        this.MoTa = MoTa,
        this.tilegiamgia = tilegiamgia
    }

    getDiscount():number {
        return this.Gia * (1 - this.tilegiamgia);
    }
}

const product = new Product('Áo sơ mi', 250000, '2');
console.log(product.TenSanPham, product.Gia);