
var authKey = "PunvAMm65w6cXjYDAbi01tl4hhmrIb59";

    // variable to track number of articles
    var articleCounter = 0;
    
    $("#submit").on("click", function () {
    
      var userEntry = $("#searchInput").val();
      // queryURL is the url we'll use to query the API
      var queryURL = "https://api.nytimes.com/svc/search/v2/articlesearch.json?q=" + userEntry + "&news_desk:('technology')&api-key=PunvAMm65w6cXjYDAbi01tl4hhmrIb59";
      // Begin building an object to contain our API call's query parameters
      // Set the API key
    
      // Grab text the user typed into the search input, add to the queryParams object
    
      $.ajax({
        url: queryURL,
        method: 'GET'
      }).then(function (response) {
        console.log(response.response);
        $('#articles').empty();
    
        for (var i = 0; i < response.response.docs.length; i++) {
          // create new row
          var newRow = $('<tr>');
          newRow.attr('data-ID', response.response.docs[i]._id);
          newRow.append('<td>' + response.response.docs[i].headline.main + '</td>');
          newRow.append('<td><a href="' + response.response.docs[i].web_url + ' target="_blank"><button type="button" class="btn btn-info">Read More</button></td>');
    
    
    
    
          // append it onto the search-body tably
          $('#articles').append(newRow);
          $('#articles').append("<tr class='spacer'></tr>");
        };
      })
    
    });
    
    function NYT() {
        // queryURL is the url we'll use to query the API
        // var queryURL = "https://api.nytimes.com/svc/news/v3/content/all/all.json?&api-key=MnemG5WzI6XTAXqn55SrKwgKJXzcahEG";
        var queryURL = "https://api.nytimes.com/svc/topstories/v2/technology.json?&api-key=MnemG5WzI6XTAXqn55SrKwgKJXzcahEG"
        // var searchParam = "&q=technology"
        // Begin building an object to contain our API call's query parameters
        // Set the API key
    
    
        // Grab text the user typed into the search input, add to the queryParams object
    
    
        $.ajax({
            url: queryURL,
            method: 'GET'
          }).then(function(response) {
              console.log(response)
              $('#article').empty();
    
              for (var i = 0; i <= response.results.length; i++) {
    
    
                // create new row
                var newRow = $('<tr>');
                newRow.attr('data-ID', response.results[i].id);
                newRow.append('<td><img src="'+ response.results[i].multimedia[0].url +'"/></td>');
                newRow.append('<td><strong>' + response.results[i].title +'</strong><br/>'+
                    response.results[i].abstract +'<br/><a href="'+ response.results[i].url + '" target="_blank"><button type="button" class="btn btn-info btn-sm">Read More</button></td>');
    
    
                // append it onto the search-body tably
                $('#article').append(newRow);
                $('#article').append("<tr class='spacer'></tr>");
          };
        })
    }
        NYT();