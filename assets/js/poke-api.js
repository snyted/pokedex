const pokeApi = {};

pokeApi.getPokemonDetail = (pokemon) => {
    return fetch(pokemon.url).then((response) => response.json())
}

pokeApi.getPokemon = (offset = 0, limit = 100) => {
  const url = `https://pokeapi.co/api/v2/pokemon?offset=${offset}&limit=${limit}`;

  return fetch(url)
    .then((response) => response.json())
    .then((responseJson) => responseJson.results)
    .then((results) => results.map(pokeApi.getPokemonDetail))
    .then((detailsRequest) => Promise.all(detailsRequest))
    .then((pokemonDetails) => pokemonDetails)
    .catch((error) => console.error(error));
};