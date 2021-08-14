import { API_URL } from "./urls"

class IndicesCategorias {
  // Retorna los indices de todas las categorias
  async all() {
    if (this._categorias) {
      return this._categorias
    }
    // Carga los indices de todas las categorias de la API
    const categorias_res = await fetch(`${API_URL}/categorias`)
    this._categorias = await categorias_res.json()
    return this._categorias
  }
  // Retorna el indice de la categoria
  async getByName(categoria) {
    if (this._categorias && this._categorias[categoria]) {
      return this._categorias[categoria]
    }
    // Carga el índice de la categoria de la API
    const categoria_res = await fetch(`${API_URL}/categorias/${categoria}`)
    this._categorias[categoria] = await categoria_res.json()
    return this._categorias[categoria]
  }
}

const indicesCategorias = new IndicesCategorias()

export default indicesCategorias