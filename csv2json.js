var csvjson = require('csvjson');
csvjson.toObject('./uv/data/data.csv').save('./uv/data/data.json');
csvjson.toObject('./gamma/data/gammamonitor.csv').save('./gamma/data/gammamonitor.json');
