$(document).ready(function() {
//set some global variables to hold data results and currently selected employee
   var emps=[];
   var currentEmp = 0;
//ajax method to retrieve API file
   $.ajax({
     url: 'https://randomuser.me/api/?results=12',
     dataType: 'json',
     success: function(data) {
//store data in global var
     emps = data.results.slice();
//call the makeCard function to format the data
      makeCard(emps);
      }//success
    });//ajax


    function makeCard(data){

       var contactCard='';
      //loop through the data and place it in html
       $.each(data, function(i, emp){

             contactCard+= "<a <div class='well employeeBox' id='" + i + "'>";
             contactCard+= "<img src='" + emp.picture.medium +
             "' id='empImg' alt='employee picture' class='img-responsive' >";

             contactCard+=  "<div id='contactInfo'>";
             contactCard+= "<h4 id='empName'>" +
             emp.name.first.charAt(0).toUpperCase()+ emp.name.first.slice(1) +
             ' ' +
             emp.name.last.charAt(0).toUpperCase()+ emp.name.last.slice(1) +
             "</h4>"
             contactCard+= "<div id='empEmail'>" + emp.email + "</div>";
             contactCard+= "<div id='empCity'>" + emp.location.city.charAt(0).toUpperCase()+ emp.location.city.slice(1) + "</div>";
             contactCard += "</div></div></a>";

            //  place each one on the page
             $('#cardContainer').html(contactCard);

                  });//each

    }
//set the click function to select employee details
        $(document).on('click', 'a', function(e){

          var selectedEmp = emps[e.currentTarget.id];

      currentEmp= $(this).attr('id');

        getDetails(selectedEmp);
        $("#myModal").modal();

        });//click
//click function to view previous employee
        $('#previous').on('click', function(e){
         var prevEmp =emps[currentEmp-1];
           currentEmp --;
          getDetails(prevEmp);
        });//click prev

//click function to view next employee
        $('#next').on('click', function(e){
          var nextEmp = emps[currentEmp+1];
          currentEmp ++;
          getDetails(nextEmp);
        });//click next


//form submit function to search employees
            $( "#form" ).submit(function( event ) {
            var searchTerm = $('#search').val().toLowerCase();
            event.preventDefault();
             getResults(emps, searchTerm);
            $('#search').val('');
         });//submit

//get extra employee information and format // add to modal

            function getDetails(selectedEmp){

               var firstName= selectedEmp.name.first.charAt(0).toUpperCase()+ selectedEmp.name.first.slice(1);
               var lastName= selectedEmp.name.last.charAt(0).toUpperCase()+ selectedEmp.name.last.slice(1);
               var detailImg= selectedEmp.picture.large;
               var empUserName=selectedEmp.login.username;
               var empUserEmail=selectedEmp.email;
               var empCellPhone=selectedEmp.cell;
               var empDob= moment(selectedEmp.dob).format('MM/DD/YYYY');
               var empStreet=makeUpperCase(selectedEmp.location.street);
               var empCity=makeUpperCase(selectedEmp.location.city);
               var empState=selectedEmp.location.state.charAt(0).toUpperCase()+ selectedEmp.location.state.slice(1);
               var empPostCode=selectedEmp.location.postcode;

               $('#modal-title').html(firstName + " " + lastName);
               $('#selectedEmpImg').attr('src', detailImg);
               $('#username').html(empUserName);
               $('#email').html(empUserEmail);
               $('#cell').html(empCellPhone);
               $('#birthdate').html('Birthdate: ' + empDob);

               $('#address').html(empStreet + '<br/>' + empCity + " , "+empState + " " + empPostCode);


            }//getDetails

//helper function to match search term to employee name and username

            function getResults(data, term){

               var rgxsearch = term + '+';
               var regexp = new RegExp(term, "gi");
              var results=[];

               $.each(emps, function(i, emp){

                  var empFirstName = emp.name.first;
                  var empLastName = emp.name.last;
                  var empUserName = emp.login.username;
                  var empId = i;
//if there is a match make a card and display it
            if(empFirstName.match(regexp)  ||empLastName.match(regexp) || empUserName.match(regexp)){
            results.push(data[empId]);
            }//if
               });//each
            if(results.length>0){
               emps=[];
               $('#cardContainer').html("");
                emps=results.slice();
               makeCard(emps);
            }

            }//getResults
//helper function to make Names UpperCase
            function makeUpperCase(str)
            {
                return str.replace(/\w\S*/g, function(txt){return txt.charAt(0).toUpperCase() + txt.substr(1).toLowerCase();});
            }

});//doc ready
