var tableEmployees;
var tableDepartments;
var tableLocations;

$(document).ready(function(){
  tablesSettings('#employeesTable', 'Employees', employeesColumns);
  tablesSettings('#departmentsTable', 'Departments', departmentsColumns);
  tablesSettings('#locationsTable', 'Locations', locationsColumns);
  showPage('#employeesPage','#navEmployeesLinkLi');
  $('#employeesResetBtn').click(function(){tableEmployees.columns().search("").draw(); tableEmployees.search("").draw()});
  tableEmployees.fixedHeader.enable();
}
  );

// EMPLOYEES PAGE
$('#navEmployeesLink').click(function(){
  tableEmployees.columns().search("").draw();
  showPage('#employeesPage','#navEmployeesLinkLi');
  $(window).trigger('resize');
  tableEmployees.ajax.reload();
  $('#navbarCollapse').collapse('hide');
  tableEmployees.fixedHeader.enable();
 });

//Filters
$('#filterEmployeesModal').on('show.bs.modal', function(){
  tableEmployees.columns().search("").draw();
  getFilter(5,'.ddmdepartment', 'Employees');
  getFilter(3,'.ddmjob', 'Employees');
  getFilter(6,'.ddmlocation', 'Employees');
});
//Filter reset buttons

$('#employeesResetSmBtn').click(function(){tableEmployees.columns().search("").draw(); tableEmployees.search("").draw()});
$('#employeesFilterResetBtn').click(function(){
  tableEmployees.columns().search("").draw();
$('.form-control.filterDropdownEmployees').val("");
});
//Add Modal Dropdown
$('#addEmployeesModal').on('show.bs.modal', function(){

  tableDepartments.columns().search("").draw();
  tableEmployees.columns().search("").draw();
  getDropdown(0,'#departmentAddDropdown.depDropdown', 'Departments');
  updateLocation('#locationAddDropdown','#departmentAddDropdown>select');
});
$('#addEmployeesModal').on('hidden.bs.modal', function(){
  tableDepartments.columns().search("").draw();
  tableEmployees.columns().search("").draw();
  $('.addE').val("");
});
// ADD Employee call

$('#addNewEmployeeForm').on('submit', function(e) {
  e.preventDefault();
    $.ajax({
        url: './php/addEmployees.php', 
        type: 'POST',
        dataType: 'json',
        async: false,
        data: {
          'firstName': $('#addFirstName').val(),
          'lastName': $('#addLastName').val(),
          'jobTitle': $('#addJobTitle').val(),
          'email': $('#addEmail').val().toLowerCase(),
          'department': $('#departmentAddDropdown>select').val(),
          'location': $('#locationAddDropdown>select').val()
          
      },
        success: function(response) {
          //console.log('success');   
          if(response.status.code == '200'){
            console.log(response);
          tableEmployees.ajax.reload();
          $('#addEmployeesModal').modal("hide");
          $('#employeesAlert').html(`
          <div class="alert text-center alert-dismissible alert-success fade show" role="alert">
          <strong>✓</strong> New employee added succesfully. 
          <button type="button" class="close" data-dismiss="alert" aria-label="Close">
          <span aria-hidden="true">&times;</span>
          </button>
          </div>
          `);
          setTimeout(function(){$('.alert.text-center').alert('close')}, 4000); 
        } else{
            $('#addEmployeesModal').modal("hide");
          $('#employeesAlert').html(`
          <div class="alert text-center alert-dismissible alert-danger fade show" role="alert">
          <strong>✘</strong> Something went wrong, please try again. 
          <button type="button" class="close" data-dismiss="alert" aria-label="Close">
          <span aria-hidden="true">&times;</span>
          </button>
          </div>
          `);
          setTimeout(function(){$('.alert.text-center').alert('close')}, 4000);
          }
        }
    })
    
    
    
  
});
//Edit and delete Employees button --- Dropdowns and autofilled
let editEmployeeId;
$(document).ajaxStop(function(){
$('#employeesTable tbody').on('click', '.btn.btn-warning.small-edit-button', function(){
  tableDepartments.columns().search("").draw();
  tableEmployees.columns().search("").draw();
  getDropdown(0,'#departmentEditDropdown', 'Departments');
  var data = tableEmployees.row($(this).parents('tr')).data() || tableEmployees.row($(this).parents('li').attr('data-dt-row')).data();
  editEmployeeId = data.id;
  $('#editFirstName').val(data.firstName);
  $('#editLastName').val(data.lastName);
  $('#departmentEditDropdown>select').val(data.department);
  updateLocation('#locationEditDropdown','#departmentEditDropdown>select');
  $('#departmentEditDropdown>select').trigger('change');
  $('#locationEditDropdown>select').val(data.locationID);
  $('#editJobTitle').val(data.jobTitle);
  $('#editEmail').val(data.email);
  $('#editEmployeeModal').modal("show");
});
//delete
$('#employeesTable tbody').on('click', '.btn.btn-danger.small-delete-button.ml-2', function(){
  var data = tableEmployees.row($(this).parents('tr')).data() || tableEmployees.row($(this).parents('li').attr('data-dt-row')).data();
  let deleteId = data.id;
  $("#deleteEmployeeModal").html(`
    <div class="modal-dialog">
    <div class="modal-content">
      <form>
        <div class="modal-header">						
          <h5 class="modal-title w-100 text-center">Delete Employee</h5>
          <button type="button" class="close" data-dismiss="modal" aria-hidden="true">&times;</button>
        </div>
        <div class="modal-body">					
          <p class="text-center">You are about to permanently delete ${data.firstName+" "+data.lastName} from the records, this cannot be undone. Are you sure you wish to continue?</p>
          
        </div>
        <div class="modal-footer">
          <input type="button" class="btn btn-secondary" data-dismiss="modal" value="Cancel">
          <input type="button" class="btn btn-danger" value="Delete" onclick="deleteEmployee(${deleteId})">
        </div>
      </form>
    </div>
  </div>
`);
$("#deleteEmployeeModal").modal('show');
})
});

