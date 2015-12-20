var csvjson = require('csvjson');
csvjson.toObject('./uv/data/data.csv').save('./uv/data/data.json');
csvjson.toObject('./data/movie_location.csv').save('./data/movie_location.json');
csvjson.toObject('./gamma/data/gammamonitor.csv').save('./gamma/data/gammamonitor.json');
