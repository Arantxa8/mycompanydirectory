// loader

$(document).ready(function(){
  setTimeout(function(){
  $('#preloader').fadeOut('slow', function() { 
	  $(this).remove(); })}, 10)
 });



//REUSABLE FUNCTIONS AND DATA
// Columns Settings
const employeesColumns = [
  {"data": null, 'orderable': false, "defaultContent": `<div class="ml-auto d-flex"><button
  type="button"
  class="btn btn-warning small-edit-button employees"
><i class="fas fa-edit"></i>
</button><button
  type="button"
  class="btn btn-danger small-delete-button ml-2"
><i class="fas fa-trash"></i>
</button>
</div>`},
  { "data": "lastName", "className": "wrapok" },
  { "data": "firstName", "className": "wrapok"},
  { "data": "jobTitle" },
  { "data": "email" },
  { "data": "department" },
  {"data": null, "orderable": false, "className": "dtr-control", "targets": -1, "defaultContent": "<p></p>"}
];
const departmentsColumns = [
  {"data": null, 'orderable': false, "defaultContent": `<div class="ml-auto d-flex">
  <button
    type="button"
    class="btn btn-warning small-edit-button departments"
  >
    <i class="fas fa-edit"></i>
  </button>
  <button
    type="button"
    class="btn btn-danger small-delete-button ml-2"
    
  >
    <i class="fas fa-trash"></i>
  </button>
</div>`},
  { "data": "name" , "className": "wrapok"},
  { "data": "locationName" },
  {"data": null, "orderable": false, "className": "dtr-control", "targets": -1, "defaultContent": "<p></p>"}
  
];

const locationsColumns = [
  { "data": "name" },
  {"data": null, 'orderable': false, "defaultContent": `<div class="ml-auto d-flex">
  <button
    type="button"
    class="btn btn-warning small-edit-button locations"

  >
    <i class="fas fa-edit"></i>
  </button>
  <button
    type="button"
    class="btn btn-danger small-delete-button ml-2"
    
  >
    <i class="fas fa-trash"></i>
  </button>
</div>`}
];
//Data tables configuration function


function tablesSettings(id, title, columns, screen){
  table = $(id).DataTable( {
      ajax: {url: `./php/get${title}.php`, async: true},
      "dom": 'f<"buttons">rtip',
      responsive: {
        details: {
            type: 'column',
            target: -1
        }
    },
      columns: columns,
      scrollY: `calc(100vh - 252px)`,
      scrollCollapse: true,
      // fixedHeader: {header: true,
      // headerOffset: $('#navbar').outerHeight()},
      paging: false
    } );
    eval('table'+title+"= table");
    
    $(`#${title.toLowerCase()}Table_wrapper>div.buttons`).html(`<div class="form-group row d-flex justify-content-between pr-2 page-title-container">
          
    <div id="tableHead${title}" class="tableHeadTitle"><h5 >${title}</h5></div>
    
    </div>`);
  };

  

  
//Show page and update nav
  
function clearPages(){
  
  $.each($(".tablePage"), function () {
    $(this).addClass("d-none");
  });
  tableEmployees.fixedHeader.enable(false);
  tableDepartments.fixedHeader.enable(false);
  tableLocations.fixedHeader.enable(false);
  };
function clearNav(){
  $(".nav-item").removeClass("active");
  };
  
function showPage(pageId, navLinkId){
    clearPages();
    $(pageId).removeClass("d-none");
    clearNav();
    $(navLinkId).addClass('active');
    
  };
  
  
  
  //Get info dropdowns for filter modal
  
function getFilter(col, container, page){
    eval('var table = table'+page);
    var select = $(`<select class="form-control filterDropdown${page}" maxlength="50" name=""><option value="">Select ${$(container).siblings('label').html()}</option></select>`)
    .appendTo( $(container).empty() )
    .on( 'change', function () {
        table.column( col )
            .search( $(this).val() )
            .draw();
    } );
  
  table.column( col ).data().unique().sort().each( function ( d, j ) {
    select.append( '<option value="'+d+'">'+d+'</option>' )
  } );
  
  };
  
  //Get dropdowns only
function getDropdown(col, container, page){
    eval('var table = table'+page);
    var select = $(`<select class="form-control dropdown" maxlength="50" name="" required></select>`)
    .appendTo( $(container).empty() )
    .on( 'change', function () {
      table.column( col )
    } );
  
    table.column( col ).data().unique().sort().each( function ( d, j ) {
    select.append( '<option value="'+d+'">'+d+'</option>' )
  } );
  
  };
//Update location on change in the forms
function updateLocation(locationID, departmentID){
  $(`<select class="form-control dropdown" maxlength="50" name="" required><option value="">Select ${$(locationID).siblings('label').html()}</option></select>`)
    .appendTo( $(locationID).empty() );
  $(departmentID).on( 'change', function () {
    let options = "";
    tableDepartments.column( 0 ).search( $(departmentID).val() ).draw();
    tableDepartments.column( 1 ).rows({ search: 'applied' }).data().unique().sort().each( function ( d, j ) {
      options += '<option value="'+d.locationID+'">'+d.locationName+'</option>'
    });
    $(locationID+'>select').html( options );
  } );
  
};


//THEMES
let original = "linear-gradient(to top left, #666699 0%, #660033 100%)";
let calm = "linear-gradient(to bottom right, #003366 0%, #33cccc 100%)";
let midnight = "linear-gradient(to bottom right, #000066 0%, #6699ff 100%)";
let evergreen = "linear-gradient(to bottom right, #003300 0%, #33cc33 100%)";
let floral = "linear-gradient(to bottom right, #800000 0%, #cc6699 100%)";
let neutral = "linear-gradient(to bottom right, #000000 0%, #939597 100%)";

$('#neutralImg').click(function(){
  $('#navbar').css('background', neutral);
  $('.dataTables_info').css('background', neutral);
  $('.modal-header').css('background', neutral);
  $('.modal-footer').css('background', neutral);
});
$('#floralImg').click(function(){
  $('#navbar').css('background', floral);
  $('.dataTables_info').css('background', floral);
  $('.modal-header').css('background', floral);
  $('.modal-footer').css('background', floral);
});
$('#evergreenImg').click(function(){
  $('#navbar').css('background', evergreen);
  $('.dataTables_info').css('background', evergreen);
  $('.modal-header').css('background', evergreen);
  $('.modal-footer').css('background', evergreen);
});
$('#midnightImg').click(function(){
  $('#navbar').css('background', midnight);
  $('.dataTables_info').css('background', midnight);
  $('.modal-header').css('background', midnight);
  $('.modal-footer').css('background', midnight);
});
$('#calmImg').click(function(){
  $('#navbar').css('background', calm);
  $('.dataTables_info').css('background', calm);
  $('.modal-header').css('background', calm);
  $('.modal-footer').css('background', calm);
});
$('#originalImg').click(function(){
  $('#navbar').css('background', original);
  $('.dataTables_info').css('background', original);
  $('.modal-header').css('background', original);
  $('.modal-footer').css('background', original);
});
// #navbar
// .dataTables_info
// .modal-header
// .modal-footer