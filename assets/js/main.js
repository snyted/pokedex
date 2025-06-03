const olPokemons = document.querySelector(".pokemons");
const loadMoreButton = document.querySelector("#load-more-button");
const modalContainer = document.querySelector(".modal-container");

const favoritePokemonsArr = [];
const limit = 5;
let offset = 0;

async function loadPokemonItens(offset, limit) {
  const pokemons = await pokeApi.getPokemon(offset, limit);
  let addToHtml = "";
  pokemons.map((pokemon) => {
    addToHtml += convertPokemonToLi(pokemon);
  });
  olPokemons.innerHTML += addToHtml;

  gettingCurrentPokemon();
}

function convertPokemonToLi(pokemon) {
  return `
  <li class="pokemon ${pokemon.type}" data-pokemon='${JSON.stringify(pokemon)}'>
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

function gettingCurrentPokemon() {
  document.querySelectorAll(".pokemon").forEach((pokemonItem) => {
    pokemonItem.addEventListener("click", (event) => {
      const pokemonData = JSON.parse(event.currentTarget.dataset.pokemon);
      openModal(pokemonData);
    });
  });
}

function openModal(pokemon) {
  modalContainer.style.transition = "opacity 0.3s ease-in-out";

  modalContainer.style.display = "flex";
  modalContainer.style.opacity = "0";

  requestAnimationFrame(() => {
    modalContainer.style.opacity = "1";
  });

  modalContainer.className = "modal-container";
  modalContainer.classList.add(pokemon.type);
  modalContainer.innerHTML = `
    <div class="options">
      <button class="back-to-pokedex">⇤</button>
      <img src="assets/img/favoritesoff.png" id="favorites-toggle" height="30" width="30" onclick="openFavorites()"></img>
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
        } </div></li>
        <li><span class="title">Base Experience</span> <div class="information">${
          pokemon.baseExperience || "N/A"
        }</div></li>
      </ol>
    </div>
  `;
}

// Evento para fechar o modal
modalContainer.addEventListener("click", (event) => {
  if (event.target.classList.contains("back-to-pokedex")) {
    modalContainer.style.display = "none";
  }
});

// Eventos de carregar mais pokémons
loadMoreButton.addEventListener("click", () => {
  offset += limit;
  loadPokemonItens(offset, limit);
  if (offset + limit >= 151) {
    loadMoreButton.parentElement.removeChild(loadMoreButton);
  }
});

// Botão do Menu Burguer e Navegação
function menuOnClick() {
  document.getElementById("menu-bar").classList.toggle("change");
  document.getElementById("nav").classList.toggle("change");
}

function openFavorites() {
  const favoriteImg = document.getElementById("favorites-open");
  const favoriteToggle = document.getElementById("favorites-toggle");

  const isOff = favoriteImg.src.includes("favoritesoff");

  favoriteImg.src = isOff
    ? "assets/img/favoriteson.png"
    : "assets/img/favoritesoff.png";

  favoriteToggle.src = isOff
    ? "assets/img/favoriteson.png"
    : "assets/img/favoritesoff.png";
}

function toggleDarkMode() {
  const darkModeToggle = document.getElementById("dark-mode-toggle");

  const isOff = darkModeToggle.src.includes("darkmodeoff");

  darkModeToggle.src = isOff
    ? "assets/img/darkmodeon.png"
    : "assets/img/darkmodeoff.png";
}

// Carregar os primeiros pokémons
loadPokemonItens(offset, limit);