$('#editEmployeeModal').on('hidden.bs.modal', function(){
  tableDepartments.columns().search("").draw();
  tableEmployees.columns().search("").draw();
  $('.editE').val("");
});

// EDIT Employee call
$('#editEmployeeForm').on('submit',function(e) {
  e.preventDefault();
    $.ajax({
        url: './php/editEmployees.php', 
        type: 'POST',
        dataType: 'json',
        async: false,
        data: {
          'id': editEmployeeId,
          'firstName': $('#editFirstName').val(),
          'lastName': $('#editLastName').val(),
          'jobTitle': $('#editJobTitle').val(),
          'email': $('#editEmail').val().toLowerCase(),
          'department': $('#departmentEditDropdown>select').val(),
          'location': $('#locationEditDropdown>select').val()
          
      },
        success: function(response) {
          //console.log('success'); 
          if(response.status.code == '200'){  
          console.log(response);
          tableEmployees.ajax.reload();
          $('#editEmployeeModal').modal("hide");
          $('#employeesAlert').html(`
          <div class="alert text-center alert-dismissible alert-success fade show" role="alert">
          <strong>✓</strong> Employee edited succesfully. 
          <button type="button" class="close" data-dismiss="alert" aria-label="Close">
          <span aria-hidden="true">&times;</span>
          </button>
          </div>
          `);
          setTimeout(function(){$('.alert.text-center').alert('close')}, 4000);} else{
            $('#addEmployeesModal').modal("hide");
          $('#employeesAlert').html(`
          <div class="alert text-center alert-dismissible alert-danger fade show" role="alert">
          <strong>✘</strong> Something went wrong, please try again. 
          <button type="button" class="close" data-dismiss="alert" aria-label="Close">
          <span aria-hidden="true">&times;</span>
          </button>
          </div>
          `);
          setTimeout(function(){$('.alert.text-center').alert('close')}, 4000);
          }
        }
    })
    
  
});
// DELETE Employee call
function deleteEmployee(deleteId){
  $.ajax({
    url: './php/deleteEmployees.php', 
    type: 'POST',
    dataType: 'json',
    async: false,
    data: {
      'id': deleteId,
      
  },
    success: function(response) {
      console.log('success');   
      console.log(response);
      tableEmployees.ajax.reload();
      
      
    }
})
$('#deleteEmployeeModal').modal("hide");
};

