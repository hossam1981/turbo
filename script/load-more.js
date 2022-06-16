$(document).ready(function(){  // <<--do i actually need this or not 

// console.log('jquery magic is ready')

$(function(){
    $(".box-hidden").slice(0 ,2).show();

    $("#loadMore").on('click', function(e){
        e.preventDefault();
        // console.log("heloooo function")

        $(".box-hidden:hidden").slice(0 , 2).slideDown();
        if ($(".box-hidden:hidden").length == 0) {
            $("#load").fadeOut('slow');
        }
       
        $('html,body').animate({
            scrollTop: $(this).offset().top 
        }, 1500);
        //  console.log("i'm a here sir")
      }) 

    })

})




// -----function to check if the js file woring or exist---
    function checkIfIncluded(file) {
        var links = document.getElementsByTagName("link");
        for(var i = 0; i < links.length; i++) {
            if (links[i].href.substr(-file.length) == file)
                return true;
        }
    
        var scripts = document.getElementsByTagName("script");
        for(var i = 0; i < scripts.length; i++) {
            if (scripts[i].src.substr(-file.length) == file)
                return true;
        }
    
        return false;
    }
    
    // console.log(checkIfIncluded("mystyle.css"));
    console.log(checkIfIncluded("script.js"));
    console.log(checkIfIncluded("load-more.js"));
//