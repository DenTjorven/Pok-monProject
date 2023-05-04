      // Get modal element
      var modal = document.getElementById("modal");

      // Get modal trigger elements
      var modalTriggers = document.querySelectorAll(".modal-trigger");

      // Get close button
      var closeButton = document.querySelector(".close");

      // Open modal on click
      modalTriggers.forEach(function (trigger) {
        trigger.addEventListener("click", function (event) {
          event.preventDefault();
          modal.style.display = "flex";
        });
      });
      // Close modal on click
    closeButton.addEventListener("click", function () {
    modal.style.display = "none";
  });
  
  // Close modal on outside click
  window.addEventListener("click", function (event) {
    if (event.target == modal) {
      modal.style.display = "none";
    }
  });
  