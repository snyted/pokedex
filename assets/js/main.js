// DOM
const pokemonsList = document.querySelector(".pokemons");
const loadMoreButton = document.querySelector("#load-more-button");
const modalContainer = document.querySelector(".modal-container");
const h1 = document.querySelector("h1");
const menuBarTop = document.getElementById("bar1");
const menuBarMiddle = document.getElementById("bar2");
const menuBarBottom = document.getElementById("bar3");

const searchBox = document.querySelector(".search-box");
const searchInput = document.querySelector(".search-input");

// Variáveis e States
let pokemonsFavs = JSON.parse(localStorage.getItem("pokemonsFavs")) || [];
const pokemonInfos = [];
const limit = 156;
let offset = 0;

async function loadPokemonItens(offset, limit) {
  const pokemons = await pokeApi.getPokemon(offset, limit);
  let addToHtml = "";

  pokemons.map((pokemon, index) => {
    pokemonInfos.push(pokemon);
    addToHtml += showPokemon(pokemon, index);
  });

  pokemonsList.innerHTML += addToHtml;
  AOS.refresh();

  gettingCurrentPokemon();
}

// Função para converter o pokemon para HTML
function showPokemon(pokemon, index) {
  const delay = index * 100; // atraso em ms (100ms por exemplo)
  return `
    <li class="pokemon ${pokemon.type}" data-pokemon='${JSON.stringify(
    pokemon
  )}' data-aos="fade-up" data-aos-delay="${delay}">
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
  let heartFill = "";
  let heartClass = "";

  modalOpenAnimation();
  modalContainer.className = "modal-container";
  modalContainer.classList.add(pokemon.type);

  if (pokemonsFavs.includes(pokemon.name)) {
    heartFill = "#ff4757"; // Vermelho quando favoritado
    heartClass = "favorited";
  } else {
    heartFill = "#fafafa"; // Cinza quando não favoritado
    heartClass = "";
  }

  // Dados diretos, sem tradução
  const description = pokemon.description || "N/A";
  const height = pokemon.height || "N/A";
  const weight = pokemon.weight || "N/A";
  const abilities = pokemon.abilities ? pokemon.abilities.join(", ") : "N/A";
  const baseExperience = pokemon.baseExperience || "N/A";

  modalContainer.innerHTML = `
    <div class="options">
      <button class="back-to-pokedex">
        <img src="${backToPokedexSrc}" alt="Voltar para Pokedex" height="30" width="30" onclick="closeModalAnimation()">
      </button>
      <svg class="heart-svg ${heartClass}" width="30" height="30" viewBox="0 0 24 24" onclick="addToFavorites('${
    pokemon.name
  }')">
        <path d="M12 21.35l-1.45-1.32C5.4 15.36 2 12.28 2 8.5 2 5.42 4.42 3 7.5 3c1.74 0 3.41.81 4.5 2.09C13.09 3.81 14.76 3 16.5 3 19.58 3 22 5.42 22 8.5c0 3.78-3.4 6.86-8.55 11.54L12 21.35z" 
              fill="${heartFill}" 
              stroke="none"/>
      </svg>
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
        <li><span class="title">Descrição</span> <div class="information">${description}</div></li>
        <li><span class="title">Altura</span> <div class="information">${height}</div></li>
        <li><span class="title">Peso</span> <div class="information">${weight}</div></li>
        <li><span class="title">Habilidades</span> <div class="information">${abilities}</div></li>
        <li><span class="title">Experiência Base</span> <div class="information">${baseExperience}</div></li>
      </ol>
    </div>
  `;
}

// Animação para abrir e fechar o modal
function modalOpenAnimation() {
  modalContainer.style.transition = "opacity 0.3s ease-in-out";
  modalContainer.style.display = "flex";
  modalContainer.style.opacity = "0";
  requestAnimationFrame(() => {
    modalContainer.style.opacity = "1";
  });
}

function closeModalAnimation() {
  modalContainer.style.transition = "opacity 0.3s ease-in-out";
  modalContainer.style.opacity = "1";

  void modalContainer.offsetWidth;

  modalContainer.style.opacity = "0";

  modalContainer.addEventListener("transitionend", function handler() {
    modalContainer.style.display = "none";
    modalContainer.removeEventListener("transitionend", handler);
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

function toggleDarkMode() {
  const darkModeToggle = document.getElementById("dark-mode-toggle");
  const isOff = darkModeToggle.src.includes("darkmodeoff");

  if (isOff) {
    darkModeToggle.src = "assets/img/darkmodeon.png";
  } else {
    darkModeToggle.src = "assets/img/darkmodeoff.png";
  }

  darkMode(isOff);
}

function darkMode(isOff) {
  if (isOff) {
    document.body.classList.add("dark-mode");
    h1.style.color = "#fdf6e3";
    menuBarTop.style.backgroundColor = "#000";
    menuBarMiddle.style.backgroundColor = "#000";
    menuBarBottom.style.backgroundColor = "#000";
  } else {
    document.body.classList.remove("dark-mode");
    h1.style.color = "#3f3f3f";
    menuBarTop.style.backgroundColor = "#3f3f3f";
    menuBarMiddle.style.backgroundColor = "#3f3f3f";
    menuBarBottom.style.backgroundColor = "#3f3f3f";
  }
}

// Você também vai precisar atualizar sua função addToFavorites para animar o coração:
function addToFavorites(pokemonName) {
  const heartSvg = document.querySelector(".heart-svg");
  const heartPath = heartSvg.querySelector("path");

  if (pokemonsFavs.includes(pokemonName)) {
    // Remove dos favoritos
    pokemonsFavs = pokemonsFavs.filter((name) => name !== pokemonName);
    heartSvg.classList.remove("favorited");
    heartPath.setAttribute("fill", "#ddd");
  } else {
    // Adiciona aos favoritos
    pokemonsFavs.push(pokemonName);
    heartSvg.classList.add("favorited");
    heartPath.setAttribute("fill", "#ff4757");
  }

  // Salvar no localStorage ou onde você armazena os favoritos
  localStorage.setItem("pokemonsFavs", JSON.stringify(pokemonsFavs));
}

// Abrir e fechar favoritos
function openFavorites() {
  const favId = document.getElementById("favorites-open");
  const isOff = favId.src.includes("favoritesoff");
  let offset = 0;

  if (isOff) {
    favId.src = "assets/img/favoriteson.png";
    loadMoreButton.style.display = "none";
    pokemonsList.innerHTML = "";
    avoidDuplicates();
  } else {
    favId.src = "assets/img/favoritesoff.png";
    pokemonsList.innerHTML = "";

    loadPokemonItens(offset, limit);
    loadMoreButton.style.display = "block";
  }

  gettingCurrentPokemon();
}

// Evitar pokémons duplicados
function avoidDuplicates() {
  const uniqueFavs = pokemonInfos.filter(
    (pokemon, index, self) =>
      pokemonsFavs.includes(pokemon.name) &&
      index === self.findIndex((p) => p.name === pokemon.name)
  );

  pokemonsList.innerHTML = uniqueFavs
    .map((pokemon) => showPokemon(pokemon))
    .join("");
}

// Barra de pesquisa
function toggleSearch() {
  if (!searchBox.classList.contains("active")) {
    openSearch();
  }
}

function openSearch() {
  searchBox.classList.add("active");
  setTimeout(() => {
    searchBox.querySelector("input").focus();
  }, 200);
}

function closeSearch() {
  setTimeout(() => {
    searchBox.classList.remove("active");
    searchInput.value = "";
  }, 200);
}

// Carregar os primeiros pokémons
loadPokemonItens(offset, limit);

// Busca interativa
searchInput.addEventListener('input', () => {
  const q = searchInput.value.toLowerCase().trim();
  const filtered = q
    ? pokemonInfos.filter(p => p.name.toLowerCase().includes(q))
    : pokemonInfos;

  pokemonsList.innerHTML = filtered
    .map((p, i) => showPokemon(p, i))
    .join('');

  gettingCurrentPokemon();
});
