
setInterval(() => {
  const now = new Date("Sep 30,2023").getTime();
  const now2 = new Date().getTime();
  const timedays = now - now2;
  const hoursnow = Math.floor(
    (timedays % (60 * 60 * 24 * 1000)) / (60 * 60 * 1000)
  );
  const minnow = Math.floor((timedays % (60 * 60 * 1000)) / (60 * 1000));
  const secnow = Math.floor((timedays % (60 * 1000)) / 1000);
  const timerCont = document.querySelector(".timer");
  if(timedays > 0){

    timerCont.innerHTML = `
    <div class="hours d-flex flex-column ">

              <span>${
                hoursnow === 0 ? "00" : hoursnow >= 10 ? hoursnow : "0" + hoursnow
              }</span>
              <span class="timerText">ساعات</span>
            </div>
            <div class="span">
              <span>:</span>
            </div>
            <div class="minutes d-flex flex-column">
              <span>${
                 minnow === 0 ? "00" : minnow >= 10 ? minnow : "0" + minnow
              }</span>
              <span class="timerText">دقائق</span>
            </div>
            <div class="span">
              <span>:</span>
            </div>
            <div class="seconds d-flex flex-column">
              <span>${
                 secnow === 0 ? "00" : secnow >= 10 ? secnow : "0" + secnow
              }</span>
              <span class="timerText">ثواني</span>
            </div>`;
  }else{
    timerCont.innerHTML = `  انتهي العرض
`
  }
}, 1000);




