import express from 'express'
import fs from 'fs/promises'
import path from 'path'
import cors from 'cors'
import { fileURLToPath } from 'url'

const app = express()
const PORT = 3000

const __filename = fileURLToPath(import.meta.url)
const __dirname = path.dirname(__filename)
const FILE_PATH = path.join(__dirname, 'passwords.csv')

app.use(express.json())
app.use(cors())

const initializeFile = async () => {
  try {
    await fs.access(FILE_PATH)
  } catch {
    await fs.writeFile(FILE_PATH, 'Website,Password\n', 'utf8')
  }
}
await initializeFile()

app.post('/save', async (req, res) => {
  const { website, password } = req.body

  if (!website || !password) {
    return res.status(400).json({ error: 'Website and password are required' })
  }

  const entry = `${website},${password}\n`
  try {
    await fs.appendFile(FILE_PATH, entry)
    res.json({ message: 'Password saved successfully!' })
  } catch {
    res.status(500).json({ error: 'Failed to save password' })
  }
})

app.get('/download', (req, res) => {
  res.download(FILE_PATH, 'passwords.csv')
})

app.get('/contents', async (req, res) => {
  try {
    const data = await fs.readFile(FILE_PATH, 'utf8')
    res.send(data)
  } catch {
    res.status(500).json({ error: 'Failed to read file' })
  }
})

app.post('/reset', async (req, res) => {
  try {
    await fs.writeFile(FILE_PATH, 'Website,Password\n', 'utf8')
    res.json({ message: 'Passwords reset successfully!' })
  } catch {
    res.status(500).json({ error: 'Failed to reset file' })
  }
})

app.listen(PORT, () => {
  console.log(`Server running on http://localhost:${PORT}`)
})
