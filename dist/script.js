$(function(){
    
    $('#myForm').on('submit', function(e){
      e.preventDefault();
      $('#ghapidata').html('<div id="loader"><img src="https://i.imgur.com/UqLN6nl.gif" alt="loading..."></div>');
      
      var username = $('#ghusername').val();
      var requri   = 'https://api.github.com/users/'+username;
      var repouri  = 'https://api.github.com/users/'+username+'/repos';
      
      requestJSON(requri, function(json) {
        if(json.message == "Not Found" || username == '') {
          $('#ghapidata').html("<h2>No User Info Found</h2>");
        }
        
        else {
          // else we have a user and we display their info
          var fullname   = json.name;
          var username   = json.login;
          var aviurl     = json.avatar_url;
          var profileurl = json.html_url;
          var location   = json.location;
          var followersnum = json.followers;
          var followingnum = json.following;
          var reposnum     = json.public_repos;
          var bio   = json.bio;
          
          if(fullname == undefined) { fullname = username; }

          var outhtml = '<div class="md:flex"><div class="md:shrink-0"><a href="'+profileurl+'" target="_blank"><img class="h-48 w-full object-cover md:h-full md:w-48" src="'+aviurl+'" alt="'+username+'"></a></div>';
          outhtml = outhtml + '<div class="p-8"><h2 class="block mt-1 text-lg leading-tight font-medium">'+fullname+' <span class="uppercase tracking-wide text-sm  font-semibold">(@<a href="'+profileurl+'" target="_blank">'+username+'</a>)</span></h2> ';
          outhtml = outhtml + '<p>Followers: '+followersnum+' - Following: '+followingnum+' Repos: '+reposnum+'</p> <p class="mt-2">'+bio+' </p> <p class="mt-2">'+location+' </p></div> </div> </div>';
          outhtml = outhtml + '<div class="repolist clearfix hidden">';
          
          var repositories;
          $.getJSON(repouri, function(json){
            repositories = json;   
            outputPageContent();                
          });          
          
          function outputPageContent() {
            if(repositories.length == 0) { outhtml = outhtml + '<p>No repos!</p></div>'; }
            else {
              outhtml = outhtml + '<p><strong>Repos List:</strong></p> <ul>';
              $.each(repositories, function(index) {
                outhtml = outhtml + '<li><a href="'+repositories[index].html_url+'" target="_blank">'+repositories[index].name + '</a></li>';
              });
              outhtml = outhtml + '</ul></div>'; 
            }
            $('#ghapidata').html(outhtml);
          } // end outputPageContent()
        } // end else statement
      }); // end requestJSON Ajax call
    }); // end click event handler  
    
    function requestJSON(url, callback) {
      $.ajax({
        url: url,
        complete: function(xhr) {
          callback.call(null, xhr.responseJSON);
        }
      });
    
    }
  
  });
    