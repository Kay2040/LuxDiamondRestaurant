// ===== Hiển thị món đã chọn (chỉ xem) =====
var oDanhSach = document.getElementById('ds-mon');

function dinhDangTien(so) {
  return so.toLocaleString('vi-VN') + ' ₫';
}

function veDon() {
  var danhSach = docDon();
  var tong = 0;
  oDanhSach.innerHTML = '';

  danhSach.forEach(function (mon) {
    tong += mon.gia * mon.sl;

    var dong = document.createElement('li');
    dong.className = 'don-row xem';
    dong.innerHTML =
      '<div class="don-name"><strong></strong><span></span></div>' +
      '<span class="don-sl"></span>' +
      '<span class="don-line"></span>';

    dong.querySelector('strong').textContent = mon.ten;
    dong.querySelector('.don-name span').textContent = dinhDangTien(mon.gia);
    dong.querySelector('.don-sl').textContent = '× ' + mon.sl;
    dong.querySelector('.don-line').textContent = dinhDangTien(mon.gia * mon.sl);
    oDanhSach.appendChild(dong);
  });

  document.getElementById('tong-tien').textContent = dinhDangTien(tong);
  document.getElementById('don-trong').style.display = danhSach.length === 0 ? 'block' : 'none';
  document.getElementById('don-co-mon').style.display = danhSach.length === 0 ? 'none' : 'flex';
}

veDon();