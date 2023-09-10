// ================================================================== display Wishlist check =========================================================

let userWishlist = JSON.parse(localStorage.getItem("userWishlist")) ?? [];
const wishlistData = document.querySelector(".wishlist__data");
if (userWishlist.length == 0) {
  wishlistEmpty();
} else {
  displayWishlist();
}

// ================================================================== display products in Wishlist func =========================================================

function displayWishlist() {
  wishlistCounter.textContent = userWishlist.length;
  wishlistData.innerHTML = "";
  userWishlist.map((ele) => {
    wishlistData.innerHTML += `
    <div class="wishlist__box-title " >
    <div class="product-remove p-3" id="${ele.id}">
      <div class="d-flex align-items-center justify-content-center">
        <i class="fa-solid fa-xmark"></i>
      </div>
    </div>
    <div class="product-thumbnail p-3">
      <img
        src=${ele.image[0]}
        alt=""
        height="68px"
      />
    </div>
    <div class="product-name p-3">
      <a
        href="/product.html?${ele.id}"
        class="text-danger"
        style="text-decoration: underline !important"
        >${ele.name.ar}</a
      >
    </div>
    <div class="product-price p-3">
      <span class="old__price ">${ele.old_price} جنيه</span>
      <span class="new__price">${ele.price} جنيه</span>
    </div>
    <div class="product-date p-3"><span>أغسطس 29, 2023</span></div>
    <div class="product-stock p-3">
      <i class="fa-solid fa-check"></i> <span>متوفر بالمخزون</span>
    </div>
  </div>
      `;
  });
}
// ================================================================== remove product from wishlist event =========================================================

const removeBtns = document.querySelector("body");
removeBtns.addEventListener("click", (e) => {
  if (e.target.closest(".product-remove")) {
    userWishlist = userWishlist.filter((ele) => ele.id !== +e.target.closest(".product-remove").id);
    sendDataToLocalStorage("userWishlist", userWishlist);
    displayWishlist();
    notyf.error("تم حذف المنتج من المفضلة");
    if (userWishlist.length == 0) {
      wishlistEmpty();
    }
  }
});

// ================================================================== wishlist is Empty func =========================================================

function wishlistEmpty() {
  const wishlist__container = document.querySelector(".wishlist__container");
  wishlist__container.innerHTML = `
  <div class="container">
  <div class=" d-flex flex-column align-items-center gap-3">
    <div class="cart__icon" style="font-size: 100px;" >
      <i class="fa-regular fa-heart"></i>
    </div>
    <div class="empty__cart">
      <h4>قائمة المفضلة فارغه</h4>
    </div>
    <a class="btn px-5 home__btn"href="/"  > العودة للمتجر</a>
  </div>
</div>`;
}
