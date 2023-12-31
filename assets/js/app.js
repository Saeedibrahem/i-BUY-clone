/*Start Toast*/
const notyf = new Notyf({
  duration: 2000,
  position: { x: "left", y: "top" },
});
/*End Toast*/

// ================================================================== global variables =========================================================

let cartProducts = JSON.parse(localStorage.getItem("cart-products")) ?? [];
let userWishlist = JSON.parse(localStorage.getItem("userWishlist")) ?? [];
const userData = JSON.parse(localStorage.getItem("userData")) ?? [];
const loginForm = document.querySelector("form");
const searchInput = document.getElementById("searchInput");
const productSearch = document.querySelector(".search__prodcut");
const showPassword = document.querySelector(".show-password");
const password = document.getElementById("password");
const cartContainer = document.querySelector(".cart__products");
const checkout = document.querySelector(".checkout");
const cartCounter = document.querySelector(".cart-counter");
const wishlistCounter = document.querySelector(".wishlist-counter");
const btnSelector = document.querySelector("body");
let renderedProduct = [];

// ================================================================== fetch func  =========================================================

const callBack = async (url) => {
  let data = null;
  try {
    let res = await fetch(url);
    data = await res.json();
  } catch {
    data = false;
  }
  return await data;
};

// ====================================================== display products from json file  ===================================================

callBack("../products.json")
  .then((res) => {
    renderedProduct = res.products;
    if (
      location.pathname === "/" ||
      location.pathname.includes("index") ||
      location.pathname.includes("shop")
    ) {
      displayProducts();
    }
  })
  .then(() => {
    if (location.pathname.includes("index") || location.pathname === "/") {
      $(document).ready(function () {
        $(".owl-carousel.products-slider").owlCarousel({
          loop: true,
          rtl: true,
          margin: 10,
          autoplay: true,
          autoplayTimeout: 8000,
          stagePadding: 5,
          nav: true,
          navText: [
            '<i class="fas fa-chevron-left"></i>',
            '<i class="fas fa-chevron-right"></i>',
          ],
          responsive: {
            0: {
              items: 2,
            },
            600: {
              items: 4,
            },
            800: {
              items: 4,
            },
            950: {
              items: 5,
            },
            1100: {
              items: 5,
            },
            1150: {
              items: 5,
            },
          },
        });
      });
    }
  });

// ======================================================= filter products function  ======================================================

if (location.pathname.includes("shop")) {
  document.querySelector(".orderby").addEventListener("change", (e) => {
    if (e.target.value === "top") {
      renderedProduct = renderedProduct.sort((e, b) => b.price - e.price);
      setTimeout(() => {
        displayProducts();
      }, 1000);
    }
    if (e.target.value === "bottom") {
      renderedProduct = renderedProduct.sort((e, b) => e.price - b.price);
      setTimeout(() => {
        displayProducts();
      }, 1000);
    }
  });
}

// ======================================================= DOM load functions  ======================================================

document.addEventListener("DOMContentLoaded", () => {
  if (location.pathname.includes("wishlist")) {
    if (JSON.parse(localStorage.getItem("login"))) {
      loadingDone();
      addIsLogin();
    } else {
      removeIsLogin();
      loadingDone();
      const container = document.querySelector(".wishlist__container");
      errorPage(container)
    }
  } else {
    setWishlistHrefToLogin();
    loadingDone();
    if (JSON.parse(localStorage.getItem("login"))) {
      addIsLogin();
      handleWishListCounter();
      setWishlistHrefToWish();
    } else {
      removeIsLogin();
    }
  }
});
if (location.pathname === "/" || location.pathname.includes("shop") || location.pathname.includes("index")) {
  setInterval(() => {
    userWishlist = JSON.parse(localStorage.getItem("userWishlist")) ?? [];
    userWishlist.forEach((e) => {
      document.getElementById(e.id).classList.add("active");
      document.getElementById(e.id).querySelector(".addWish").textContent =
        "حذف من المفضلة";
    });
  }, 1000);
}
// ======================================================= global functions  ======================================================

// ==================== Display function =================

