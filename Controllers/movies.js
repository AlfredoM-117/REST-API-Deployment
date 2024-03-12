import { MovieModel } from '../Models/movie.js'
import { validateMovie, validatePartialMovie } from '../Schemas/movies.js'

export class MovieController {
  // Obtener todas las peliculas
  static async getAll (req, res) {
    const { genre } = req.query
    const movies = await MovieModel.getAll({ genre })
    return res.json(movies)
  }

  // Obtener una pelicula por id
  static async getById (req, res) {
    const { id } = req.params
    const movie = await MovieModel.getById({ id })
    if (!movie) {
      return res.status(404).json({ message: 'Movie not found' })
    }
    return res.json(movie)
  }

  // Crear nueva pelicula
  static async create (req, res) {
    const result = validateMovie(req.body)
    if (result.error) {
      res.status(400).json({ rerror: JSON.parse(result.error.message) })
    }
    const newMovie = await MovieModel.create({ input: result.data })
    return res.status(201).json(newMovie)
  }

  static async update (req, res) {
    const result = validatePartialMovie(req.body)
    if (!result.success) {
      return res.status(400).json({ error: JSON.parse(result.error.message) })
    }
    const { id } = req.params
    const updatedMovie = await MovieModel.update({ id, input: result.data })
    if (!updatedMovie) {
      return res.status(404).json({ message: 'Movie not found' })
    }
    return res.json(updatedMovie)
  }

  static async delete (req, res) {
    const { id } = req.params
    const result = await MovieModel.delete({ id })
    if (result === false) {
      return res.status(404).json({ message: 'Movie not found' })
    }
    return res.json({ message: 'Movie deleted' })
  }
}
