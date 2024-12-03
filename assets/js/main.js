const olPokemons = document.querySelector(".pokemons");
const loadMoreButton = document.querySelector("#load-more-button");
const modalContainer = document.querySelector(".modal-container");
const limit = 5;
let offset = 0;

async function loadPokemonItens(offset, limit) {
  try {
    const pokemons = await pokeApi.getPokemon(offset, limit);
    let addToHtml = "";
    pokemons.map((pokemon) => {
      addToHtml += convertPokemonToLi(pokemon);
    });
    olPokemons.innerHTML += addToHtml;

    document.querySelectorAll(".pokemon").forEach((pokemonItem) => {
      pokemonItem.addEventListener("click", (event) => {
        console.log(event);
        const pokemonData = JSON.parse(event.currentTarget.dataset.pokemon);
        openModal(pokemonData);
      });
    });
  } catch (error) {
    console.error("Erro ao carregar os Pokémons:", error);
  }
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

function openModal(pokemon) {
  modalContainer.style.display = "flex";
  modalContainer.className = "modal-container"; // Limpa as classes anteriores
  modalContainer.classList.add(pokemon.type);
  modalContainer.innerHTML = `
    <div class="options">
      <button class="back-to-pokedex">⇤</button>
      <span class="favorite">❤</span>
    </div>
    <div class="info-header">
      <div class="pokemon-name-and-type">
        <span class="pokemon-name">${pokemon.name}</span>
        <ol class="types-modal">
          ${pokemon.types
            ? pokemon.types.map((type) => `<li class="${pokemon.type}">${type}</li>`).join("")
            : ""}
        </ol>
      </div>
      <p class="number-modal">#${pokemon.number}</p>
    </div>
    <img src="${pokemon.photo}" alt="${pokemon.name}">
    <div class="pokemon-infos">
      <ol>
        <li>Description: ${pokemon.description || "N/A"}</li>
        <li>Height: ${pokemon.height || "N/A"}</li>
        <li>Weight: ${pokemon.weight || "N/A"}</li>
        <li>Abilities: ${pokemon.abilities ? pokemon.abilities.join(", ") : "N/A"}</li>
        <li>Base Experience: ${pokemon.baseExperience || "N/A"}</li>
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

// Carregar os primeiros pokémons
loadPokemonItens(offset, limit);
