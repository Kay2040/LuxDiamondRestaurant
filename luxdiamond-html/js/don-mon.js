// ===== Khai báo =====
var oDanhSach = document.getElementById('ds-mon');
var oTongTien = document.getElementById('tong-tien');
var khoiTrong = document.getElementById('don-trong');
var khoiCoMon = document.getElementById('don-co-mon');
var oHinhThuc = document.getElementById('dm-hinhthuc');

function dinhDangTien(so) {
  return so.toString().replace(/\B(?=(\d{3})+(?!\d))/g, '.') + ' ₫';
}

// ===== Vẽ danh sách món =====
function veDon() {
  var danhSach = docDon();
  var tong = 0;
  oDanhSach.innerHTML = '';

  danhSach.forEach(function (mon, vitri) {
    tong += mon.gia * mon.sl;

    var dong = document.createElement('li');
    dong.className = 'don-row';
    dong.innerHTML =
      '<div class="don-name"><strong></strong><span></span></div>' +
      '<div class="qty"><button type="button" class="tru" aria-label="Giảm">−</button><span></span><button type="button" class="cong" aria-label="Tăng">+</button></div>' +
      '<span class="don-line"></span>' +
      '<button type="button" class="text-link danger xoa">Xóa</button>';

    dong.querySelector('strong').textContent = mon.ten;
    dong.querySelector('.don-name span').textContent = dinhDangTien(mon.gia);
    dong.querySelector('.qty span').textContent = mon.sl;
    dong.querySelector('.don-line').textContent = dinhDangTien(mon.gia * mon.sl);

    dong.querySelector('.cong').addEventListener('click', function () {
      if (mon.sl < SO_LUONG_TOI_DA) { mon.sl++; capNhat(danhSach); }
    });
    dong.querySelector('.tru').addEventListener('click', function () {
      if (mon.sl > 1) { mon.sl--; capNhat(danhSach); }
    });
    dong.querySelector('.xoa').addEventListener('click', function () {
      danhSach.splice(vitri, 1);
      capNhat(danhSach);
    });
    oDanhSach.appendChild(dong);
  });

  oTongTien.textContent = dinhDangTien(tong);
  khoiTrong.style.display = danhSach.length === 0 ? 'block' : 'none';
  khoiCoMon.style.display = danhSach.length === 0 ? 'none' : 'flex';
}

function capNhat(danhSach) {
  luuDon(danhSach);
  capNhatSoMon();
  veDon();
}

document.getElementById('xoa-het').addEventListener('click', function () {
  capNhat([]);
});

// ===== Hình thức nhận món =====
function doiHinhThuc() {
  var hinhThuc = oHinhThuc.value;
  var oDiaChi = document.getElementById('dm-diachi');
  document.getElementById('khoi-ban').style.display = hinhThuc === 'taicho' ? '' : 'none';
  document.getElementById('khoi-diachi').style.display = hinhThuc === 'giao' ? '' : 'none';
  oDiaChi.required = hinhThuc === 'giao';
  oDiaChi.disabled = hinhThuc !== 'giao';
}

oHinhThuc.addEventListener('change', doiHinhThuc);

// ===== Món đã đặt =====
var KHOA_DA_DAT = 'luxdiamond-don-da-dat';
var oDaDat = document.getElementById('don-da-dat');

function docDaDat() {
  try { return JSON.parse(localStorage.getItem(KHOA_DA_DAT)) || []; } catch (e) { return []; }
}

function luuDaDat(danhSach) {
  try { localStorage.setItem(KHOA_DA_DAT, JSON.stringify(danhSach)); } catch (e) { /* trình duyệt chặn lưu trữ */ }
}

function dinhDangGio(ngay) {
  function hai(n) { return ('0' + n).slice(-2); }
  return hai(ngay.getDate()) + '/' + hai(ngay.getMonth() + 1) + '/' + ngay.getFullYear() + ' ' + hai(ngay.getHours()) + ':' + hai(ngay.getMinutes());
}

function veDonDaDat() {
  var danhSach = docDaDat();
  oDaDat.innerHTML = '';

  if (danhSach.length === 0) {
    oDaDat.innerHTML = '<p class="notice">Chưa có đơn nào đã đặt.</p>';
    return;
  }

  danhSach.forEach(function (don) {
    var the = document.createElement('article');
    the.className = 'card order-card';
    the.innerHTML =
      '<header><div><strong></strong><span class="muted"></span></div><span class="status tone-warn">Chờ xác nhận</span></header>' +
      '<ol class="stepper"><li class="done">Chờ xác nhận</li><li>Đã xác nhận</li><li>Đang chế biến</li><li>Đã phục vụ</li><li>Hoàn thành</li></ol>' +
      '<ul class="order-items"></ul>' +
      '<p class="muted ghi-chu"></p>' +
      '<footer><span class="muted"></span><strong class="price price-lg"></strong></footer>';

    the.querySelector('strong').textContent = don.ma;
    the.querySelector('header .muted').textContent = ' · ' + don.gio + ' · ' + don.noiNhan;
    the.querySelector('footer .muted').textContent = don.thanhToan;
    the.querySelector('footer .price').textContent = dinhDangTien(don.tong);

    var oMon = the.querySelector('.order-items');
    don.mon.forEach(function (mon) {
      var dong = document.createElement('li');
      dong.innerHTML = '<span></span><span></span>';
      dong.children[0].textContent = mon.sl + ' × ' + mon.ten;
      dong.children[1].textContent = dinhDangTien(mon.gia * mon.sl);
      oMon.appendChild(dong);
    });

    var oGhiChu = the.querySelector('.ghi-chu');
    if (don.ghiChu) oGhiChu.textContent = 'Ghi chú: ' + don.ghiChu;
    else oGhiChu.remove();

    oDaDat.appendChild(the);
  });
}

// ===== Đặt món =====
document.getElementById('form-dat-mon').addEventListener('submit', function (e) {
  e.preventDefault();
  var danhSach = docDon();
  if (danhSach.length === 0) {
    alert('Đơn món đang trống, vui lòng chọn món ở trang Thực đơn.');
    return;
  }

  var noiNhan = 'Mang đi';
  if (oHinhThuc.value === 'taicho') noiNhan = 'Ăn tại chỗ, bàn ' + document.getElementById('dm-ban').value;
  if (oHinhThuc.value === 'giao') noiNhan = 'Giao tận nơi: ' + document.getElementById('dm-diachi').value;

  var tong = 0;
  danhSach.forEach(function (mon) { tong += mon.gia * mon.sl; });

  var daDat = docDaDat();
  daDat.unshift({
    ma: 'OD-' + String(Date.now()).slice(-6),
    gio: dinhDangGio(new Date()),
    noiNhan: noiNhan,
    thanhToan: document.getElementById('dm-thanhtoan').value,
    ghiChu: document.getElementById('dm-ghichu').value.trim(),
    tong: tong,
    mon: danhSach
  });
  luuDaDat(daDat);

  capNhat([]);
  e.target.reset();
  doiHinhThuc();
  veDonDaDat();
  oDaDat.scrollIntoView({ behavior: 'smooth' });
});

doiHinhThuc();
veDon();
veDonDaDat();