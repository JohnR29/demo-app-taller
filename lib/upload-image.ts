// Utilidad para subir imágenes (mock, solo frontend)
export async function uploadImage(file: File): Promise<string> {
  // Simula una subida y retorna una URL temporal
  return new Promise((resolve) => {
    setTimeout(() => {
      resolve(URL.createObjectURL(file))
    }, 800)
  })
}
