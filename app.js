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

var query = ''
var id = ''

const kebabCase = _.kebabCase

app.get('/', function (req, res) {
  //   console.log(requestFoods[0])

  const requestFoods = [
    `https://api.spoonacular.com/recipes/complexSearch?apiKey=${apiKEY}`,
  ]

  const promises = requestFoods.map((requestFood) => rp(requestFood))
  Promise.all(promises).then((data) => {
    const searchRecipesData = JSON.parse(data[0])

    res.render('index', {
      searchRecipes: searchRecipesData,
      kebabCase: kebabCase,
    })
  })
})

app.post('/', function (req, res) {
  const querySearch = req.body.searchQuery

  var query = querySearch

  const searchFoods = [
    `https://api.spoonacular.com/recipes/complexSearch?query=${query}&apiKey=${apiKEY}`,
  ]

  const promises = searchFoods.map((searchFood) => rp(searchFood))
  Promise.all(promises).then((data) => {
    const searchRecipesByQuery = JSON.parse(data[0])

    res.render('search', {
      searchRecipesByQuery: searchRecipesByQuery,
      kebabCase: kebabCase,
    })
  })
})

app.get('/recipes/:foodId', function (req, res) {
  const requestedFoodId = req.params.foodId

  var id = requestedFoodId

  const requestFoodByIds = [
    `https://api.spoonacular.com/recipes/${id}/information?apiKey=${apiKEY}`,
    `https://api.spoonacular.com/recipes/${id}/similar?apiKey=${apiKEY}`,
  ]

  const promises = requestFoodByIds.map((requestFoodById) =>
    rp(requestFoodById)
  )
  Promise.all(promises).then((data) => {
    const getRecipeInformation = JSON.parse(data[0])
    const getSimilarRecipes = JSON.parse(data[1])

    res.render('recipe', {
      getRecipeInformation: getRecipeInformation,
      getSimilarRecipes: getSimilarRecipes,
      kebabCase: kebabCase,
    })
  })
})

app.use(function (req, res) {
  res.redirect('/')
})

app.listen(process.env.PORT, function () {
  console.log('server is running on port ', process.env.PORT)
})
