  function showImage() {
    const pokemonChoice = document.getElementById("pokemon-choice").value;
    const pokemonImages = document.getElementById("pokemon-images");
    const pokemonImg = document.getElementById(`${pokemonChoice}-img`);

    // Hide all images first
    for (let i = 0; i < pokemonImages.children.length; i++) {
      pokemonImages.children[i].classList.add("hidden");
    }

    // Show the image if the user chooses the right option
    if (pokemonImg) {
      pokemonImg.classList.remove("hidden");
    }
  }