const displayProducts = () => {
  const productSlider = document.querySelectorAll(".products-slider");
  productSlider.forEach((slider) => {
    slider.innerHTML = "";
    renderedProduct.forEach((product) => {
      slider.innerHTML += `<div class="item">
      <div class="addToWishList" id=${product.id} onclick="handleWishList(${
        product.id
      })">
        <i class="fa-regular fa-heart"></i>
        <span class="addWish " >إضافة للمفضلة</span>
      </div>
      <div ">
      <div class=" imgProduct ||product-image">
      <a href="/product.html?${product.id}">
      <div class="product-offer">وفر ${parseInt(
        ((product.old_price - product.price) * 100) / product.old_price
      )}%</div>
      
        <img src=${product.image[0]}  alt=""    class="img1"/> ${
        product.image[1]
          ? `<img src=${product.image[1]} alt="" class="img2"/>`
          : ` <img src=${product.image[0]} alt="" class="img2"/>`
      }
      </a>
      
        </div>
        <div class="product__info">
        <a href="/product.html?${product.id}">
        <div class="position-relative">
        <span class="hint--top hint--medium position-absolute w-100 z-1 hintPos"  aria-label="${
          product.name.ar
        }">
        <span class="opacity-0">${product.name.ar}</span>
        </span>
        <h3 class="overLap">${product.name.ar}</h3>
      </div>
      </a>
        <p class="price22">
        <span class="new__price">${product.price} جنيه</span>
        <span class="old__price">${product.old_price} جنيه</span>
        </p>
        <div class="colors">${product.colors
          .map(
            (color) =>
              `<div style="background-color: ${color};" class="black__color"></div>`
          )
          .join("")}
        </div>
        </div>
      </div>
        </div>
        `;
    });
  });
};

// ==================== user is login function =================

const isLogin = () => {
  let element = document.getElementById("login");
  closeModal(element);
  addIsLogin();
  setWishlistHrefToWish();
};

// ==================== open & close modal function =================

const openModal = () => {
  document.querySelector("body").style.overflow = "hidden";
  document.querySelector("body").style.paddingRight = "17px";
  document.querySelector(".new__navList-container").classList.add("pop");
};
const closeModal = (element) => {
  element.classList.remove("active");
  document.querySelector("body").style.overflow = "auto";
  document.querySelector("body").style.paddingRight = "0";
  document.querySelector(".new__navList-container").classList.remove("pop");
};

// ==================== wishlist & cart counter function =================

const handleWishListCounter = () => {
  wishlistCounter.textContent = userWishlist.length;
};
const handleCartCounter = () => {
  cartCounter.textContent = cartProducts.length;
};

// ==================== add & remove is login function =================

const addIsLogin = () => {
  document.querySelector("body").classList.add("isLogin");
};
const removeIsLogin = () => {
  document.querySelector("body").classList.remove("isLogin");
};

// ==================== loading is done function =================

const loadingDone = () => {
  setTimeout(() => {
    document.querySelector(".loading").classList.add("done");
  }, 500);
};

// ==================== handle wishlist href function =================

const setWishlistHrefToWish = () => {
  document.querySelector(".wishlist a").setAttribute("href", "wishlist.html");
  document
    .querySelector(".new__wishlist a")
    .setAttribute("href", "wishlist.html");
};
const setWishlistHrefToLogin = () => {
  document.querySelector(".wishlist a").setAttribute("href", "login.html");
  document.querySelector(".new__wishlist a").setAttribute("href", "login.html");
};
// ==================== clear login input value function =================

const clearInputValue = (e) => {
  e.target.email.value = "";
  e.target.password.value = "";
};
// ==================== send Data To Local Storage function =================

const sendDataToLocalStorage = (target, data) => {
  return localStorage.setItem(target, JSON.stringify(data));
};
// ==================== active login Btn function =================

const activeBtn = (btn1, btn2) => {
  btn1.classList.add("btn-light");
  btn1.classList.remove("btn-dark");
  btn2.classList.add("btn-dark");
};

// ==================== check function =================

if (document.querySelector("body").classList.contains("isLogin")) {
  handleWishListCounter();
  handleCartCounter();
}

// ==================== open modal by click buttons function =================

const popupBtns = document.querySelectorAll(".popup-event");
popupBtns.forEach((btn) => {
  btn.addEventListener("click", () => {
    let element = document.getElementById(btn.getAttribute("data-id"));
    element.classList.toggle("active");
    if (element.classList.contains("active")) {
      openModal();
    }
  });
});

// ==================== close modal by click on overlay function =================

const clickToClose = document.querySelectorAll(".clickToClose");
clickToClose.forEach((ele) => {
  ele.addEventListener("click", () => {
    let element = document.getElementById(ele.getAttribute("data-id"));
    closeModal(element);
  });
});

const popup = document.getElementById("popup");
const openPopup = () => {
  popup.classList.add("active");
};
const closePopup = () => {
  popup.classList.remove("active");
};

// ==================== error page function =================

const errorPage = (element) => {
  element.innerHTML = `
  <div class="error__404 m-auto text-center active" >
    <div class="">
      <img src="./assets/images/error404.png" alt="" height="400px">
    </div>
    <h3>لا يمكن العثور على الصفحة</h3>
  </div>
    `;
  setTimeout(() => {
    location.href = "/";
  }, 4500);
};

// ================== password validation func =============

