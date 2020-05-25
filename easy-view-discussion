// ==UserScript==
// @name         Display Discussion Text
// @namespace
// @version      1.0
// @description  Copy/Paste the discussion's text
// @author       Matt Batko
// @include      https://*.instructure.com/courses/*/discussion_topics/*
// @require      https://ajax.googleapis.com/ajax/libs/jquery/3.4.1/jquery.min.js

// ==/UserScript==

(function() {

     // import bootstrap so we can use modals
        // I realize we use jQuery to import jQuery a few lines down, but it won't work otherwise ¯\_(ツ)_/¯
     $(document).ready ( function(){
        'use strict';
        $('head').append('<link rel="stylesheet" href="https://stackpath.bootstrapcdn.com/bootstrap/4.4.1/css/bootstrap.min.css" integrity="sha384-Vkoo8x4CGsO3+Hhxv8T/Q5PaXtkKtu6ug5TOeNV6gBiFeWPGFN9MuhOf23Q9Ifjh" crossorigin="anonymous">');
        $('body').append(`
        <script src="https://code.jquery.com/jquery-3.2.1.slim.min.js" integrity="sha384-KJ3o2DKtIkvYIK3UENzmM7KCkRr/rE9/Qpg6aAZGJwFDMVNA/GpGFF93hXpG5KkN" crossorigin="anonymous"></script>
        <script src="https://cdnjs.cloudflare.com/ajax/libs/popper.js/1.12.9/umd/popper.min.js" integrity="sha384-ApNbgh9B+Y1QKtv3Rn7W3mgPxhU9K/ScQsAP7hUibX39j7fakFPskvXusvfa0b4Q" crossorigin="anonymous"></script>
        <script src="https://maxcdn.bootstrapcdn.com/bootstrap/4.0.0/js/bootstrap.min.js" integrity="sha384-JZR6Spejh4U02d8jOt6vLEHfe/JQGiRRSQQxSfFWpi1MquVdAyjUar5+76PVCmYl" crossorigin="anonymous"></script>
    `);

        const parent = document.querySelector('#right-side-wrapper');

        const modalContent = `
<div class="modal-dialog modal-lg" role="document">
<div class="modal-content">

  <div class="modal-header">
    <h5 class="modal-title">${document.querySelector('h1.discussion-title').innerText}</h5>
    <button type="button" class="close" data-dismiss="modal" aria-label="Close">
      <span aria-hidden="true">&times;</span>
    </button>
  </div> <!-- end modal header -->

  <div class="modal-body pb-4" id="buildQuestionInputWrapper">


    <div id="carousel" class="carousel slide" data-interval="false">
       <div class="carousel-inner">

           <div class="carousel-item pb-4 active">
            <div id="posts"></div>
            <button class="btn btn-primary" type="button" id="copyText">Copy Discussions</button>
            <button class="btn btn-primary cycle" type="button" onclick="$('.carousel').carousel('next');">View List of Participants</button>
           </div>

           <div class="carousel-item pb-4">
              <ul id="participants-list" class="list-group list-group-flush">

              </ul>
              <br>
              <button class="btn btn-primary" type="button" id="copyParticipants">Copy Participants</button>
              <button class="btn btn-primary cycle" type="button" onclick="$('.carousel').carousel('next');">View Posts</button>

           </div>

       </div>
         </div>


  <div class="modal-footer">
    <button type="button" class="btn btn-secondary" data-dismiss="modal">Close</button>
  </div>
</div>
</div>
</div>

`;

        const modal = document.createElement('div');
        modal.classList.add('modal');
        modal.setAttribute('tabindex', '-1');
        modal.setAttribute('role', 'dialog');
        modal.setAttribute('id', 'contentModal');
        modal.style.cssText = "";
        modal.innerHTML = modalContent;

        document.querySelector('body').append(modal);

        const el = document.createElement('button');

        el.classList.add('Button', 'element_toggler', 'button-sidebar', 'btn', 'btn-outline-primary');
        el.setAttribute('type', 'button');
        el.setAttribute('id', 'displayQuizButton');
        // open modal and display the text
        el.setAttribute('data-toggle', 'modal');
        el.setAttribute('data-target', '#contentModal');

        el.style.marginTop = '10px';
        el.style.marginBottom = '10px';
        el.style.width = '100%';


        const icon = document.createElement('i');
        icon.classList.add('icon-document');
        el.append(icon);
        const text = ' Easy View ';
        el.append(text);

        parent.append(el);

        document.querySelector('#copyText').addEventListener('click', function(e) {
            e.preventDefault();
            const text = document.querySelector("#posts").innerText;
            navigator.clipboard.writeText(text).then(function() {
                console.log('Copying to clipboard was successful!');
            }, function(err) {
                console.error('Async: Could not copy text: ', err);
            });
        });

        document.querySelector('#copyParticipants').addEventListener('click', function(e) {
            e.preventDefault();
            const text = document.querySelector("#participants-list").innerText;
            navigator.clipboard.writeText(text).then(function() {
                console.log('Copying to clipboard was successful!');
            }, function(err) {
                console.error('Async: Could not copy text: ', err);
            });
        });

        // get url
        const href = window.location.href;
        // get the institution, course #, and quiz #, then inject into the URL
        const exp = new RegExp('https://([a-zA-Z]+).instructure.com/courses/([0-9]+)/discussion_topics/([0-9]+)');
        const matches = href.match(exp);

        const url = `https://${matches[1]}.instructure.com/api/v1/courses/${matches[2]}/discussion_topics/${matches[3]}/view`;


        $.ajax({
            url: url,
            type: 'GET',
            async: true,
            dataType:   'JSON'
        })
        .then( function(res) {
            const users = {}
            $.each( res.participants, function(index, value) {
                users[value.id] = value.display_name;
                $('#participants-list').append('<li class="list-group-item">' + value.display_name + '</li>');
            });

            $.each( res.view, function(index, value) {
                console.log(value);
                let replies = '';
                if(value.replies) {
                    replies += "<p><strong>Replies:</strong></p><ol>";
                    $.each( value.replies, function(index, value) {
                        replies += `<li>
User: ${users[value.user_id]}<br>
Post Text: ${value.message}
Last Updated: ${value.updated_at}</li>
`;
                    });
                    replies += '</ol>';
                }

                if(!value.deleted)
                    $('#posts').append(`
<p><strong>User:</strong> ${users[value.user_id]}</p>
<strong>Post Text:</strong>${value.message}
<p><strong>Last Updated:</strong> ${value.updated_at}</p>
${replies}
<p style="border-bottom: 1px solid grey;"></p>
`);
            });


        });
 });
})();
