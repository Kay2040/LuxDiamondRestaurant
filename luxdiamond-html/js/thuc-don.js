

var cacNutDanhMuc = document.querySelectorAll('.tabs button');
var cacMon = document.querySelectorAll('.dish-card');
var oTimKiem = document.getElementById('tim-mon');
var thongBaoTrong = document.getElementById('khong-co');
var danhMucDangChon = 'all';   


function locMon() {
  var tuKhoa = oTimKiem.value.trim().toLowerCase();
  var soMonHienThi = 0;

  cacMon.forEach(function (mon) {
    var dungDanhMuc = (danhMucDangChon === 'all') || (mon.dataset.cat === danhMucDangChon);
    var dungTuKhoa = mon.textContent.toLowerCase().indexOf(tuKhoa) !== -1;

    if (dungDanhMuc && dungTuKhoa) {
      mon.style.display = '';
      soMonHienThi++;
    } else {
      mon.style.display = 'none';
    }
  });

  thongBaoTrong.style.display = (soMonHienThi === 0) ? 'block' : 'none';
}


cacNutDanhMuc.forEach(function (nut) {
  nut.addEventListener('click', function () {
    cacNutDanhMuc.forEach(function (n) { n.classList.remove('on'); });
    nut.classList.add('on');
    danhMucDangChon = nut.dataset.cat;
    locMon();
  });
});


oTimKiem.addEventListener('input', locMon);
