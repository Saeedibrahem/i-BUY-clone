const productId = window.location.search.split("?").join("");
let cartProducts;
let product = {};
let counter = "";
let findPro = {};
let userWishlist = JSON.parse(localStorage.getItem("userWishlist")) ?? [];
setInterval(() => {
  cartProducts = JSON.parse(localStorage.getItem("cart-products")) ?? [];
}, 3000);
// ================================================================== display product =========================================================

callBack("../products.json").then((res) => {
  const product__container = document.querySelector(".product__container");
  if (res) {
    product__container.innerHTML = "";
    findPro = res.products.find((ele) => ele.id == productId);
    if (findPro) {
      product__container.innerHTML = `
      <div class="row g-0 gap-5 || product-box">
      <div class="col-12 col-md-6 d-flex gap-1 || images__Con">
        <div class="d-flex flex-column gap-1 || small__image-con">
        ${findPro.image
          .map(
            (image) =>
              `<img class="sm-img" src=${image} alt="" height="100px" />`
          )
          .join("")}                </div>
        <div class="product__image flex-grow-1">
          <img src=${findPro.image[0]} alt="" />
        </div>
      </div>
      <div class="col">
        <div class="product__info " >
         <div class="product__title my-2">
          <h4>${findPro.name.ar}</h4>
          <p class="price ">
            <span class="old__price">${findPro.old_price} جنيه</span>
            <span class="new__price">${findPro.price} جنيه</span>
          </p>
         </div>
          <div class="product__color my-2">
            <p>اللون</p>
            <div class="d-flex gap-2">
            ${findPro.colors
              .map(
                (color) =>
                  `<div style="background-color: ${color};"class="color"></div>`
              )
              .join("")}</div>
          </div>
          <div class="product__size my-2">
            <p>المقاس</p>
            <div class="d-flex gap-2">
            ${findPro.sizes
              .map((size) => `<div class="size">${size}</div>`)
              .join("")}</div>
          </div>
          <div class="addToCart my-2">
            <div class="d-flex gap-0 gap-sm-2 align-items-center">
              <div class="quantity d-flex gap-1 gap-sm-2 p-1 align-items-center ">
                <button class=" border-0 decreaseBtn">-</button>
                <p class="m-0 quantity-counter">1</p>
                <button class=" border-0 increaseBtn">+</button>
              </div>
              <div class="addToCartBtn flex-grow-1 p-2" >
                <button class=" w-100"> إختر اللون / المقاس </button>
              </div>
            </div>
            <div class="my-3" >
            <div class="addProdToWishList " id=${
              findPro.id
            } onclick="handleWishList(${findPro.id})">
              <i class="fa-regular fa-heart "></i>
              <span class="addWish " >إضافة للمفضلة</span>
            </div>
              
            </div>
            <div class="my-3" >
            <span class="p-2">التصنيفات: ${findPro.categories}</span>
          </div>
          </div>
        </div>
      </div>
      <div class="porduct__description my-4">
        <div class="my-2">
          <p class="des-title"><strong>الوصف</strong></p>
          <p class="des-content">${findPro.description.ar}</p>
        </div>
      </div>
    </div>
      `;
    } else {
      errorPage(product__container);
    }
  }
});

// ================================================================== added to wishlist =========================================================
setInterval(() => {
  userWishlist = JSON.parse(localStorage.getItem("userWishlist")) ?? [];
  const findPro = userWishlist.find(
    (ele) => ele.id === +document.querySelector(".addProdToWishList").id
  );
  if (findPro) {
    document.querySelector(".addProdToWishList").classList.add("active");
    document.querySelector(".addProdToWishList span").textContent =
      "حذف من المفضلة";
  } else {
    document.querySelector(".addProdToWishList span").textContent =
      "إضافة للمفضلة";
    document.querySelector(".addProdToWishList").classList.remove("active");
  }
}, 1000);

// ================================================================== product on click events =========================================================

btnSelector.addEventListener("click", (e) => {
  // ================== decrease Btn event ======================

  counter = document.querySelector(".quantity-counter");
  if (e.target.closest(".decreaseBtn")) {
    if (counter.textContent > 1) {
      counter.textContent -= 1;
    }
  }
  // ==================== increase Btn event ====================

  if (e.target.closest(".increaseBtn")) {
    counter.textContent = +counter.textContent + 1;
  }
  // ================== product size Btn event ==================

  if (e.target.closest(".product__size")) {
    if (e.target.closest(".product__size .size")) {
      const sizeBtn = e.target
        .closest(".product__size")
        .querySelectorAll(".size");
      if (
        e.target.closest(".product__size .size").classList.contains("active")
      ) {
        delete product.size;
        return e.target
          .closest(".product__size .size")
          .classList.remove("active");
      }
      sizeBtn.forEach((ele) => {
        ele.classList.remove("active");
      });
      e.target.closest(".product__size .size").classList.add("active");
      product.size = e.target.closest(".product__size .size").textContent;
    }
    return product;
  }

  // ==================== product color Btn event =====================

  if (e.target.closest(".product__color")) {
    if (e.target.closest(".product__color .color")) {
      const colorBtn = e.target
        .closest(".product__color")
        .querySelectorAll(".color");
      if (
        e.target.closest(".product__color .color").classList.contains("active")
      ) {
        delete product.color;
        return e.target
          .closest(".product__color .color")
          .classList.remove("active");
      }
      colorBtn.forEach((ele) => {
        ele.classList.remove("active");
      });
      e.target.closest(".product__color .color").classList.add("active");
      const color = e.target.closest(".product__color .color").style[
        "background-color"
      ];
      product.color = color;
    }
    return product;
  }

  // ==================== product image toggle event =====================

  if (e.target.closest(".small__image-con")) {
    if (e.target.closest(".small__image-con .sm-img")) {
      const product__image = document.querySelector(".product__image img");
      product__image.src = e.target.closest(".small__image-con .sm-img").src;
    }
  }
  // ================== add product to cart Btn event =====================

  if (e.target.closest(".addToCartBtn ")) {
    if (product.size && product.color) {
      const newProduct = { ...findPro };
      const findProd = cartProducts.find(
        (ele) =>
          ele.id == newProduct.id &&
          ele.sizes == product.size &&
          ele.colors == product.color
      );
      let cartId =
        cartProducts.length === 0 ? 1 : cartProducts.at(-1).cart_id + 1;
      setTimeout(() => {
        let cartModal = document.getElementById("cart__menu");
        cartModal.classList.add("active");
      }, 2000);

      if (findProd) {
        findProd.quantity += +counter.textContent;
        sendDataToLocalStorage("cart-products", cartProducts);
        notyf.success("تم تحديث بيانات السلة بنجاح");
      } else {
        newProduct.colors = product.color;
        newProduct.sizes = product.size;
        newProduct.quantity = +counter.textContent;
        newProduct.cart_id = cartId;
        cartProducts.push(newProduct);
        sendDataToLocalStorage("cart-products", cartProducts);
        notyf.success("تم إضافة المنتج إلى السلة");
      }
    } else {
      notyf.error("يجب إختيار اللون والمقاس");
    }
  }
});

// ================================================================== active  & deActive Btn =========================================================

function activeBtn(btn) {
  btn.classList.add("active");
  btn.textContent = "إضافة إلي السلة";
}
function deActiveBtn(btn) {
  btn.classList.remove("active");
  btn.textContent = "إختر اللون / المقاس";
}
setInterval(() => {
  const btn = document.querySelector(".addToCartBtn button");

  if (product.color && product.size) {
    activeBtn(btn);
  } else {
    deActiveBtn(btn);
  }
}, 1500);
