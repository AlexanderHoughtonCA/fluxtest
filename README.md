# Flux Test #
This is a small Node.js test server that can request a connect to Replicate to request an image generation run using a Black Forest Labs model.
You can signup for Replicate here: 
https://replicate.com/signin

## Features ##

- fluxtest_bootstrap.sql database dump to bootstrap the Docker database  container
- art_styles.json for adding more styles and importing into the app
- Image styles stored in the Postgress database
- Redis style caching (image caching has issues - see below)
- Unit tests: partical coverage more to come
- Docker compose file with containers for the app, Postgres & Redis
- Sequelize.js for Postgres DB access


## Endpoints ##

### GET /styles ###

- Returns a list of available image styles that can be used in the 
  image request POST below. These are the available styles:
  
| ID | Style | Description |
| --- | --- | --- |
| 1 | art deco | the art deco style of art by William Morris, art nouveau. |
| 2 | collage | paper collage style of Hannah Hoch, Kurt Schwitters, and Man Ray |
| 3 | graffiti | style of graffiti street art, neo-expressionalism. |
| 4 | kidult | the kidult style of cute drawings done by a preschooler |
| 5 | linocut | the linocut style of minimalistic stylised line work |
| 6 | retro sepia | retro sepia style of Charles Willson Peale. |
| 7 | origami | origami style of Greg Rutkowski |
| 8 | risograph | risograph / grain print effect style |
| 9 | sculpted | sculpted, polygonal style |
| 10 | vintage | the vintage American poster style of Roger Broders, Otto Baumberger, Percy Trompf, Gert Sellheim. |

### POST /fontmaker ###

- Sends a request to Replicate to generate an image from text

**API Key**
A Replicate API key must be provided in the request header for the POST to succeed

`Header Key: fluxtest-apikey`

`Header Value: YOUR REPLICATE API KEY`


**Example POST Body Parameters**

```javascript
{
    text: "Example Text",
    styleId: 4,
    numSamples: 3
}
```

`text` is The text to be rendered

`styleId` is one of the style IDs shown above

`numSamples` is the number of samples to use


## Build & Run in Docker ##

After cloning, edit the .env file and change:

YOUR_POSTGRES_PASSWORD to your desired password for the Postgres database that
will be installed in the database containers

YOUR_REPLICATE_API_KEY to your Replicate API key

then run:

`docker-compose up`


## Run directly in Node.js ##

First, edit the .env file as described above.

These installation instructions have been tested in Ubuntu 22, you may get
differing milage with other distributions or platforms.



### Install dependencies ###

NOTE: Sequelze requires a least Node v18.20.7, and the easiest way to install it is with
nvm, as described below.

**Install NVM**
`sudo apt install curl`

`curl https://raw.githubusercontent.com/creationix/nvm/master/install.sh | bash`

`source ~/.profile`

`nvm install node`

`nvm install 18.20.7`


**Install Postgres**

`sudo apt install postgresql`

Log into Postgres

`sudo -u postgres psql template1`

Add a password

`ALTER USER postgres with encrypted password 'your_password';`

Create the database
`create database fluxtest`

Log out again
`\q`


**Install Sequelize**

`npm install --save sequelize`
`npm install --save pg pg-hstore`

Run Sequelize to migrate the tables

`npx sequelize-cli db:migrate`

**Install Redis**

`sudo apt-get install lsb-release curl gpg`

`curl -fsSL https://packages.redis.io/gpg | sudo gpg --dearmor -o /usr/share/keyrings/redis-archive-keyring.gpg`

`sudo chmod 644 /usr/share/keyrings/redis-archive-keyring.gpg`

`echo "deb [signed-by=/usr/share/keyrings/redis-archive-keyring.gpg] https://packages.redis.io/deb $(lsb_release -cs) main" | sudo` 

`tee /etc/apt/sources.list.d/redis.list`

`sudo apt-get update`

`sudo apt-get install redis-server`

To run, cd into the fluxtest folder, then:
`node ./`


## Unit Tests ##
After installing the Node.js depdencies mentioned above, run:

`node /unitTests.js`







