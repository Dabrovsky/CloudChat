$(function() {

    // Firebase data config -----------------------------------
    const config = {
      apiKey: "AIzaSyBjhQope9EjGkLM7VNrL3nGh7mmfEnz79U",
      databaseURL: "https://coderslab-project.firebaseio.com",
    };
    const app = firebase.initializeApp(config);
    const chat = app.database().ref('chat');
    // --------------------------------------------------------

    // Default hide -------------------------------------------
    $('.chat').hide();
    $('.alert').hide();
    $('.err').hide();

    $('#login').keyup(function () {
      const inputName = $('#login').val();
        if (inputName.length > 0 & inputName.length < 4 || inputName.length > 20) {
            $('.alert').fadeIn(100);
        } else if (inputName.length < 1) {
            $('.alert').fadeOut(100);
        } else {
            $('.alert').fadeOut(100);
        }
    });

    // Login form ---------------------------------------------
    $('#log-in').on('click', function() {
    event.preventDefault();

        const inputName = $('#login').val();
        $('.user-content-text').text(`Witaj, ${inputName}`);

        if (inputName.length === 0 || inputName.length > 0 & inputName.length < 4 || inputName.length > 20) {
            $('.alert').fadeIn(100);
        } else {
            $('.alert').fadeOut(100);
            // SessionStorage
            const session = [
                              {
                                value: inputName
                              }
                            ]
            sessionStorage.setItem('logged', JSON.stringify(session));

            $(".login").trigger("reset");

            $(".welcome").fadeOut(300, function() {
                $(".chat").fadeIn(800);
            });

      };

    });
    // --------------------------------------------------------

    // Date for new chat message ------------------------------
    const newDate = new Date();
    const days = ["Niedziela", "Poniedziałek", "Wtorek", "Środa", "Czwartek", "Piątek", "Sobota"];
    const months = ["Styczeń", "Luty", "Marzec", "Kwiecień", "Maj", "Czerwiec", "Lipiec", "Sierpień", "Wrzesień", "Październik", "Listopad", "Grudzień"];
    // --------------------------------------------------------

    // Textarea letter counter --------------------------------
    let letterCount = 400;
    $('.letterCount').text(`Pozostało ${letterCount} znaków`);

    $('#message').keyup(function() {
        let contentLength = $('#message').val().length;
        $('.letterCount').text(`Pozostało ${letterCount - contentLength} znaków`);
    });
    // --------------------------------------------------------

    // New chat message ---------------------------------------
    $('#btn').on('click', function() {
    event.preventDefault();

        // SessionStorage get items ---------------------------
        const getSession = sessionStorage.getItem('logged');
        const sessionValue = $.parseJSON(getSession);
        // ----------------------------------------------------

        if (getSession != null) {
          const userName = sessionValue[0].value;
          const message = $('#message').val();


          if (message.length < 10) {
              $('.err').text('Wiadomośc musi zawierac co najmniej 10 znaków').fadeIn(100);
          } else {
              $('.err').fadeOut(100);
              newChat = chat.push({
                        author: userName,
                        message: message,
                        date: `${days[newDate.getDay()]}, ${newDate.getDate()} ${months[newDate.getMonth()]}`
                      });
              $("#chat").trigger("reset");
              $('.letterCount').text(`Pozostało ${letterCount} znaków`);

          };

        };

    });
    // --------------------------------------------------------

    // Add a callback for each chat message -------------------
    chat.limitToFirst(10).on("child_added", function(data) {

        const message = data.val();
        const chatBox = $(`<div class="panel">
                            <div class="chat-box">
                              <div class="panel-left">
                                <img src="src/img/user.png" class="user-img" alt="user-img">
                                </div>
                                <div class="panel-right">
                                  <div class="head">
                                    <span class="author">${message.author}</span>
                                    <span class="date">${message.date}</span>
                                  </div>
                                  <p class="chat-text">${message.message}</p>
                                  <span class="deletePost" data-key=${data.key}><i class="fa fa-trash-o" aria-hidden="true"></i> Usuń</span>
                                  <span class="like-up"><i class="fa fa-thumbs-o-up" aria-hidden="true"></i> Lubię to</span>
                                </div>
                              </div>
                            </div>`);
        $(chatBox).hide().appendTo('.chatBox').fadeIn('slow');

        // Like button
    //    $('.deletePost').each(function() {
    //      $(this).on('click', function() {
    //        let key = $(this).attr('data-key');
    //        app.database().ref(`chat/${key}`).remove();
    //        $(this).addClass('active');
    //      });
    //    });

    });
    // --------------------------------------------------------

    // Delete post
    $(document).on('click','.deletePost',function() {
        let key = $(this).attr('data-key');
        app.database().ref(`chat/${key}`).remove();
        $(this).closest('.panel').remove();
    });

});
