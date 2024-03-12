import { Router } from 'express'
import { MovieController } from '../Controllers/movies.js'

export const moviesRouter = Router()

// Obtener todas las peliculas
moviesRouter.get('/', MovieController.getAll)
// Obtener una pelicula por id
moviesRouter.get('/:id', MovieController.getById)
// Crear una nueva pelicula
moviesRouter.post('/', MovieController.create)
// Actualizar una pelicula
moviesRouter.patch('/:id', MovieController.update)
// Eliminar una pelicula
moviesRouter.delete('/:id', MovieController.delete)
