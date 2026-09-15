// Red Stain Press — lightweight, dependency-free form handling.
// Newsletter signups post to Google Apps Script / Google Sheets.
// The submissions form continues to post to Formspree.

document.addEventListener('DOMContentLoaded', function () {
  var signupForm = document.getElementById('signup-form');

  if (signupForm) {
    var note = document.getElementById('form-note');
    var emailInput = document.getElementById('email');
    var signupBtn = signupForm.querySelector('button[type="submit"]');
    var endpoint = signupForm.getAttribute('data-endpoint');
    var defaultNote = note.textContent;
    var defaultBtnText = signupBtn.textContent;

    signupForm.addEventListener('submit', function (e) {
      e.preventDefault();

      note.classList.remove('success', 'error');

      if (!emailInput.checkValidity()) {
        note.textContent = 'Please enter a valid email address.';
        note.classList.add('error');
        emailInput.focus();
        return;
      }

      var email = emailInput.value.trim();
      signupBtn.disabled = true;
      signupBtn.textContent = 'Joining…';
      note.textContent = 'Adding you to the list…';

      // Google Apps Script web apps do not expose a browser-readable CORS
      // response by default. A no-cors text/plain POST reliably reaches the
      // script while keeping the signup experience on this page.
      fetch(endpoint, {
        method: 'POST',
        mode: 'no-cors',
        keepalive: true,
        headers: {
          'Content-Type': 'text/plain;charset=utf-8'
        },
        body: JSON.stringify({
          email: email,
          source: 'Website — homepage'
        })
      })
        .then(function () {
          note.textContent = "You're on the list — thank you!";
          note.classList.add('success');
          signupForm.reset();
        })
        .catch(function () {
          note.textContent = 'Something went wrong. Please try again.';
          note.classList.add('error');
        })
        .finally(function () {
          signupBtn.disabled = false;
          signupBtn.textContent = defaultBtnText;

          setTimeout(function () {
            note.textContent = defaultNote;
            note.classList.remove('success', 'error');
          }, 6000);
        });
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
                : 'Something went wrong sending your submission.';
              throw new Error(message);
            });
          }
        })
        .catch(function () {
          subNote.textContent = 'Something went wrong sending your submission — please try again, or email us directly at submissions@redstainpress.com.';
          subNote.classList.add('error');
        })
        .finally(function () {
          submitBtn.disabled = false;
          submitBtn.textContent = defaultBtnText;
        });
    });
  }
});
