import express from 'express'
import cors from 'cors';
import emperorsRouter from './routes/emperors.js'

const app = express()
const PORT = process.env.PORT || 3000

app.use(cors({
  origin: 'http://localhost:5173'
}))

app.use(express.json());

app.use('/emperors', emperorsRouter);

app.listen(PORT, () => {
  console.log(`Server listening on ${PORT}`)
})
