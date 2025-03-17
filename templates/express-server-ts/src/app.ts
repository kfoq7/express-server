import 'dotenv/config'

import express from 'express'
import morgan from 'morgan'
import cors from 'cors'

const PORT = process.env.PORT ?? 9000

const app = express()

app.use(express.json())
app.use(morgan('dev'))
app.use(cors())

app.get('/', (_req, res) => {
  res.send('<h1>Hello Express Server TS</h1>')
})

async function main() {
  app.listen(PORT, () => {
    console.log(`Develop server running on http://localhost:${PORT}`)
  })
}
main()
