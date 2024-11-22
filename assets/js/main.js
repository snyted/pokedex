const olPokemons = document.querySelector(".pokemons");
const loadMoreButton = document.querySelector("#load-more-button");
const limit = 5;
let offset = 0;

function loadPokemonItens(offset, limit) {
  pokeApi.getPokemon(offset, limit).then((pokemons = []) => {
    const newHtml = pokemons.map(convertPokemonToLi).join("");
    olPokemons.innerHTML += newHtml;
  });
}

loadPokemonItens(offset, limit);

loadMoreButton.addEventListener("click", () => {
  offset += limit;
  loadPokemonItens(offset, limit);

  if (offset + limit >= 151) {
    loadMoreButton.parentElement.removeChild(loadMoreButton);
  }
});

function convertPokemonToLi(pokemon) {
  return `
        <li class="pokemon ${pokemon.type}">
        <span class="number">#${pokemon.number}</span>
        <span class="name">${pokemon.name}</span>
        <div class="detail">
        <ol class="types">
                ${pokemon.types
                  .map(
                    (type) => `<li class="type ${pokemon.type}">${type}</li>`
                  )
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
