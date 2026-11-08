


var bieuMau = document.getElementById('form-dat-ban');
var cacBuoc = document.querySelectorAll('.buoc');
var cacMucBuoc = document.querySelectorAll('.wizard-steps li');

var buocHienTai = 1;
var banDaChon = null;      
var cachChonMon = 'sau';   


function dinhDangTien(so) {
  return so.toString().replace(/\B(?=(\d{3})+(?!\d))/g, '.') + ' ₫';
}

function laySoKhach() {
  return Number(document.getElementById('so-khach').value);
}


function hienBuoc(so) {
  buocHienTai = so;
  cacBuoc.forEach(function (buoc) {
    buoc.style.display = (buoc.id === 'buoc-' + so) ? 'block' : 'none';
  });
  cacMucBuoc.forEach(function (muc, i) {
    if (i + 1 === so) muc.className = 'active';
    else if (i + 1 < so) muc.className = 'done';
    else muc.className = '';
  });
  if (so === 2) capNhatBan();
  if (so === 3) taoTomTat();
}


function capNhatBan() {
  document.querySelectorAll('.pick').forEach(function (nut) {
    var daCoNguoiDat = nut.dataset.daDat === '1';
    var khongDuCho = Number(nut.dataset.cho) < laySoKhach();
    var ghiChu = nut.querySelector('small');

    nut.disabled = daCoNguoiDat || khongDuCho;
    if (!daCoNguoiDat) {
      ghiChu.textContent = khongDuCho ? 'Không đủ chỗ cho ' + laySoKhach() + ' khách' : 'Còn trống';
    }
    
    if (nut.disabled && banDaChon === nut) {
      nut.classList.remove('on');
      banDaChon = null;
    }
  });
}


document.querySelectorAll('[data-sang]').forEach(function (nut) {
  nut.addEventListener('click', function () {
    var dich = Number(nut.dataset.sang);

    if (dich > buocHienTai) {
      if (buocHienTai === 1 && (!bieuMau.reportValidity() || !gioHopLe())) return;
      if (buocHienTai === 2 && banDaChon === null) {
        alert('Vui lòng chọn một bàn.');
        return;
      }
    }
    hienBuoc(dich);
  });
});


document.querySelectorAll('.chips button').forEach(function (nut) {
  nut.addEventListener('click', function () {
    document.querySelectorAll('.chips button').forEach(function (n) { n.classList.remove('on'); });
    nut.classList.add('on');
    document.querySelectorAll('.pick').forEach(function (ban) {
      var hop = nut.dataset.kv === 'all' || ban.dataset.kv === nut.dataset.kv;
      ban.style.display = hop ? '' : 'none';
    });
  });
});


document.querySelectorAll('.pick').forEach(function (nut) {
  nut.addEventListener('click', function () {
    document.querySelectorAll('.pick').forEach(function (n) { n.classList.remove('on'); });
    nut.classList.add('on');
    banDaChon = nut;
  });
});



// Bước 3: xác nhận
function taoTomTat() {
  var ten = document.getElementById('ho-ten').value;
  var sdt = document.getElementById('sdt').value;
  document.getElementById('tt-khach').textContent = ten + ' · ' + sdt;
  document.getElementById('tt-gio').textContent =
    document.getElementById('gio').value + ' ngày ' + document.getElementById('ngay').value +
    ' · ' + laySoKhach() + ' khách';
  document.getElementById('tt-ban').textContent =
    banDaChon ? banDaChon.dataset.ten + ' · ' + banDaChon.dataset.cho + ' chỗ · ' + banDaChon.dataset.kv : '';
  document.getElementById('tt-ghichu').textContent = document.getElementById('ghi-chu').value || 'Không có';
}

document.getElementById('nut-xac-nhan').addEventListener('click', function () {
  alert('Đây là giao diện mẫu, yêu cầu đặt bàn chưa được gửi đi.');
});
// Giới hạn ngày giờ: không chọn thời gian đã qua
var oNgay = document.getElementById('ngay');
var oGio = document.getElementById('gio');

function layNgayHomNay() {
  var h = new Date();
  var thang = ('0' + (h.getMonth() + 1)).slice(-2);
  var ngay = ('0' + h.getDate()).slice(-2);
  return h.getFullYear() + '-' + thang + '-' + ngay;
}

function capNhatGio() {
  var laHomNay = (oNgay.value === layNgayHomNay());
  var bayGio = new Date();
  var phutBayGio = bayGio.getHours() * 60 + bayGio.getMinutes();

  Array.prototype.forEach.call(oGio.options, function (opt) {
    var phan = opt.value.split(':');
    var phut = Number(phan[0]) * 60 + Number(phan[1]);
    opt.disabled = laHomNay && phut <= phutBayGio;
  });

  if (oGio.selectedOptions[0].disabled) {
    var conLai = Array.prototype.filter.call(oGio.options, function (opt) { return !opt.disabled; });
    if (conLai.length > 0) oGio.value = conLai[0].value;
  }
}

function gioHopLe() {
  if (oGio.selectedOptions[0].disabled) {
    alert('Giờ đã chọn đã qua hoặc hôm nay đã hết giờ đặt, vui lòng chọn lại.');
    return false;
  }
  return true;
}

oNgay.min = layNgayHomNay();
oNgay.addEventListener('change', capNhatGio);
capNhatGio();