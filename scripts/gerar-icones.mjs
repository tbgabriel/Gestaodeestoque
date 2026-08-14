import sharp from 'sharp'
import { readFileSync } from 'node:fs'
import { fileURLToPath } from 'node:url'
import path from 'node:path'

const __dirname = path.dirname(fileURLToPath(import.meta.url))
const svgOrigem = readFileSync(path.join(__dirname, 'icon-source.svg'))
const pastaPublic = path.join(__dirname, '..', 'public')

const alvos = [
  { arquivo: 'pwa-192x192.png', tamanho: 192 },
  { arquivo: 'pwa-512x512.png', tamanho: 512 },
  { arquivo: 'apple-touch-icon.png', tamanho: 180 },
]

for (const { arquivo, tamanho } of alvos) {
  await sharp(svgOrigem)
    .resize(tamanho, tamanho)
    .png()
    .toFile(path.join(pastaPublic, arquivo))
  console.log(`Gerado: ${arquivo} (${tamanho}x${tamanho})`)
}
