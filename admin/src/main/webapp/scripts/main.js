
// 모바일 메뉴버튼 클릭시 보이기 숨기기

$(function () { /// jQB ////
    
    $(".ham").click(function(){
        console.log("메뉴");
      $(".lnbContainer").show().css({
          diplay:"block"
      });
      $(".ham").hide()
      $(".cls").show()
        
    });
    
    $(".cls").click(function(){
        console.log("메뉴Close");
      $(".lnbContainer").hide().css({
          diplay:"none"
      });
      $(".cls").hide()
      $(".ham").show()

        
    });//////// click ///
        

    // $(".cls").click(function () {
    //     $(".lnbContainer").removeClass("on").hide();
    // }); //////// click

}); //////////////// jQB //