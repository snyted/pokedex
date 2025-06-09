const pokeApi = {
  getPokemon: "",
  getPokemonDetail: "",
  getPokemonDescription: "",
};

pokeApi.getPokemon = (offset = 0, limit = 151) => {
  const url = `https://pokeapi.co/api/v2/pokemon?offset=${offset}&limit=${limit}`;

  return fetch(url)
    .then((response) => response.json())
    .then((responseJson) => responseJson.results)
    .then((results) =>
      results.map((result) => pokeApi.getPokemonDetail(result))
    )
    .then((detailsRequests) => Promise.all(detailsRequests));
};

pokeApi.getPokemonDetail = (result) => {
  return fetch(result.url)
    .then((detailsRequest) => detailsRequest.json())
    .then((pokeDetail) => {
      return pokeApi
        .getPokemonDescription(pokeDetail.id)
        .then((description) =>
          convertPokeApiDetailToPokemon(pokeDetail, description)
        );
    });
};

pokeApi.getPokemonDescription = (pokemonId) => {
  const url = `https://pokeapi.co/api/v2/pokemon-species/${pokemonId}/`;
  return fetch(url)
    .then((response) => response.json())
    .then((speciesData) => {
      const flavorTextEntry = speciesData.flavor_text_entries.find(
        (entry) => entry.language.name === "en"
      );
      return flavorTextEntry
        ? flavorTextEntry.flavor_text
        : "No description available.";
    });
};

function convertPokeApiDetailToPokemon(pokeDetail, description) {
  const pokemon = new Pokemon();
  pokemon.number = pokeDetail.id;
  pokemon.name = pokeDetail.name;
  pokemon.photo = pokeDetail.sprites.other.dream_world.front_default;
  pokemon.type = pokeDetail.types[0].type.name;
  pokemon.types = pokeDetail.types.map((typeSlot) => typeSlot.type.name);
  pokemon.description = description;
  pokemon.baseExperience = pokeDetail.base_experience;
  pokemon.height = pokeDetail.height;
  pokemon.weight = pokeDetail.weight;
  pokemon.abilities = pokeDetail.abilities.map(
    (ability) => ability.ability.name
  );
  pokemon.stats = pokeDetail.stats.map((stat) => ({
    name: stat.stat.name,
    url: stat.stat.url,
  }));

  // Tratando os dados
  pokemon.description = pokemon.description
    .replace(/\n/g, " ")
    .replace(/\f/g, " ");
  pokemon.name = pokeDetail.name[0].toUpperCase() + pokeDetail.name.slice(1);
  pokemon.height = pokemon.height * 10 + " cm";
  pokemon.weight = pokemon.weight / 10 + " kg";
  return pokemon;
}
