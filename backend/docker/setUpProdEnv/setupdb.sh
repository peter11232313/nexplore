docker build -t proddb -f ./prod.dockerFile .
docker run -p 5432:5432 -d proddb