document.addEventListener('DOMContentLoaded', function() {
  var toggleMenu = document.querySelector('.toggle-menu');
  var siteNav = document.querySelector('.site-nav');

  toggleMenu.addEventListener('click', function() {
    siteNav.classList.toggle('active');
  });
});

// 在頁面載入時檢查屏幕寬度
function checkScreenWidth() {
   
    // 否則隱藏主選單，顯示切換按鈕
    document.querySelector('.site-nav').style.display = 'none';
    document.querySelector('.site-nav-toggle').style.display = 'block';
  
}

// 綁定窗口大小變化事件
window.addEventListener('resize', checkScreenWidth);

// 頁面載入時立即執行一次檢查
checkScreenWidth();
