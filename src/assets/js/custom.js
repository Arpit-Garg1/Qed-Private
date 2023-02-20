const $ = window.jQuery = require('jquery')

// jQuery(document).ready(function($) {
//accordian
$(document).on('click', 'ul.accordian li .heading', function () {
    $('ul.accordian li').removeAttr('open');
    $('ul.accordian li .content').hide();

    $(this).next('.content').slideDown();
    $(this).parent().attr('open', true);
})


//Tabs
$(document).on('click', '.tab ul.tabLink li', function () {
    let dateRel = $(this).attr('data-rel');

    $('.tab .content').hide();
    $('.tab ul.tabLink li').removeAttr('open')

    $('#' + dateRel).show();
    $(this).attr('open', true);
})


//Model
//Tabs
$(document).on('click', '.openModel', function (e) {
    let dateRel = $(this).attr('data-rel');

    $('#' + dateRel).fadeIn();


    e.preventDefault();
})
$(document).on('click', '.modelContent span.close, .model .button', function () {
    $('.model').fadeOut();
});


$(document).on('click', '.hasDropdown', function (e) {
    if ($(".hasDropdown").not(this).hasClass('open')) {
        $(".hasDropdown").removeClass('open');
    }
    if (!$(this).hasClass('open')) {
        $(this).addClass('open');

    }
    else {
        $(".hasDropdown").removeClass('open');
    }
    e.stopPropagation();
});

//open menu drawer

$(document).on('click', '.sidebarToggle span.icon', function () {
    $('body').toggleClass('menuActive')

});

// $(document)?.on('click', '.sliderNav .slick-slide', function () {
//   $('.mainSlider')?.slick('slickGoTo',$(this).index());
// })


$(document).on('click', function () {

    $(".hasDropdown").removeClass('open');
    $('.keywordFilter:visible').slideUp();

});

$(document).on('click', '.keywordFilter .filter-button .button', function () {
  $('.keywordFilter:visible').slideUp();

});



/* ons'Click', within the dropdown won't make
   it past the dropdown itself */
   $(document).on('click', ".dropDown, .hasDropdown, .keywordFilterLabel, .keywordFilter", function (e) {

    e.stopPropagation();
});



//change single and bulk upload
$('input[name="uploadOption"]').on('change',function(){
    var $id = $(this).attr('id');
    if($id == "single"){
        
        $('.bulkUpload').hide();
        $('.singleUpload').show();
    } else{
        $('.bulkUpload').show();
        $('.singleUpload').hide();
    }
})

$(document).on('click','label.keywordFilterLabel',function(){
  $('.keywordFilter').slideToggle()
});

let files = "";
$(document).on("dragover","#ddArea", function() {
    $(this).addClass("drag_over");
    return false;
  });

  $(document).on("dragleave","#ddArea", function() {
    $(this).removeClass("drag_over");
    return false;
  });

  $(document).on("click","#ddArea", function(e) {
    file_explorer();
  });

  $(document).on("drop","#ddArea", function(e) {
    
    e.preventDefault();
    $(this).removeClass("drag_over");
    var formData = new FormData();
     files = e.originalEvent.dataTransfer.files;
    for (var i = 0; i < files.length; i++) {
      formData.append("file[]", files[i]);
    }
    uploadFormData(formData);
  });

  function file_explorer() {
    document.getElementById("selectfile").click();
    document.getElementById("selectfile").onchange = function() {
      files = document.getElementById("selectfile").files;
      var formData = new FormData();

      for (var i = 0; i < files.length; i++) {
        formData.append("file[]", files[i]);
      }
      // uploadFormData(formData);
    };
  }

  function uploadFormData(form_data) {
    $(".loading")
      .removeClass("d-none")
      .addClass("d-none");
    $.ajax({
      url: "upload.php",
      method: "POST",
      data: form_data,
      contentType: false,
      cache: false,
      processData: false,
      success: function(data) {
        $(".loading")
          .removeClass("d-none")
          .addClass("d-none");
        $("#showThumb").append(data);
      }
    });
  }



// });
