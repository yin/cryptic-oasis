# Cryptic Oasis - Web finance manager

Cryptic oasis is income/expense management tool. The goal of this project is to learn technologies, I never :

1. Advanced Heroku Toolbelt commands
2. PostgreSQL
3. EJS templating framework (already replaced by DoneJS)
4. Express version 4

## Running Locally

Make sure you have [Node.js](http://nodejs.org/) and the [Heroku Toolbelt](https://toolbelt.heroku.com/) installed.

```sh
$ git clone git@github.com:yin/cryptic-oasis.git # or clone your own fork
$ cd cryptic-oasis
$ sudo apt-get install -y libpg-dev
$ npm install
$ npm start
```

Your app should now be running on [localhost:5000](http://localhost:5000/).

## Deploying to Heroku

```
$ heroku create
$ git push heroku master
$ heroku open
```
or

[![Deploy to Heroku](https://www.herokucdn.com/deploy/button.png)](https://heroku.com/deploy)

## Documentation

For more information about using Node.js on Heroku, see these Dev Center articles:

- [Getting Started with Node.js on Heroku](https://devcenter.heroku.com/articles/getting-started-with-nodejs)
- [AngularJS 1.5 tutorial](https://code.angularjs.org/1.5.7/docs/tutorial) 
- [Best Practices for Node.js Development](https://devcenter.heroku.com/articles/node-best-practices)