//DEPARTMENT PAGE
$('#navDeptsLink').click(function(){
  tableDepartments.columns().search("").draw();
  $(window).trigger('resize');
  tableDepartments.ajax.reload();
  showPage('#departmentsPage','#navDeptsLinkLi');
  $('#navbarCollapse').collapse('hide');
  $('#departmentsResetBtn').click(function(){tableDepartments.columns().search("").draw();tableDepartments.search("").draw()});
  tableDepartments.fixedHeader.enable();
 });
// Filters
$('#filterDepartmentsModal').on('show.bs.modal', function(){
  tableDepartments.columns().search("").draw();
  getFilter(0,'.ddmdepartment', 'Departments');
  getFilter(1,'.ddmlocation', 'Departments');
});
//Filter reset buttons

$('#departmentsResetSmBtn').click(function(){tableDepartments.columns().search("").draw();tableDepartments.search("").draw()});
$('#departmentsFilterResetBtn').click(function(){
  tableDepartments.columns()
.search("")
.draw();
$('.form-control.filterDropdownDepartments').val("");
});
//Add Modal Dropdown
$('#addDepartmentsModal').on('show.bs.modal', function(){
  tableLocations.columns().search("").draw();
  getDropdown(0,'.locDropdown', 'Locations');
});
$('#addDepartmentsModal').on('hidden.bs.modal', function(){
  tableLocations.columns().search("").draw();
  $('.addD').val("");
});
// ADD Department

$('#addDepartmentForm').on('submit',function(e) {
  e.preventDefault();
  $.ajax({
      url: './php/addDepartments.php', 
      type: 'POST',
      dataType: 'json',
      async: false,
      data: {
        'name': $('#dName').val(),
        'location': $('#addDModalBody>div.form-group.ndropdown>div>select').val(),
        
    },
      success: function(data) {
        console.log(data);
        if(data.status.code == '200'){
       // console.log('success');   
       console.log(data);
       $('#addDepartmentsModal').modal("hide");
       tableDepartments.ajax.reload();
       $('#employeesAlert').html(`
       <div class="alert text-center alert-dismissible alert-success fade show" role="alert">
       <strong>✓</strong> New department added succesfully. 
       <button type="button" class="close" data-dismiss="alert" aria-label="Close">
       <span aria-hidden="true">&times;</span>
       </button>
       </div>
       `);
       setTimeout(function(){$('.alert.text-center').alert('close')}, 4000);} else{
         $('#addEmployeesModal').modal("hide");
       $('#employeesAlert').html(`
       <div class="alert text-center alert-dismissible alert-danger fade show" role="alert">
       <strong>✘</strong> Something went wrong, please try again. 
       <button type="button" class="close" data-dismiss="alert" aria-label="Close">
       <span aria-hidden="true">&times;</span>
       </button>
       </div>
       `);
       setTimeout(function(){$('.alert.text-center').alert('close')}, 4000);
       }
      }, 
      error: function(result){console.log(result)}
  })
  
 
  
});

