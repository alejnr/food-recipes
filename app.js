const express = require('express')
const bodyParser = require('body-parser')
const ejs = require('ejs')
const dotenv = require('dotenv')
const _ = require('lodash')
const rp = require('request-promise')

dotenv.config()

const app = express()

app.use(bodyParser.urlencoded({ extended: true }))

const apiKEY = process.env.API_KEY

app.set('view engine', 'ejs')

app.use(express.static('public'))

app.get('/', function (req, res) {
  const getRandomFoods = [
    `https://api.spoonacular.com/recipes/random?apiKey=${apiKEY}&number=12`,
    `https://api.spoonacular.com/food/jokes/random?apiKey=${apiKEY}`,
  ]

  const promises = getRandomFoods.map((getRandomFood) => rp(getRandomFood))
  Promise.all(promises).then((data) => {
    const getRandomFoodsData = JSON.parse(data[0])
    const getRandomJokesData = JSON.parse(data[1])

    res.render('index', {
      getRandomRecipes: getRandomFoodsData,
      getRandomJokes: getRandomJokesData,
      kebabCase: _.kebabCase,
    })
  }).catch(function(err) {
    res.render("error", {
      errMsg: err,
    })
  });
})

app.post('/', function (req, res) {
  const searchQuery = _.kebabCase(req.body.searchQuery)

  res.redirect(`/search/${searchQuery}`)
})

app.get('/search/:searchQuery', function (req, res) {
  const query = req.params.searchQuery

  const searchFoods = [
    `https://api.spoonacular.com/food/search?query=${query}&apiKey=${apiKEY}&number=18`,
  ]

  // console.log(searchFoods[0]);

  const promises = searchFoods.map((searchFood) => rp(searchFood))
  Promise.all(promises).then((data) => {
    const searchRecipesByQuery = JSON.parse(data[0])

    res.render('search', {
      searchRecipesByQuery: searchRecipesByQuery,
      kebabCase: _.kebabCase,
      capitalize: _.capitalize,
      lowerCase: _.lowerCase,
    })
  }).catch(function(err) {
    res.render("error", {
      errMsg: err,
    })
  });
})

app.get('/recipes/:recipeName=:foodId', function (req, res) {
  const id = req.params.foodId

  const requestFoodByIds = [
    `https://api.spoonacular.com/recipes/${id}/information?apiKey=${apiKEY}`,
    `https://api.spoonacular.com/recipes/${id}/similar?apiKey=${apiKEY}&number=6`,
    `https://api.spoonacular.com/recipes/${id}/equipmentWidget.json?apiKey=${apiKEY}`,
    `https://api.spoonacular.com/recipes/${id}/analyzedInstructions?apiKey=${apiKEY}`,
  ]

  const promises = requestFoodByIds.map((requestFoodById) =>
    rp(requestFoodById)
  )
  Promise.all(promises).then((data) => {
    const getRecipeInformation = JSON.parse(data[0])
    const getSimilarRecipes = JSON.parse(data[1])
    const getRecipeEquipmentById = JSON.parse(data[2])
    const getAnalyzedRecipeInstructions = JSON.parse(data[3])

    res.render('recipe', {
      getRecipeInformation: getRecipeInformation,
      getSimilarRecipes: getSimilarRecipes,
      getRecipeEquipmentById: getRecipeEquipmentById,
      getAnalyzedRecipeInstructions: getAnalyzedRecipeInstructions,
      kebabCase: _.kebabCase,
      capitalize: _.capitalize,
    })
  }).catch(function(err) {
    res.render("error", {
      errMsg: err,
    })
  });
})

app.use(function (req, res) {
  res.redirect('/')
})

app.listen(process.env.PORT, function () {
  console.log('server is running on port ', process.env.PORT)
})
