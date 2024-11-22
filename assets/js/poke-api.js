const pokeApi = {};

function convertPokeApiDetailToPokemon(pokeDetail) {
  const pokemon = new Pokemon();
  pokemon.number = pokeDetail.id;
  pokemon.name = pokeDetail.name;
  pokemon.photo = pokeDetail.sprites.other.dream_world.front_default;
  pokemon.type = pokeDetail.types[0].type.name;
  pokemon.types = pokeDetail.types.map((typeSlot) => typeSlot.type.name);
  console.log(pokemon.type);

  pokemon.name = pokeDetail.name[0].toUpperCase() + pokeDetail.name.slice(1);
  return pokemon;
}

pokeApi.getPokemonDetail = (results) => {
  return fetch(results.url)
    .then((detailsRequest) => detailsRequest.json())
    .then(convertPokeApiDetailToPokemon);
};

pokeApi.getPokemon = (offset = 0, limit = 5) => {
  const url = `https://pokeapi.co/api/v2/pokemon?offset=${offset}&limit=${limit}`;

  return fetch(url)
    .then((response) => response.json())
    .then((responseJson) => responseJson.results)
    .then((results) =>
      results.map((results) => pokeApi.getPokemonDetail(results))
    )
    .then((detailsRequests) => Promise.all(detailsRequests));
};
