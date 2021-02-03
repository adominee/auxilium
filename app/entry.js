import $ from "jquery";

const deleteButton=$('#deleteButton');

$(document).ready(()=>{
  let colorCode=$("#color").data('color')
  console.log(colorCode);
  $("#colorSquare").css({'background-color':colorCode});
});

deleteButton.click(()=>{
  const recordId=deleteButton.data('record-id');
  const userId=deleteButton.data('user-id');
  $.post(
    
  )
})