


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
