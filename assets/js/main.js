pokeApi
  .getPokemon()
  .then((pokemons = []) => {
    const olPokemons = document.querySelector(".pokemons");
    olPokemons.innerHTML = pokemons.map(convertPokemonToLi).join("");
  })
  .catch((error) => console.log(error));

function convertPokemonTypesToLi(pokemonTypes) {
    console.log(pokemonTypes)
    return pokemonTypes.map((typeSlot) => `<li class="type">${typeSlot.type.name}</li>`);
}

function convertPokemonToLi(pokemon) {

  pokemon.name = pokemon.name.charAt(0).toUpperCase() + pokemon.name.slice(1);
  return `
        <li class="pokemon">
        <span class="number">#${pokemon.order}</span>
        <span class="name">${pokemon.name}</span>
        <div class="detail">
        <ol class="types">
                ${convertPokemonTypesToLi(pokemon.types).join("")}
                </ol>

                <img
              src="${pokemon.sprites.other.dream_world.front_default}"
              alt="${pokemon.name}"
              />
          </div>
        </li>
        `;
}
