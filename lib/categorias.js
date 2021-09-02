import { API_URL } from "./urls"

class IndicesCategorias {
  _categorias = null;
  // Retorna los indices de todas las categorias
  root = async () => {
    if (this._categorias) {
      return this._categorias
    }
    // Carga los indices de todas las categorias de la API
    const categorias_res = await fetch(`${API_URL}/categorias`)
    this._categorias = await categorias_res.json()
    return this._categorias
  }
  // Retorna el indice de la categoria
  getByName = async (c) => {
    if (this._categorias) {
      const categoria = this._categorias.find(c => {
        return c.Titulo_url === c
      })
      if (categoria) {
        console.log("found categoria")
        return categoria
      }
    }
    // Carga el índice de la categoria de la API
    const categoria_res = await fetch(`${API_URL}/categorias/${c}`)
    const categoria = await categoria_res.json()
    return categoria
  }
}

const indicesCategorias = new IndicesCategorias()

export default indicesCategorias
