// Red Stain Press — lightweight, dependency-free form handling.
// The home page signup is still a demo (no backend yet). The submissions
// form posts to Formspree via fetch so visitors get an inline confirmation
// instead of being redirected off the site.

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
    var submitBtn = submissionForm.querySelector('button[type="submit"]');
    var defaultBtnText = submitBtn.textContent;

    submissionForm.addEventListener('submit', function (e) {
      e.preventDefault();

      subNote.classList.remove('success', 'error');
      subNote.textContent = '';
      submitBtn.disabled = true;
      submitBtn.textContent = 'Sending…';

      fetch(submissionForm.action, {
        method: 'POST',
        body: new FormData(submissionForm),
        headers: { Accept: 'application/json' }
      })
        .then(function (response) {
          if (response.ok) {
            subNote.textContent = "Thank you — your submission has been sent. We'll be in touch if it's a fit.";
            subNote.classList.add('success');
            submissionForm.reset();
          } else {
            return response.json().then(function (data) {
              var message = (data && data.errors && data.errors.length)
                ? data.errors.map(function (err) { return err.message; }).join(', ')
                : "Something went wrong sending your submission.";
              throw new Error(message);
            });
          }
        })
        .catch(function () {
          subNote.textContent = "Something went wrong sending your submission — please try again, or email us directly at submissions@redstainpress.com.";
          subNote.classList.add('error');
        })
        .finally(function () {
          submitBtn.disabled = false;
          submitBtn.textContent = defaultBtnText;
        });
    });
  }
});
