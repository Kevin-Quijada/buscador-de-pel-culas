import './App.css'
import { useEffect, useState, useRef, useCallback } from 'react' //es un hook que permite crear una referencia mutable durante todo el siclo de vida del componente 
import { Movies } from './components/Movies' //util para guardar valores que puedan mutar como un identificador, elemneto del dom, contador y que cada vez que cambia no renderiza el componente
import { useMovies } from './hooks/useMovies'
import debounce from 'just-debounce-it'

//Los customeHooks se utilizan para extraer logica de los componentes

function useSearch () {
  const [search, updateSearch] = useState('')
  const [error, setError] = useState(null)
  const isFirstInput = useRef(true)

  useEffect(() => {
    if (isFirstInput.current) {
      isFirstInput.current = search === ''
      return
    }

    if (search === '') {
      setError('No se puede buscar una película vacía')
      return
    }

    if (search.match(/^\d+$/)) {
      setError('No se puede buscar una película con un número')
      return
    }

    if (search.length < 3) {
      setError('La búsqueda debe tener al menos 3 caracteres')
      return
    }

    setError(null)
  }, [search])

  return { search, updateSearch, error }
}

function App() {
  const [sort, setSort] = useState(false)
  const {search, updateSearch, error} = useSearch()
  const { movies, getMovies, loading } = useMovies({search, sort})
  //const inputRef = useRef()

  //useREF es una referencia a un valor que puede cambiar y que cada vez que cambia no vuelve a renderizar el componente

  const debounceGetMovies = useCallback(
    debounce(search => {
      console.log('search',search)
      getMovies({ search })
  }, 300) 
  , [getMovies]
)
  
  // debounce es una function que hace que espere ciertos ms a la hora de escribir en un input para asi no estar sobresaturando de muchas letras la api


  const handleSort = () => {
    setSort(!sort)
  } 

  const handleSubmit = (event) => {
    event.preventDefault()
    // const inputEL = inputRef.current //current es un objeto nativa de react que puede mutar, cambiar el valor de value
    // const value = inputEL.value
    // console.log(value)
    getMovies({search})
    // la ventaja que tiene es que puede simplificar mas la validacion de formularios
    
  }

  const handleChange = (event) => {
    const newSearch = event.target.value
    updateSearch(event.target.value)
    debounceGetMovies({newSearch})
  }



  // onSubmit tiene mas ventajas que permite recuperar la informacion mucho mas facil que el onclick
  return (
     <div className='page'>

        <header>
          <h1>Buscador de peliculas</h1>
          <form className="form" onSubmit={handleSubmit}> 
            <input style={{ border: '1px solid transparent', borderColor: error ? 'red' : 'transparent'}} onChange={handleChange} value={search} name='query' placeholder="Avergers, Star Wars, The Matrix"/>
            <input type="checkbox" onChange={handleSort} checked={sort} />
            <button type='submit'>Buscar</button>
          </form>
          {error && <p style={{color: 'red'}}>{error}</p>}
          
        </header>

        <main>
          {
            loading ? <p>Cargando ...</p> : <Movies movies={ movies }/>
          }
          
        </main>
     </div>
    
  )
}

export default App
