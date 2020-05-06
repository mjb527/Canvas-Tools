// ==UserScript==
// @name         Download Canvas Quiz
// @namespace
// @version      1.0
// @description  Allows the user to copy Canvas quiz questions and answers with an API call
// @author       Matt Batko
// @include      https://*.instructure.com/courses/*/quizzes/*/edit
// @require      https://ajax.googleapis.com/ajax/libs/jquery/3.4.1/jquery.min.js
// @require      https://code.jquery.com/ui/1.12.1/jquery-ui.js


// ==/UserScript==
(function() {
    $(document).ready ( function(){

        // import bootstrap so we can use modals
        $('head').append('<link rel="stylesheet" href="https://stackpath.bootstrapcdn.com/bootstrap/4.4.1/css/bootstrap.min.css" integrity="sha384-Vkoo8x4CGsO3+Hhxv8T/Q5PaXtkKtu6ug5TOeNV6gBiFeWPGFN9MuhOf23Q9Ifjh" crossorigin="anonymous">');
        $('body').append(`<script src="https://code.jquery.com/jquery-3.2.1.slim.min.js" integrity="sha384-KJ3o2DKtIkvYIK3UENzmM7KCkRr/rE9/Qpg6aAZGJwFDMVNA/GpGFF93hXpG5KkN" crossorigin="anonymous"></script>
<script src="https://cdnjs.cloudflare.com/ajax/libs/popper.js/1.12.9/umd/popper.min.js" integrity="sha384-ApNbgh9B+Y1QKtv3Rn7W3mgPxhU9K/ScQsAP7hUibX39j7fakFPskvXusvfa0b4Q" crossorigin="anonymous"></script>
<script src="https://maxcdn.bootstrapcdn.com/bootstrap/3.4.1/js/bootstrap.min.js" integrity="sha384-JZR6Spejh4U02d8jOt6vLEHfe/JQGiRRSQQxSfFWpi1MquVdAyjUar5+76PVCmYl" crossorigin="anonymous"></script>`);


        //document.querySelector('style').append(`.modal-backdrop {opacity: .5 !imporant}`);
        //console.log(document.querySelector('head'));

        const parent = document.querySelector('#right-side');

        const modalContent = `
  <div class="modal-dialog" role="document">
    <div class="modal-content">
      <div class="modal-header">
        <h5 class="modal-title">${document.querySelector('#quiz_title').value}</h5>
        <button type="button" class="close" data-dismiss="modal" aria-label="Close">
          <span aria-hidden="true">&times;</span>
        </button>
      </div>
      <div class="modal-body" id="modal-body">
      </div>
      <div class="modal-footer">
        <button type="button" class="btn btn-primary" id="copyText">Copy to Clipboard</button>
        <button type="button" class="btn btn-secondary" data-dismiss="modal">Close</button>
      </div>
    </div>
  </div>`;

        const modal = document.createElement('div');
        modal.classList.add('modal');
        modal.setAttribute('tabindex', '-1');
        modal.setAttribute('role', 'dialog');
        modal.setAttribute('id', 'contentModal');
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
        const text = ' View Questions As Text ';
        el.append(text);

        parent.append(el);

        document.querySelector('#copyText').addEventListener('click', function(e) {
            e.preventDefault();
            const text = document.querySelector("#modal-body").innerText;
            navigator.clipboard.writeText(text).then(function() {
                console.log('Copying to clipboard was successful!');
            }, function(err) {
                console.error('Async: Could not copy text: ', err);
            });
        });

        // get url
        const href = window.location.href;
        // get the institution, course #, and quiz #, then inject into the URL
        const exp = new RegExp('https://([a-zA-Z]+).instructure.com/courses/([0-9]+)/quizzes/([0-9]+)/edit');
        const matches = href.match(exp);

        const url = `https://${matches[1]}.instructure.com/api/v1/courses/${matches[2]}/quizzes/${matches[3]}/questions.json?per_page=500`;

        $.ajax ( {
            async :     true,
            type:       'GET',
            url:        url,
            dataType:   'JSON'
        })
            .then(function(response) {
                let returnContent = document.createElement('div');
                console.log(response);
                $.each(response, function(index, value) {
                    // question title
                    const qName = document.createElement('h5');
                    qName.innerText = index + 1 + ") " + value.question_name + "  -  Points: " + value.points_possible;

                    // question text
                    const qText = document.createElement('div');
                    qText.innerHTML = value.question_text;

                    returnContent.append(qName);
                    returnContent.append(qText);

                    // list of answers, marks the correct answer(s) based on weight property
                    const answersWrapper = document.createElement('div');
                    answersWrapper.innerText = 'Answers:';
                    const answers = document.createElement('ol');
                    answersWrapper.append(answers);

                    $.each(value.answers, function(i, answer) {
                        let li = document.createElement('li');
                        if(answer.weight > 0) li.innerText = answer.text + " (Correct)";
                        else li.innerText = answer.text;
                        answers.append(li);
                    });
                    returnContent.append(answersWrapper);

                    returnContent.append(document.createElement('br'));
                });

                document.querySelector('#modal-body').append(returnContent);
             }); // end .then()


    });



})();
