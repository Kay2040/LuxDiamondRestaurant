


var nutMenu = document.querySelector('.menu-toggle');
var danhSachMenu = document.getElementById('main-nav') || document.querySelector('.admin-side');

if (nutMenu && danhSachMenu) {
  nutMenu.addEventListener('click', function () {
    danhSachMenu.classList.toggle('open');
  });
}


var thongBao = 'Đây là giao diện mẫu, chức năng này chưa hoạt động.';

document.querySelectorAll('[data-demo]').forEach(function (nut) {
  nut.addEventListener('click', function (e) {
    e.preventDefault();
    alert(thongBao);
  });
});


document.querySelectorAll('form.demo-form').forEach(function (bieuMau) {
  bieuMau.addEventListener('submit', function (e) {
    e.preventDefault();
    alert(thongBao);
  });
});
function thongBaoLoi(o, noiDung) {
  o.addEventListener('invalid', function () {
    if (o.validity.valueMissing) o.setCustomValidity('Vui lòng nhập thông tin này.');
    else if (o.validity.patternMismatch || o.validity.typeMismatch) o.setCustomValidity(noiDung);
  });
  o.addEventListener('input', function () { o.setCustomValidity(''); });
}

// Số điện thoại: chỉ nhập số, đủ 10 số
document.querySelectorAll('input[type="tel"]').forEach(function (o) {
  o.setAttribute('inputmode', 'numeric');
  o.setAttribute('pattern', '[0-9]{10}');
  o.value = o.value.replace(/\D/g, '').slice(0, 10);
  o.addEventListener('input', function () {
    o.value = o.value.replace(/\D/g, '').slice(0, 10);
  });
  thongBaoLoi(o, 'Số điện thoại phải gồm đúng 10 chữ số.');
});

capNhatSoMon();
// ===== Đơn món: lưu trong trình duyệt =====
var KHOA_DON = 'luxdiamond-don-mon';
var SO_LUONG_TOI_DA = 20;

function docDon() {
  try { return JSON.parse(localStorage.getItem(KHOA_DON)) || []; } catch (e) { return []; }
}

function luuDon(danhSach) {
  try { localStorage.setItem(KHOA_DON, JSON.stringify(danhSach)); } catch (e) { /* trình duyệt chặn lưu trữ */ }
}

function capNhatSoMon() {
  var oSo = document.getElementById('so-mon');
  if (!oSo) return;
  var tong = 0;
  docDon().forEach(function (mon) { tong += mon.sl; });
  oSo.textContent = tong;
  oSo.style.display = tong > 0 ? '' : 'none';
}

function themMon(ten, gia) {
  var danhSach = docDon();
  var mon = danhSach.filter(function (m) { return m.ten === ten; })[0];
  if (mon) mon.sl = Math.min(mon.sl + 1, SO_LUONG_TOI_DA);
  else danhSach.push({ ten: ten, gia: gia, sl: 1 });
  luuDon(danhSach);
}

// Thêm nút "Thêm vào đơn" cho các món còn bán
document.querySelectorAll('.dish-card:not(.sold-out) .dish-foot').forEach(function (chan) {
  var the = chan.closest('.dish-card');
  var ten = the.querySelector('h3').textContent;
  var gia = Number(chan.querySelector('.price').textContent.replace(/\D/g, ''));
  var nut = document.createElement('button');
  nut.type = 'button';
  nut.className = 'btn btn-sm';
  nut.textContent = 'Thêm vào đơn';
  nut.addEventListener('click', function () {
    themMon(ten, gia);
    capNhatSoMon();
    nut.textContent = 'Đã thêm ✓';
    setTimeout(function () { nut.textContent = 'Thêm vào đơn'; }, 1000);
  });
  chan.appendChild(nut);
});

capNhatSoMon();