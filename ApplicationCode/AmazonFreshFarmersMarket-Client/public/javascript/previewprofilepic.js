function readURL(input) {
        if (input.files && input.files[0]) {
   
            var reader = new FileReader();
   
            reader.onload = function (e) {            
                $('#profilepic')
                    .attr('src', e.target.result)
                    .width(270)
                    .height(200);
                document.getElementById('hiddendata').value = e.target.result;
            };

            reader.readAsDataURL(input.files[0]);
        }
    }