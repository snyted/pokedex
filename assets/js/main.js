
const limit = 10;
const offset = 0;
const url = `https://pokeapi.co/api/v2/pokemon?offset=${offset}&limit=${limit}`;

fetch(url).then(function (response) {
    return response.json();
}).then(function (data) {
    console.log(data);
})