import $ from "jquery";
import bootstrap from 'bootstrap';
import 'bootstrap/dist/css/bootstrap.min.css';

$(document).ready(()=>{
  let colorCode=$("#color").data('color')
  $("#colorSquare").css({'background-color':colorCode});
});