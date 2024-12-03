const pokeApi = {};

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

pokeApi.getPokemonDetail = (results) => {
  return fetch(results.url)
    .then((detailsRequest) => detailsRequest.json())
    .then(convertPokeApiDetailToPokemon);
};

function convertPokeApiDetailToPokemon(pokeDetail) {
  const pokemon = new Pokemon();
  console.log(pokeDetail)
  pokemon.number = pokeDetail.id;
  pokemon.name = pokeDetail.name;
  pokemon.photo = pokeDetail.sprites.other.dream_world.front_default;
  pokemon.type = pokeDetail.types[0].type.name;
  pokemon.types = pokeDetail.types.map((typeSlot) => typeSlot.type.name);
  pokemon.baseExperience = pokeDetail.base_experience;
  pokemon.height = pokeDetail.height;
  pokemon.weight = pokeDetail.weight;
  pokemon.abilities = pokeDetail.abilities.map((ability) => ability.ability.name);
  pokemon.stats = pokeDetail.stats.map((stat) => ({
    name: stat.stat.name,
    url: stat.stat.url,
  }));

  pokemon.name = pokeDetail.name[0].toUpperCase() + pokeDetail.name.slice(1);
  console.log(pokemon.stats)
  return pokemon;
}