//Edit and delete departments buttons // Dropdown and autofilled
let editDepartmentId;
$(document).ajaxStop(function(){
  $('#departmentsTable tbody').on('click', '.btn.btn-warning.small-edit-button', function(){
    tableLocations.columns().search("").draw();
   getDropdown(0,'.locDropdown', 'Locations');
    var data = tableDepartments.row($(this).parents('tr')).data() || tableDepartments.row($(this).parents('li').attr('data-dt-row')).data();
    editDepartmentId = data.id;
    $('#editDName').val(data.name);
    getDropdown(0,'#editLoc', 'Locations');
    $('#editLoc>select').val(data.locationName);
    $('#editDepartmentModal').modal("show");
  });
  //delete
  $('#departmentsTable tbody').on('click', '.btn.btn-danger.small-delete-button.ml-2', function(){
    var data = tableDepartments.row($(this).parents('tr')).data() || tableDepartments.row($(this).parents('li').attr('data-dt-row')).data();
    let deleteId = data.id;
    console.log(data);
    $("#deleteDepartmentModal").html(`
      <div class="modal-dialog">
      <div class="modal-content">
        <form>
          <div class="modal-header">						
            <h4 class="modal-title w-100 text-center">Delete Department</h4>
            <button type="button" class="close" data-dismiss="modal" aria-hidden="true">&times;</button>
          </div>
          <div class="modal-body">					
            <p class="text-center">You are about to permanently delete ${data.name} from the records, this cannot be undone. Are you sure you wish to continue?</p>
            
          </div>
          <div class="modal-footer">
            <input type="button" class="btn btn-secondary" data-dismiss="modal" value="Cancel">
            <input type="button" class="btn btn-danger" value="Delete" onclick="deleteDepartment(${deleteId})">
          </div>
        </form>
      </div>
    </div>
  `);
  $("#deleteDepartmentModal").modal('show');
  })
});

  $('#editDepartmentModal').on('hidden.bs.modal', function(){
    tableLocations.columns().search("").draw();
    $('.addD').val("");
  });
  //Edit Department call
  $('#editDepartmentForm').on('submit',function(e) {
    e.preventDefault();
      $.ajax({
          url: './php/editDepartments.php', 
          type: 'POST',
          dataType: 'json',
          async: false,
          data: {
            'id': editDepartmentId,
            'name': $('#editDName').val(),
            'location': $('#editLoc>select').val(),
            
        },
          success: function(response) {
            if(response.status.code == '200'){
            //console.log('success');   
            console.log(response);
            $('#editDepartmentModal').modal("hide");
            tableDepartments.ajax.reload();
            $('#employeesAlert').html(`
          <div class="alert text-center alert-dismissible alert-success fade show" role="alert">
          <strong>✓</strong> Department edited succesfully. 
          <button type="button" class="close" data-dismiss="alert" aria-label="Close">
          <span aria-hidden="true">&times;</span>
          </button>
          </div>
          `);
          setTimeout(function(){$('.alert.text-center').alert('close')}, 4000);} else{
            $('#addEmployeesModal').modal("hide");
          $('#employeesAlert').html(`
          <div class="alert text-center alert-dismissible alert-danger fade show" role="alert">
          <strong>✘</strong> Something went wrong, please try again. 
          <button type="button" class="close" data-dismiss="alert" aria-label="Close">
          <span aria-hidden="true">&times;</span>
          </button>
          </div>
          `);
          setTimeout(function(){$('.alert.text-center').alert('close')}, 4000);
          }
          }
      })
      
    
  });

// DELETE Department call
function deleteDepartment(deleteId){
  $.ajax({
    url: './php/deleteDepartments.php', 
    type: 'POST',
    dataType: 'json',
    async: false,
    data: {
      'id': deleteId,
      
  },
    success: function(response) {
      console.log('success');   
      console.log(response);
      tableDepartments.ajax.reload();
      
      
    }
})
$('#deleteDepartmentModal').modal("hide");
};

//LOCATION PAGE

$('#navLocationsLink').click(function(){
  showPage('#locationsPage','#navLocationsLinkLi');
  tableLocations.ajax.reload();
  $('#navbarCollapse').collapse('hide');
  $('#locationsResetBtn').click(function(){tableLocations.ajax.reload(); tableLocations.search("").draw()});
 });
 $('#addLocationsModal').on('hidden.bs.modal', function(){
  $('.addL').val("");
  tableLocations.fixedHeader.enable();
});



// ADD Location
$('#addLocationForm').on('submit',function(e) {
  e.preventDefault();
    $.ajax({
        url: './php/addLocations.php', 
        type: 'POST',
        dataType: 'json',
        async: false,
        data: {
          'name': $('#lName').val(),
          
      },
        success: function(data) {
          console.log('success'); 
          if(data.status.code == '200'){
            
          console.log(data);
          $('#addLocationsModal').modal("hide");
          tableLocations.ajax.reload(); 
          $('#employeesAlert').html(`
          <div class="alert text-center alert-dismissible alert-success fade show" role="alert">
          <strong>✓</strong> New location added succesfully. 
          <button type="button" class="close" data-dismiss="alert" aria-label="Close">
          <span aria-hidden="true">&times;</span>
          </button>
          </div>
          `);
          setTimeout(function(){$('.alert.text-center').alert('close')}, 4000);} else{
            $('#addEmployeesModal').modal("hide");
          $('#employeesAlert').html(`
          <div class="alert text-center alert-dismissible alert-danger fade show" role="alert">
          <strong>✘</strong> Something went wrong, please try again. 
          <button type="button" class="close" data-dismiss="alert" aria-label="Close">
          <span aria-hidden="true">&times;</span>
          </button>
          </div>
          `);
          setTimeout(function(){$('.alert.text-center').alert('close')}, 4000);
          }
        }
    })

    
  

});