const passwordValidation = (target) => {
  const lower = /[a-z]/g;
  const upper = /[A-Z]/g;
  const number = /[0-9]/g;
  const special = /[!@#$%^&*]/g;
  const length = /.{8}/g;
  if (!target.email.value.includes(".")) {
    return notyf.error(" يجب كتابة بريد إلكتروني صحيح");
  } else if (!target.email.value.includes("@")) {
    return notyf.error(" يجب كتابة بريد asas إلكتروني صحيح");
  }
  if (lower.test(target.password.value)) {
  } else {
    return notyf.error("  كلمة المرور لا تحتوي على حرف صغير");
  }
  if (upper.test(target.password.value)) {
  } else {
    return notyf.error("  كلمة المرور لا تحتوي على حرف كبير");
  }
  if (number.test(target.password.value)) {
  } else {
    return notyf.error("  كلمة المرور لا تحتوي على رقم");
  }
  if (special.test(target.password.value)) {
  } else {
    return notyf.error("  كلمة المرور لا تحتوي على رمز");
  }
  if (length.test(target.password.value)) {
  } else {
    return notyf.error("  كلمة المرور أقصر من 8 خانات");
  }
  return false;
};

// ================= login & register btn active  ==================

const loginBtn = document.querySelector(".login-title button:nth-child(1)");
const registerBtn = document.querySelector(".login-title button:nth-child(2)");
if (loginBtn) {
  loginBtn.addEventListener("click", () => {
    loginForm.classList.add("active");
    activeBtn(registerBtn, loginBtn);
  });
  registerBtn.addEventListener("click", () => {
    loginForm.classList.remove("active");
    activeBtn(loginBtn, registerBtn);
  });
}

// =========================================================== login & register function =========================================================

if (!location.pathname.includes("myAccount")) {
  if (loginForm) {
    loginForm.addEventListener("submit", (e) => {
      e.preventDefault();
      if (e.target.classList.contains("active")) {
        const findme = userData.find(
          (ele) => ele.email === e.target.email.value
        );
        if (findme) {
          if (findme.password === e.target.password.value) {
            sendDataToLocalStorage("login", findme);
            isLogin();
            handleWishListCounter();
            clearInputValue(e);
            let userName = JSON.parse(
              localStorage.getItem("login")
            ).email.split("@")[0];
            notyf.success(
              `أهلا بيك ❤️ ${findme.username ? findme.username : userName}`
            );
            if (location.pathname.includes("login")) {
              setTimeout(() => {
                location.href = "/";
              }, 2000);
            }
          } else {
            notyf.error("كلمة المرور خاطئة");
          }
        } else {
          notyf.error(" هذا البريد غير مسجل برجاء إنشاء حساب جديد");
        }
      } else {
        let newUser = {
          email: e.target.email.value,
          password: e.target.password.value,
        };
        if (!passwordValidation(e.target)) {
          const findme = userData.find((e) => e.email === newUser.email);
          if (findme) {
            notyf.error("هذا البريد مسجل بالفعل يرجي تسجيل الدخول");
          }
          if (!findme) {
            userData.push(newUser);
            sendDataToLocalStorage("userData", userData);
            loginForm.classList.add("active");
            activeBtn(registerBtn, loginBtn);
            clearInputValue(e);
            notyf.success("تم تسجيل الحساب بنجاح");
          }
        }
      }
    });
  }
}

// ===================================================== handle add product to WishList func ==================================================

const handleWishList = (id) => {
  if (document.querySelector("body").classList.contains("isLogin")) {
    const findmy = renderedProduct.find((e) => e.id === id);
    const findProduct = userWishlist?.find((e) => e.id === id);

    if (findProduct) {
      userWishlist = userWishlist.filter((e) => e.id !== id);
      sendDataToLocalStorage("userWishlist", userWishlist);
      notyf.error("تم حذف المنتج من المفضلة");
      handleWishListCounter();
      removedFromWishlit();
    } else {
      userWishlist.push(findmy);
      sendDataToLocalStorage("userWishlist", userWishlist);
      notyf.success("تم إضافة المنتج إلى المفضلة");
      handleWishListCounter();
      addedToWishlit();
    }
  } else {
    openPopup();
    setTimeout(() => {
      closePopup();
    }, 4500);
  }
};

const removedFromWishlit = () => {
  btnSelector.addEventListener("click", (e) => {
    if (e.target.closest(".addToWishList")) {
      e.target.closest(".addToWishList").classList.remove("active");
      let sss = e.target
        .closest(".addToWishList")
        .querySelector(".addToWishList .addWish");
      sss.textContent = "إضافه للمفضلة";
    }
  });
};
const addedToWishlit = () => {
  btnSelector.addEventListener("click", (e) => {
    if (e.target.closest(".addToWishList")) {
      e.target.closest(".addToWishList").classList.add("active");
      let sss = e.target
        .closest(".addToWishList")
        .querySelector(".addToWishList .addWish");
      sss.textContent = "حذف من المفضلة";
    }
  });
};

// ================================================================== search bar input events =========================================================

searchInput.addEventListener("keyup", () => {
  if (searchInput.value.trim().length == 0) {
    productSearch.classList.add("hidden");
  } else {
    productSearch.classList.remove("hidden");
  }
  const newData = renderedProduct.filter(
    (data) =>
      data.name.ar.includes(searchInput.value) ||
      data.name.en.includes(searchInput.value)
  );
  productSearch.innerHTML = "";
  if (newData.length === 0) {
    productSearch.innerHTML = `
        <p class="p-2">لم يتم العثور علي المنتج</p>
        `;
  } else {
    newData.forEach((e) => {
      productSearch.innerHTML += `
      <a href="/product.html?${e.id}" style="color:inherit !important">
      
      <div class=" d-flex gap-2 hoverMeNowHot align-items-center">
        <div class="img">
        <img src="${e.image[0]}" style="height: 40px;" >
        </div>
        <div class="title flex-grow-1">
        <p>${e.name.ar}</p>
        </div>
        <div class="price"><span class="old__price">${e.old_price} جنيه</span> <span class="new__price">${e.price} جنيه</span></div>
        </div>
      </a>
    `;
    });
  }
});
window.addEventListener("click", (e) => {
  if (!e.target.closest(".header_searchbar")) {
    productSearch.classList.add("hidden");
  } else {
    if (searchInput.value.trim().length !== 0) {
      productSearch.classList.remove("hidden");
    }
  }
});

// ================================================================== show Password event =========================================================

if (showPassword) {
  showPassword.addEventListener("click", () => {
    if (password.getAttribute("type") === "password") {
      password.setAttribute("type", "text");
      showPassword.classList.add("active");
    } else {
      password.setAttribute("type", "password");
      showPassword.classList.remove("active");
    }
  });
}

// ================================================================== display products in Cart func =========================================================

const displayCart = () => {
  cartProducts = JSON.parse(localStorage.getItem("cart-products")) ?? [];
  handleCartCounter();
  cartContainer.innerHTML = "";
  if (cartProducts.length !== 0) {
    cartProducts.map((product) => {
      cartContainer.innerHTML += `
      <li class="my-1">
                <div class="cart__product d-flex justify-content-between gap-1 align-items-center">
                  <div class="product__name flex-grow-1 px-1" >
                    <div class="remove__btn" id="${product.cart_id}">
                      <i class="fa-solid fa-xmark"></i>
                    </div>
                    <a href="/product.html?${product.id}" class="p-0">${product.name.ar} <span class="siz">${product.sizes}</span></a>
                    <div class="color" style="background-color: ${product.colors}"></div>
                    <p class="m-0" style="font-size: 12px;"><span>${product.quantity}</span> * <span>${product.price} جنيه</span></p>
                  </div>
                  <div class="product__image">
                    <img src="${product.image[0]}" alt="" height="50px" />
                  </div>
                </div>
              </li>                  
        `;
    });
    let totalPrice = 0;
    let total = cartProducts.map(
      (element) => (totalPrice += element.price * element.quantity)
    );

    checkout.classList.remove("d-none");
    checkout.classList.add("d-block");
    checkout.innerHTML = `
      <div class="checkout__box">
      <p class="d-flex justify-content-between"><strong>المجموع:</strong><span>${totalPrice.toFixed(
        2
      )} جنيه</span></p>
      <button class="btn hoverMeNowHot"> إتمام الطلب </button>
      <a href="/" class="btn home__btn">تابع التسوق</a>
    </div>
      `;
  } else {
    cartEmpty(cartContainer);
  }
};
setInterval(() => {
  displayCart();
}, 2000);

// ================================================================== remove item from cart event =========================================================

btnSelector.addEventListener("click", (e) => {
  if (e.target.closest(".remove__btn")) {
    if (cartProducts.length !== 0) {
      cartProducts = cartProducts.filter(
        (ele) => ele.cart_id !== +e.target.closest(".remove__btn").id
      );
      sendDataToLocalStorage("cart-products", cartProducts);
      notyf.error("تم حذف المنتج من السلة");
    } else {
      cartEmpty(cartContainer);
    }
  }
});

// ================================================================== cart is Empty func =========================================================

function cartEmpty(container) {
  checkout.classList.add("d-none");
  container.innerHTML = `<div class=" text-center">لا توجد منتجات في سلة التسوق <a href="/" class="btn home__btn">تابع التسوق</a></div> `;
}
