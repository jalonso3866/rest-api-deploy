const express = require('express')
const movies = require('./movies.json')
const crypto = require('node:crypto')
const { validateMovie, validatePartialMovie } = require('./schema/movies.js')
const cors = require('cors')

const app = express()

app.use(express.json())

app.use(cors({
    origin: (origin, callback) => {
      const ACCEPTED_ORIGINS = [
        'http://localhost:49583',
        'http://localhost:1234',
        'https://movies.com',
        'https://midu.dev'
      ]
  
      if (ACCEPTED_ORIGINS.includes(origin)) {
        return callback(null, true)
      }
  
      if (!origin) {
        return callback(null, true)
      }
  
      return callback(new Error('Not allowed by CORS'))
    }
  }))

app.disable('x-powered-by')

app.get('/', (req, res) => {
    res.json({message: 'Hola mundo  desde express'})
})

//Todos los resources que sean MOVIES se identifican con /movies
app.get('/movies', (req, res) => {
    // res.header('Access-Control-Allow-Origin', '*')
    const { genre, title } = req.query

    if (title) {
        const filteredMovies = movies.filter(movie => 
            movie.title.toLowerCase().includes(title.toLowerCase())
        )
        return res.json(filteredMovies)
    }
    if (genre) {
        const filteredMovies = movies.filter(movie => movie.genre.some(g => g.toLowerCase() === genre.toLowerCase()))
        return res.json(filteredMovies)
    }
    res.json(movies)
})

app.post('/movies', (req, res) => {
      
    const result = validateMovie(req.body)
    if (!result.success) {
        return res.status(400).json({error: result.error.errors})
    }

    // para pasasr después una BD
    const newMovie = {
        id: crypto.randomUUID(),
    ...result.data
    }
    
    movies.push(newMovie)
    res.status(201).json(newMovie)
})   

app.get('/movies/:id', (req, res) => {
    const { id } = req.params
    const movie = movies.find(movie => movie.id === id)
    if (!movie) {
        res.status(404).json({message: 'Pelicula no encontrada'})
    }
    res.json(movie)
})

app.patch('/movies/:id', (req, res) => {
    const { id } = req.params
    const result = validatePartialMovie(req.body)
    if (!result.success) {
        return res.status(400).json({error: result.error.errors})
    }
    const movieIndex = movies.findIndex(movie => movie.id === id)
    if (movieIndex === -1) {
        return res.status(404).json({message: 'Pelicula no encontrada'})
    }
    const updatedMovie = {...movies[movieIndex], ...result.data}
    movies[movieIndex] = updatedMovie
    return res.json(updatedMovie)
}) 

app.delete('/movies/:id', (req, res) => {
    //res.header('Access-Control-Allow-Origin', '*')
    //res.header('Access-Control-Allow-Methods', 'GET, POST, PATCH, DELETE, OPTIONS')
    //res.header('Access-Control-Allow-Headers', 'Content-Type') 
        const { id } = req.params
        const movieIndex = movies.findIndex(movie => movie.id === id)
    if (movieIndex === -1) {
            return res.status(404).json({message: 'Pelicula no encontrada'})
        }
    movies.splice(movieIndex, 1)
    res.status(204).send()
})

/*
app.options('/movies/:id', (req, res) => {
    res.header('Access-Control-Allow-Origin', '*')
    res.header('Access-Control-Allow-Methods', 'GET, POST, PATCH, DELETE, OPTIONS')
    res.header('Access-Control-Allow-Headers', 'Content-Type')  
    res.send()
})                                                                                                          
*/

const PORT = process.env.PORT ?? 1234

app.listen(PORT, () => {
    console.log(`Servidor corriendo en http://localhost:${PORT}`)
})