const olPokemons = document.querySelector(".pokemons");
const loadMoreButton = document.querySelector("#load-more-button");
const modalContainer = document.querySelector(".modal-container");
const backToPokedex = document.querySelector(".back-to-pokedex");
const favorite = document.querySelector(".favorite");
const limit = 5;
let offset = 0;
function loadPokemonItens(offset, limit) {
  pokeApi.getPokemon(offset, limit).then((pokemons = []) => {
    const newHtml = pokemons.map(convertPokemonToLi).join("");
    olPokemons.innerHTML += newHtml;

    openModalPokemon();
  });
}

function convertPokemonToLi(pokemon) {
  return `
  <li class="pokemon ${pokemon.type}">
  <span class="number">#${pokemon.number}</span>
  <span class="name">${pokemon.name}</span>
  <div class="detail">
  <ol class="types">
  ${pokemon.types
    .map((type) => `<li class="type ${pokemon.type}">${type}</li>`)
    .join("")}
                </ol>
                <img  
              src="${pokemon.photo}"
              alt="${pokemon.name}"
              />
          </div>
          </li>
        `;
}

// Eventos
function openModalPokemon() {
  const pokemonEl = document.querySelectorAll(".pokemon");
  pokemonEl.forEach((pokemon) => {
    pokemon.addEventListener("click", () => {
      modalContainer.style.display = "flex";
    });
  });
}

loadMoreButton.addEventListener("click", () => {
  offset += limit;
  loadPokemonItens(offset, limit);

  if (offset + limit >= 151) {
    loadMoreButton.parentElement.removeChild(loadMoreButton);
  }
});

backToPokedex.addEventListener("click", () => {
  modalContainer.style.display = "none";
});

favorite.addEventListener("click", () => {
  if (favorite.style.webkitTextFillColor === "red") {
    favorite.style.webkitTextFillColor = "transparent";
  } else {
    favorite.style.webkitTextFillColor = "red";
  }
});

loadPokemonItens(offset, limit);
