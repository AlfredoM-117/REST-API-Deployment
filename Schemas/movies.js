const zod = require('zod') // dependencia para validar datos

const movieSchema = zod.object({
  title: zod.string({
    required_error: 'Title is required',
    invalid_type_error: 'Title must be a string'
  }
  ),
  year: zod.number().int().min(1900).max(2024),
  director: zod.string(),
  duration: zod.number().int().positive(),
  rate: zod.number().min(0).max(10).default(0),
  poster: zod.string().url({ // endsWith ('.jpg')
    message: 'Poster must be a valid URL'
  }),
  genre: zod.array(zod.enum(['Action', 'Adventure', 'Comedy', 'Crime', 'Drama', 'Fantasy', 'Horror', 'Mystery', 'Romance', 'Sci-Fi', 'Thriller']),
    {
      invalid_type_error: 'Genre must be an array of enum genres',
      required_error: 'Genre is required'
    }
  )
})

function validateMovie (object) {
  return movieSchema.safeParse(object)
}

function validatePartialMovie (object) {
  return movieSchema.partial().safeParse(object)
}

module.exports = {
  validateMovie,
  validatePartialMovie
}
