<p align="center"><a href="https://rebellion.global/" target="_blank"><img width="200" src="https://user-images.githubusercontent.com/15846595/83038003-c6157b80-a03c-11ea-9605-325b4990e7bd.png" alt="XR logo"></a></p>

<p align="center"><a href="https://rebellion.global/" target="_blank"><img src="https://img.shields.io/badge/rebel-for%20life-success" alt="XR website"></a></p>

> Peer-to-peer volunteer platform of Extinction Rebellion: an international, grassroots, decentralized movement of tens of thousands of people who act together to justly address one of the greatest crisis of our times.

## Purpose

### why rebel

We are developers who joined Extinction Rebellion because we feel a moral duty to use our knowledge and skills to solve the Climate and Ecological Emergency. This emergency is a present reality for the families who are labelled climate refugees, the indigenous communities whose land has been destroyed, and the countless species that are forced into extinction every day. Governments have failed to act and are driving us towards social and ecollogical collapse. We joined Extinction Rebellion because it is our best and last hope to protect life on Earth.

### why this project

We are developing this volunteer platform to make it easier for Extinction Rebellion groups to find help with roles and tasks, and easier for people to find roles and tasks in Extinction Rebellion that they wish to volunteer for. We believe that this platform is a critical tool to grow the movement, make it more resilient, and increase our chances of addressing the pressing crisis.

But we cannot do it alone. No matter who you are, what skills you have or how much time you can dedicate, we need your help. In the [contributing guidelines](https://github.com/xrnl/aginun/blob/master/CONTRIBUTING.md) you can learn how you can contribute to the project.

If you want to get in contact or learn more about the project, please read the [instructions for getting support](https://github.com/xrnl/aginun/blob/master/SUPPORT.md). To learn more about Extinction Rebellion, visit [rebellion.global](https://rebellion.global).

## Requirements

- [Node.js](https://nodejs.org/en/download/) >= 14.0.0
- [docker](https://docs.docker.com/get-docker/) and [docker-compose](https://docs.docker.com/compose/install/)

## Install

You can install the application in your own computer by following these simple steps:

1. Clone the repository by running `git clone https://github.com/xrnl/aginun.git` in your terminal.
2. Navigate into the project directory (`cd aginun`) and install packages with the command `npm install`.
3. create files with local environment variables: `cp .env.example .env.local && cp ./docker/.env.local.example ./docker/.env.local`.

If you wish edit the code of this application, we recommend using [this setup](https://github.com/xrnl/aginun/wiki/Recommended-setup).

## Run

1. Run the ([Hasura](https://hasura.io/)) backend with `npm run docker`. 
2. Run the frontend (in development mode) with `npm start`. 

You can access the frontend at [localhost:8080](http://localhost:8080).

You can use the backend API at [localhost:8008](http://localhost:8008). The database and GraphQL endpoints of the backend can be edited using the Hasura console, accessible at [localhost:8008/console](http://localhost:8008/console), using the `HASURA_GRAPHQL_ADMIN_SECRET` key in `docker/.env.local`.

## Test

### Unit tests

```
npm run test:unit
```

Add the `-s` or `--silent` flag to avoid NPM error messages if tests fail.
During development, the `test:unit:dev` command can be used to keep the tests running.

### End to End tests (to be implemented)

```
npm run test:e2e
```

## Build

Compile and minify for production with `npm run build`
 
## Build an run docker in production

There is a docker-compose override file for production purposes. In order to use it, first copy the example env for production:

```
cp ./docker/.env.prod.example ./docker/.env.prod.local
```

Edit the variables in the env file at will. To run the production version locally, run:

```
docker-compose --file docker/docker-compose.yml --file docker/docker-compose.prod-override.yml --env-file ./docker/.env.prod.local up --build
```

In order to test it, you need to add the hasura url as defined in the vue production env file (`.env.production.local`) 
to your hosts file (`/etc/hosts`):

```
127.0.0.1 api.volunteer.extinctionrebellion.local volunteer.extinctionrebellion.local
```

You can access the hasura console at `http://api.volunteer.extinctionrebellion.local/` and the local site at `http://volunteer.extinctionrebellion.local/` 