//Edit locations Modal Dropdown and autofilled
let editLocationId;
$(document).ajaxStop(function(){
  
  $('#locationsTable tbody').on('click', '.btn.btn-warning.small-edit-button', function(){
    tableLocations.columns().search("").draw();
    var data = tableLocations.row($(this).parents('tr')).data() || tableLocations.row($(this).parents('li').attr('data-dt-row')).data();
    editLocationId = data.id;
    $('#editLocName').val(data.name);
    $('#editLocationModal').modal("show");
  });
  //delete
$('#locationsTable tbody').on('click', '.btn.btn-danger.small-delete-button.ml-2', function(){
  var data = tableLocations.row($(this).parents('tr')).data() || tableLocations.row($(this).parents('li').attr('data-dt-row')).data();
  let deleteId = data.id;
  $("#deleteLocationModal").html(`
    <div class="modal-dialog">
    <div class="modal-content">
      <form>
        <div class="modal-header">						
          <h4 class="modal-title w-100 text-center">Delete Location</h4>
          <button type="button" class="close" data-dismiss="modal" aria-hidden="true">&times;</button>
        </div>
        <div class="modal-body">					
          <p class="text-center">You are about to permanently delete ${data.name} from the records, this cannot be undone. Are you sure you wish to continue?</p>
          
        </div>
        <div class="modal-footer">
          <input type="button" class="btn btn-secondary" data-dismiss="modal" value="Cancel">
          <input type="button" class="btn btn-danger" value="Delete" onclick="deleteLocation(${deleteId})">
        </div>
      </form>
    </div>
  </div>
`);
$("#deleteLocationModal").modal('show');
})
});

  $('#editLocationModal').on('hidden.bs.modal', function(){
    $('#editLocName').val("");
  });
  //Edit location call
  $('#editLocationForm').on('submit',function(e) {
    e.preventDefault();
      $.ajax({
          url: './php/editLocations.php', 
          type: 'POST',
          dataType: 'json',
          async: false,
          data: {
            'id': editLocationId,
            'name': $('#editLocName').val(),
            
            
        },
          success: function(response) {
            if(response.status.code == '200'){
            console.log('success');   
            console.log(response);
            $('#editLocationModal').modal("hide");
            tableLocations.ajax.reload();
            $('#employeesAlert').html(`
          <div class="alert text-center alert-dismissible alert-success fade show" role="alert">
          <strong>✓</strong> Location edited succesfully. 
          <button type="button" class="close" data-dismiss="alert" aria-label="Close">
          <span aria-hidden="true">&times;</span>
          </button>
          </div>
          `);
          setTimeout(function(){$('.alert.text-center').alert('close')}, 4000);} else{
            $('#addEmployeesModal').modal("hide");
          $('#employeesAlert').html(`
          <div class="alert text-center alert-dismissible alert-danger fade show" role="alert">
          <strong>✘</strong> Something went wrong, please try again. 
          <button type="button" class="close" data-dismiss="alert" aria-label="Close">
          <span aria-hidden="true">&times;</span>
          </button>
          </div>
          `);
          setTimeout(function(){$('.alert.text-center').alert('close')}, 4000);
          }
          }
      })
      
  });
  //DELETE Location call
  function deleteLocation(deleteId){
    $.ajax({
      url: './php/deleteLocations.php', 
      type: 'POST',
      dataType: 'json',
      async: false,
      data: {
        'id': deleteId,
        
    },
      success: function(response) {
        console.log('success');   
        console.log(response);
        tableLocations.ajax.reload();
        
        
      }
  })
  $('#deleteLocationModal').modal("hide");
  };
// loader
$(function() { 
	$('#preloader').fadeOut('slow', function() { 
	  $(this).remove(); 
	});
  });