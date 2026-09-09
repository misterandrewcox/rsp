// Ribbon & Ink — lightweight, dependency-free form handling.
// Neither form has a backend yet — this just gives visitors real feedback
// so the site doesn't feel broken. Wire these up to an actual email
// service / inbox before launch.

document.addEventListener('DOMContentLoaded', function () {
  var signupForm = document.getElementById('signup-form');
  if (signupForm) {
    var note = document.getElementById('form-note');
    var defaultNote = note.textContent;

    signupForm.addEventListener('submit', function (e) {
      e.preventDefault();
      var email = document.getElementById('email').value.trim();
      if (!email) return;

      note.textContent = "You're on the list — thank you!";
      note.classList.add('success');
      signupForm.reset();

      setTimeout(function () {
        note.textContent = defaultNote;
        note.classList.remove('success');
      }, 5000);
    });
  }

  var submissionForm = document.getElementById('submission-form');
  if (submissionForm) {
    var subNote = document.getElementById('submission-note');

    submissionForm.addEventListener('submit', function (e) {
      e.preventDefault();
      subNote.textContent = "Thanks — this demo form doesn't send anywhere yet, but once it's wired up, submissions like this will reach our editorial team.";
      subNote.classList.add('success');
    });
  }
});
