import "./style/index.scss";
import "bootstrap";

$(document).ready(function() {

  //smoothscroll
  $("a[href^='#']").on("click",function (e) {
    e.preventDefault();
    var target = this.hash;
    var $target = $(target);
    var offset = $target.offset().top - 56;

    $("html, body").stop().animate({
      "scrollTop": (offset)
    }, 900, "swing");
  });


  $("#navtog").click(function() {
    let elmt = $("#side-nav");
    if (elmt.css("display") != "block") {
      elmt.show("fast");
    } else {
      elmt.hide("fast");
    }
  });

  
  //parallax
  $(".parallax-container").each(function() {
    var pContainer = $(this);
    $(document).scroll(function() {
      calcParallax(pContainer);
    });
  });

  function calcParallax(pContainer) {
    var dim = {};

    //variable
    dim.scrollTop = $("html").scrollTop();

    //variable when resize
    dim.windowHeight = screen.height;
    dim.containerTop = pContainer.offset().top;
    dim.imageHeight = pContainer.find("img").height();

    //constant
    dim.containerHeight = pContainer.height();

    //calculated
    dim.maxOffset = dim.imageHeight - dim.containerHeight;
    dim.a = dim.maxOffset / (dim.containerHeight + dim.windowHeight);
    dim.b = dim.windowHeight - dim.containerTop;
    //f(scrollTop) = a(scrollTop + b);
    dim.imageOffset = dim.a * (dim.scrollTop + dim.b);

    pContainer.children("img").offset({top: dim.containerTop + dim.imageOffset - dim.maxOffset});
  }  
});