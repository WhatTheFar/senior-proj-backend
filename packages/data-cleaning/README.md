# data-cleaning

## Export sensors data

```sh
docker run -it --rm --network senior-proj-backend mongo:4.2 \
    mongo --host db \
        -u user \
        -p password \
        --authenticationDatabase admin \
        seniorproj

# Export sensors data to json, using mongoexport
docker run -it --rm --network senior-proj-backend -v "$(pwd)"/export:/export mongo:4.2 \
    mongoexport --host db \
        -u user \
        -p password \
        --authenticationDatabase admin \
        --db seniorproj -c sensors --out /export/seniorproj-sensors.json

# Copy exported data to localhost
scp -r 'root@seniorproj:export/seniorproj-sensors.json' export/seniorproj-sensors.json
```

## Import sensors data

```sh
# Export sensors data to json, using mongoexport
docker run -it --rm --network senior-proj-backend -v "$(pwd)"/export:/export mongo:4.2 \
    mongoimport --host db \
        -u user \
        -p password \
        --authenticationDatabase admin \
        --db seniorproj -c sensors --drop --file /export/seniorproj-sensors.json
```
