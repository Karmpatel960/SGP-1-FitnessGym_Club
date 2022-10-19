
var nav = document.querySelector('header');

window.addEventListener('scroll', function(event) {
    event.preventDefault();

    if (window.scrollY <= 150) {
    nav.style.backgroundColor = 'transparent';
    } else {
    nav.style.backgroundColor = '#041333';

    }
})


var myIndex = 0;
carousel();

function carousel() {
  var i;
  var x = document.getElementsByClassName("mySlides");
  for (i = 0; i < x.length; i++) {
    x[i].style.display = "none";
  }
  myIndex++;
  if (myIndex > x.length) {myIndex = 1}
  x[myIndex-1].style.display = "block";
  setTimeout(carousel, 3000);
}