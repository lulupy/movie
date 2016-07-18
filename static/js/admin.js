'use strict';
(function ($) {
    $('.table').on('click', '.btn.del', function(){
        var $this = $(this);
        var id = $this.attr('data-id');
        $.ajax({
            method: 'DELETE', 
            url: '/admin/movie/delete?id='+id,
            success: function(result){
                console.log(result);
                if(result=='1'){
                    $this.closest('tr').remove();
                }else{
                    alert('删除失败')
                }
            }


        })
    })
 
})(jQuery);

