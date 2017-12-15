/* eslint no-console: "off" */
import "./style/index.scss";
import "bootstrap";

$(document).ready(function() {

  $("#news-form").on("submit", function(e) {
    $("[data-toggle='popover-mail']").popover("hide");
    let regex = /^(([^<>()[\]\\.,;:\s@"]+(\.[^<>()[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
    let data = $(this).serializeArray();
    let mail = data.find(function(data) {
      return data.name === "mail";
    });
    mail = mail.value;
    if (regex.test(mail)) {
      $($(this).find(".input-group")[0]).hide();
      $($(this).find(".loader")[0]).show();
      return 0;
    }
    console.log("mail invalide");
    $("[data-toggle='popover-mail']").popover("show");
    setTimeout(function() {
      $("[data-toggle='popover-mail']").popover("hide");
    }, 5000);
    e.preventDefault();
  });

  $("[data-toggle='popover']").popover({trigger: "hover"});
  $("[data-toggle='popover-mail']").popover({trigger: "manual", container: "#mail-popover"});
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
    document.addEventListener("scroll", function() {
      calcParallax(pContainer);
    }, {capture: true, passive: true});
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