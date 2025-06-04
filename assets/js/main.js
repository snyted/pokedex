const olPokemons = document.querySelector(".pokemons");
const loadMoreButton = document.querySelector("#load-more-button");
const modalContainer = document.querySelector(".modal-container");

const pokemonsFavs = [];
const pokemonInfos = [];
const limit = 5;
let offset = 0;

async function loadPokemonItens(offset, limit) {
  const pokemons = await pokeApi.getPokemon(offset, limit);
  let addToHtml = "";
  pokemons.map((pokemon) => {
    pokemonInfos.push(pokemon);
    addToHtml += convertPokemonToLi(pokemon);
  });

  olPokemons.innerHTML += addToHtml;

  pokemonInfos.forEach((pokemon) => {
    console.log(pokemon.name);
  });

  gettingCurrentPokemon();
}

// Função para converter o pokemon para HTML
function convertPokemonToLi(pokemon) {
  const isFavorited = pokemonsFavs.includes(pokemon.name);

  return `
  <li class="pokemon ${pokemon.type}" data-pokemon='${JSON.stringify(pokemon)}'>
    ${isFavorited ? '<span class="favorite-heart">❤️</span>' : ""}
    <span class="number">#${pokemon.number}</span>
    <span class="name">${pokemon.name}</span>
    <div class="detail">
      <ol class="types">
        ${pokemon.types
          .map((type) => `<li class="type ${pokemon.type}">${type}</li>`)
          .join("")}
      </ol>
      <img src="${pokemon.photo}" alt="${pokemon.name}"/>
    </div>
  </li>
  `;
}

// Função para pegar o pokemon clicado
function gettingCurrentPokemon() {
  document.querySelectorAll(".pokemon").forEach((pokemonItem) => {
    pokemonItem.addEventListener("click", (event) => {
      const pokemonData = JSON.parse(event.currentTarget.dataset.pokemon);
      openModal(pokemonData);
    });
  });
}

function openModal(pokemon) {
  const backToPokedexSrc = "assets/img/back-to-pokedex.png";
  let favSrc = "";

  modalAnimation();
  modalContainer.className = "modal-container";
  modalContainer.classList.add(pokemon.type);

  if (pokemonsFavs.includes(pokemon.name)) {
    favSrc = "assets/img/favoriteson.png";
  } else {
    favSrc = "assets/img/white-heart.svg";
  }

  modalContainer.innerHTML = `
    <div class="options">
      <button class="back-to-pokedex">
        <img src="${backToPokedexSrc}" alt="Voltar para Pokedex" height="30" width="30" onclick="closeModal()">
      </button>
      <img src="${favSrc}" id="favorites-toggle" height="30" width="30" onclick="addToFavorites('${
    pokemon.name
  }')" alt="Favoritar">
    </div>
    <div class="info-header">
      <div class="pokemon-name-and-type">
        <span class="pokemon-name">${pokemon.name}</span>
        <ol class="types-modal">
          ${
            pokemon.types
              ? pokemon.types
                  .map((type) => `<li class="${pokemon.type}">${type}</li>`)
                  .join("")
              : ""
          }
        </ol>
      </div>
      <p class="number-modal">#${pokemon.number}</p>
    </div>
    <img src="${pokemon.photo}" alt="${pokemon.name}">
    <div class="pokemon-infos">
      <ol>
        <li><span class="title">Description</span> <div class="information">${
          pokemon.description || "N/A"
        }</div></li>
        <li><span class="title">Height</span> <div class="information">${
          pokemon.height || "N/A"
        }</div></li>
        <li><span class="title">Weight</span> <div class="information">${
          pokemon.weight || "N/A"
        }</div></li>
        <li><span class="title">Abilities</span> <div class="information">${
          pokemon.abilities ? pokemon.abilities.join(", ") : "N/A"
        }</div></li>
        <li><span class="title">Base Experience</span> <div class="information">${
          pokemon.baseExperience || "N/A"
        }</div></li>
      </ol>
    </div>
  `;
}

// Animação para abrir o modal
function modalAnimation() {
  modalContainer.style.transition = "opacity 0.3s ease-in-out";
  modalContainer.style.display = "flex";
  modalContainer.style.opacity = "0";
  requestAnimationFrame(() => {
    modalContainer.style.opacity = "1";
  });
}

// Eventos de carregar mais pokémons
loadMoreButton.addEventListener("click", () => {
  offset += limit;
  loadPokemonItens(offset, limit);
  if (offset + limit >= 151) {
    loadMoreButton.parentElement.removeChild(loadMoreButton);
  }
});

// Botões do site
function menuOnClick() {
  document.getElementById("menu-bar").classList.toggle("change");
  document.getElementById("nav").classList.toggle("change");
}

function closeModal() {
  modalContainer.style.display = "none";
}

function toggleDarkMode() {
  const darkModeToggle = document.getElementById("dark-mode-toggle");
  const isOff = darkModeToggle.src.includes("darkmodeoff");
  darkModeToggle.src = isOff
    ? "assets/img/darkmodeon.png"
    : "assets/img/darkmodeoff.png";
}

function addToFavorites(pokemonFavoritedName) {
  const favoriteToggle = document.getElementById("favorites-toggle");

  if (favoriteToggle.src.includes("white-heart")) {
    pokemonsFavs.push(pokemonFavoritedName);
    favoriteToggle.src = "assets/img/favoriteson.png";
  } else if (favoriteToggle.src.includes("favoriteson")) {
    const index = pokemonsFavs.indexOf(pokemonFavoritedName);
    pokemonsFavs.splice(index, 1);
    favoriteToggle.src = "assets/img/white-heart.svg";
  }


}

function openFavorites() {
  const favId = document.getElementById("favorites-open");
  const isOff = favId.src.includes("favoritesoff");

  if (isOff) {
    favId.src = "assets/img/favoriteson.png";
    loadMoreButton.style.display = "none";

    olPokemons.innerHTML = "";

    const favoritosUnicos = pokemonInfos.filter((pokemon, index, self) =>
      pokemonsFavs.includes(pokemon.name) &&
      index === self.findIndex(p => p.name === pokemon.name)
    );

    olPokemons.innerHTML = favoritosUnicos
      .map(pokemon => convertPokemonToLi(pokemon))
      .join('');
  } else {
    favId.src = "assets/img/favoritesoff.png";
    olPokemons.innerHTML = "";

    loadPokemonItens(offset, limit);

    loadMoreButton.style.display = "block";
  }
}

// Carregar os primeiros pokémons
loadPokemonItens(offset, limit);
