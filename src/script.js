//
//    <script>
//var myIndex = 0;
//carousel();
//
//function carousel() {
//  var i;
//  var x = document.getElementsByClassName("mySlides");
//  for (i = 0; i < x.length; i++) {
//    x[i].style.display = "none";
//  }
//  myIndex++;
//  if (myIndex > x.length) {myIndex = 1}
//  x[myIndex-1].style.display = "block";
//  setTimeout(carousel, 3000); // Change image every 3 seconds
//}
//</script>

//function chanebg(){
//var nev = document.getElementByID('nev');
//var scrollvalue = window.scrollY;
//if(scrollvalue < 100){
//
//navbar.classList.remove('headr');
//}
//else{
//navbar.classList.add('headr');
//}
//
//}
//window.add ventListener('scroll',changBg);



let menu = document.querySelector('#menu-btn');
let navbar = document.querySelector('.header .navbar');

menu.onclick = () =>{
    menu.classList.toggle('fa-times');
    navbar.classList.toggle('active');
};

window.onscroll = () =>{
    menu.classList.remove('fa-times');
    navbar.classList.remove('active');
};


var swiper = new Swiper(".home-slider", {
    spaceBetween: 20,
    effect: "fade",
    grabCursor: true,
    loop:true,
    centeredSlides: true,
    pagination: {
      el: ".swiper-pagination",
      clickable: true,
    },
});

var swiper = new Swiper(".review-slider", {
    spaceBetween: 20,
    grabCursor: true,
    loop:true,
    autoplay: {
        delay: 7500,
        disableOnInteraction: false,
    },
    breakpoints:{
        0:{
            slidesPerView:1,
        },
        600:{
            slidesPerView:2,
        },
    },
});

var swiper = new Swiper(".blogs-slider", {
    spaceBetween: 20,
    grabCursor: true,
    loop:true,
    autoplay: {
        delay: 7500,
        disableOnInteraction: false,
    },
    pagination: {
        el: ".swiper-pagination",
        clickable: true,
    },
    breakpoints:{
        0:{
            slidesPerView:1,
        },
        768:{
            slidesPerView:2,
        },
        991:{
            slidesPerView:3,
        },
    },
});

