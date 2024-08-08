docker build -t testdb -f ./testdb.dockerFile .
docker run -p 5433:5432 -d testdb