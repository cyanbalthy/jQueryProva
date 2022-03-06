/*var data = /*$.ajax(method:"get", http://localhost:8080/swagger-ui.html, dataType:"json")*/[
                  {
                    "id": 10001,
                    "birthDate": "1953-09-01",
                    "firstName": "Georgi",
                    "lastName": "Facello",
                    "gender": "M",
                    "hireDate": "1986-06-25",
                  },
                  {
                    "id": 10002,
                    "birthDate": "1964-06-01",
                    "firstName": "Bezalel",
                    "lastName": "Simmel",
                    "gender": "F",
                    "hireDate": "1985-11-20",
                  },
                  {
                    "id": 10003,
                    "birthDate": "1959-12-02",
                    "firstName": "Parto",
                    "lastName": "Bamford",
                    "gender": "M",
                    "hireDate": "1986-08-27T22:00:00.000+0000",
                  },
                  {
                    "id": 10004,
                    "birthDate": "1954-04-30",
                    "firstName": "Chirstian",
                    "lastName": "Koblick",
                    "gender": "M",
                    "hireDate": "1986-11-30",

                  },
                  {
                    "id": 10005,
                    "birthDate": "1955-01-20",
                    "firstName": "Kyoichi",
                    "lastName": "Maliniak",
                    "gender": "M",
                    "hireDate": "1989-09-11T22:00:00.000+0000",

                  }
                ];*/
            //var nextId = 10006;
            
            var nextId;
            function updateNextId(){
              $.get(lastPage, function(values,status){
                nextId = values._embedded.employees[countProps(values._embedded.employees)-1].id + 1;
              });
            }

            function updateEmployees() {
            var rows = "";

            $.each(data, function (key, value) {
                  rows += "<tr id='row-"+value.id+"'>";

                  rows += "<td>" + value.id + "</td>";

                  rows += "<td><span id='name-"+value.id+"'>" + value.firstName + "</span><input type='text' class='display-none' id='input-name-"+value.id+"' placeholder='"+value.firstName+"'></td>";

                  rows += "<td><span id='lastname-"+value.id+"'>" + value.lastName + "</span><input type='text' class='display-none' id='input-lastname-"+value.id+"' placeholder='"+value.lastName+"'></td>";

                  rows += "<td>" + "<button class='btn btn-primary' id='change-"+value.id+"' onclick='modify(" + value.id + ")'>Modifica</button>  "+
                  "<button class='delete-button' id='"+value.id+"' onclick='removeEmployee(" + value.id + ")'>Cancella</button>" + "</td>";
                  rows += "</tr>";
                });
                $("#riempi-tab").html(rows);
            }

            function removeEmployee(id){
              $.each(data, function(key, value){
                if(value.id == id){
                  data.splice(key, 1);
                  $("#"+id).closest("tr").remove();
                  return;
                }
              })
            }

            function addEmployee(name, lastname, birth, hiredate, gender){
              data.push({
                "id": nextId,
                "birthDate": birth,
                "firstName": name,
                "lastName": lastname,
                "gender": gender,
                "hireDate": hiredate,
              })
              nextId+=1;
            }

            function saveModalInputs(){
              addEmployee(
                $("#name").val().trim(),
                $("#lastname").val().trim(),
                $("#birthday").val(),
                $("#hiring-date").val(),
                $("#gender").val()
              );
              updateEmployees();
            }

            var nextPage;
            var previousPage;
            var lastPage;
            var selfPage;
            var firstPage = "http://localhost:8080/employees";

            function loadFirstPage(){
              $.get(firstPage, function(values,status){

                lastPage = values._links.last.href;
                nextPage = values._links.next.href;
                selfPage = firstPage;
                previousPage = selfPage;

                data = values._embedded.employees;
                updatePageNumber(values.page.number);
                updateEmployees();

                updateNextId();
              });
            }

            function loadLastPage(){
              $.get(lastPage, function(values,status){

                nextPage = "";
                previousPage = values._links.prev.href;
                selfPage = lastPage;

                data = values._embedded.employees;
                updatePageNumber(values.page.number);
                updateEmployees();
              });
            }

            function loadNextPage(){
              $.get(nextPage, function(values,status){

                previousPage = selfPage;
                selfPage = nextPage;
                nextPage = values._links.next.href;    

                data = values._embedded.employees;
                updatePageNumber(values.page.number);
                updateEmployees();
              });
            }

            function loadPreviousPage(){
              $.get(previousPage, function(values,status){

                nextPage = values._links.next.href;
                selfPage = previousPage;

                previousPage = values._links.prev.href;

                data = values._embedded.employees;
                updatePageNumber(values.page.number);
                updateEmployees();
              });
            }

            function updatePageNumber(number){
              $("#page-counter").text(number+1);
            }

            var data;

            $( window ).on( "load", function() {
              loadFirstPage();
            })

            function emptyModalInputs(){
              $("#name").val("");
              $("#lastname").val("");
              $("#birthday").val("");
              $("#hiring-date").val("");
            }

            function modify(id){
              $("#name-"+id).addClass("display-none");
              $("#input-name-"+id).removeClass("display-none");

              $("#lastname-"+id).addClass("display-none");
              $("#input-lastname-"+id).removeClass("display-none");

              $("#change-"+id).removeClass("btn btn-primary");
              $("#change-"+id).addClass("btn btn-success");
              $("#change-"+id).text("salva");
              $("#change-"+id).attr("onclick", "save_mod('"+id+"')");
            }

            function save_mod(id){
              $("#name-"+id).removeClass("display-none");
              $("#input-name-"+id).addClass("display-none");

              $("#lastname-"+id).removeClass("display-none");
              $("#input-lastname-"+id).addClass("display-none");

              $("#change-"+id).removeClass("btn btn-success");
              $("#change-"+id).addClass("btn btn-primary");
              $("#change-"+id).text("modifica");
              $("#change-"+id).attr("onclick", "modify('"+id+"')");

              let newname=$("#input-name-"+id).val();
              let newlastname=$("#input-lastname-"+id).val();

              if(newname==""){
                newname=$("#name-"+id).text();
              }

              if(newlastname==""){
                newlastname=$("#lastname-"+id).text();
              }

              $("#name-"+id).text(newname);
              $("#lastname-"+id).text(newlastname);
              changeNames(newname, newlastname, id);

              $("#input-name-"+id).attr("placeholder", newname);
              $("#input-lastname-"+id).attr("placeholder", newlastname);

              $("#input-name-"+id).val("");
              $("#input-lastname-"+id).val("");
            }

            function changeNames(name, lastname, id){
              $.each(data, function(key,value){
                if(value.id==id){
                  value.firstname=name;
                  value.lastname=lastname;
                }
              })
            }