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
const id = '716426'

const requestFoods = [
  `https://api.spoonacular.com/food/search?query=${query}&apiKey=${apiKEY}`,
  `https://api.spoonacular.com/recipes/complexSearch?apiKey=${apiKEY}`,
  `https://api.spoonacular.com/recipes/${id}/information?apiKey=${apiKEY}`,
  `https://api.spoonacular.com/recipes/${id}/summary?apiKey=${apiKEY}`,
]

app.get('/', function (req, res) {
  //   console.log(requestFoods[2])

  const promises = requestFoods.map((requestFood) => rp(requestFood))
  Promise.all(promises).then((data) => {
    const searchAllFood = JSON.parse(data[0])
    const searchRecipes = JSON.parse(data[1])
    const getRecipeInformation = JSON.parse(data[2])
    const summarizeRecipe = JSON.parse(data[3])

    res.render('index', {
      searchAllFood: searchAllFood,
      searchRecipes: searchRecipes,
      getRecipeInformation: getRecipeInformation,
      summarizeRecipe: summarizeRecipe,
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
    })
  })
})

app.use(function (req, res) {
  res.redirect('/')
})

app.listen(process.env.PORT, function () {
  console.log('server is running on port ', process.env.PORT)
})
