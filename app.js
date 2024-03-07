const express = require('express') // require -> commonJS
const crypto = require('node:crypto') // para crear ids
const pc = require('picocolors')
const movies = require('./movies.json')
const moviesJS = require('./Schemas/movies.js')
const cors = require('cors')

const app = express()
app.disable('x-powered-by')

app.use(express.json())
app.use(cors({
  origin: (origin, callback) => {
    // Lista de origenes aceptados
    const ACCEPTED_ORIGINS = [
      'http://localhost:8080',
      'http://localhost:3000'
    ]
    if (ACCEPTED_ORIGINS.includes(origin) || !origin) {
      return callback(null, true)
    }
    return callback(new Error('CORS error'))
  }
}))
app.get('/', (req, res) => {
  res.json({ message: 'Hola mundo' })
  console.log(pc.green('Request received: '), pc.yellow(req.url))
  console.log(pc.green('Response sent: '), pc.yellow(res.statusCode))
})

// Métodos normales: GET/HEAD/POST

// Métodos complejos: PUT/PATCH/DELETE CORS PREFLIGHT / Requieren una petición llamada OPTIONS

// Query por genero
app.get('/movies', (req, res) => {
  const { genre } = req.query
  if (genre) {
    const filteredMovies = movies.filter(movie => movie.genre.some(g => g.toLowerCase().includes(genre.toLowerCase())))
    if (filteredMovies.length === 0) {
      return res.status(400).json({ message: 'Genre not found' })
    }
    return res.json(filteredMovies)
  } else if ((!genre) || genre.length === 0) {
    console.log(pc.green('Response sent: '), pc.yellow(res.statusCode))
    console.log(pc.green('Request received: '), pc.yellow(req.url))
    return res.json(movies)
  }
})
// Query por id

app.get('/movies/:id', (req, res) => { // path to regexp
  const { id } = req.params
  const movie = movies.find((movie) => movie.id === id)
  if (movie) {
    res.json(movie)
  } else {
    res.status(404).json({ message: 'Movie not found' })
  }
  console.log(pc.green('Request received: '), pc.yellow(req.url))
  console.log(pc.green('Response sent: '), pc.yellow(res.statusCode))
})

// Agregar una nueva pelicula
app.post('/movies', (req, res) => {
  const result = moviesJS.validateMovie(req.body)

  if (result.error) {
    // 422 Unprocessable Entity - También se puede utilizar este error
    res.status(400).json({ rerror: JSON.parse(result.error.message) })
  }

  const newMovie = {
    id: crypto.randomUUID(), // uuid v4
    ...result.data
  }

  // Esto no seria REST, porque estamos guardando el estado de la aplicación en memoria
  movies.push(newMovie)

  // res.status(201).json(newMovie) // Actualizar la caché del cliente

  console.log(pc.green('Response sent: '), pc.yellow(res.statusCode))
  console.log(pc.green('Request received: '), pc.yellow(req.url))
})

app.patch('/movies/:id', (req, res) => {
  const result = moviesJS.validatePartialMovie(req.body)
  if (!result.success) {
    return res.status(400).json({ error: JSON.parse(result.error.message) })
  }
  const { id } = req.params
  const movieIndex = movies.findIndex((movie) => movie.id === id)
  if (movieIndex === -1) {
    return res.status(404).json({ message: 'Movie not found' })
  }

  const updatedMovie = {
    ...movies[movieIndex],
    ...result.data
  }

  movies[movieIndex] = updatedMovie

  console.log(pc.green('Request received: '), pc.yellow(req.url))
  console.log(pc.green('Response sent: '), pc.yellow(res.statusCode))

  return res.json(updatedMovie)
})

app.delete('/movies/:id', (req, res) => {
  const { id } = req.params
  const movieIndex = movies.findIndex((movie) => movie.id === id)
  if (movieIndex === -1) {
    return res.status(404).json({ message: 'Movie not found' })
  } else {
    const deletedMovie = movies[movieIndex]
    movies.splice(movieIndex, 1)

    return res.json(deletedMovie)
  }
})

app.options('/movies/:id', (req, res) => {
  res.send('200')
})

const puertoDeseado = process.env.PORT ?? 3000

app.listen(puertoDeseado, () => {
  console.log(`Server listening on port ${pc.blue(pc.underline(`http://localhost:${puertoDeseado}`))}`)
})
