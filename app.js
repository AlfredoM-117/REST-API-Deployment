import express, { json } from 'express' // require -> commonJS
import pc from 'picocolors'
import { moviesRouter } from './Routes/movies.js'
import { corsMiddleware } from './Middlewares/cors.js'
// import fs from 'node:fs'

const app = express()
app.disable('x-powered-by')
app.use(json())
app.use(corsMiddleware())
app.use('/movies', moviesRouter)

// app.options('/movies/:id', (req, res) => {
//   res.send('200')
// })

const puertoDeseado = process.env.PORT ?? 3000

app.listen(puertoDeseado, () => {
  console.log(`Server listening on port ${pc.blue(pc.underline(`http://localhost:${puertoDeseado}`))}`)
})
