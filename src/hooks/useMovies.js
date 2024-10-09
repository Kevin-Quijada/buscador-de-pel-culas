import { useRef, useState, useMemo, useCallback } from 'react' //use ccallback es lo mismo que use Memo pero te ayuda a simplificar las funciones
import { searchMovies } from '../services/movies'

export function useMovies ({ search, sort }) { //custome hook que va a hacer todo el fecht de datos de las peliculas
  const [movies, setMovies] = useState([])
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState(null)
  const previousSearch = useRef(search) // No se vuelve a renderizar, guarda la referencia del anterior dato
  
    const getMovies = useCallback (async ({ search }) => {
        if (search == previousSearch.current) return

        try{
          setLoading(true)
          setError(null)
          previousSearch.current = search
          const newMovies = await searchMovies({search})
          setMovies(newMovies)
        }catch(e){
          setError(e.message)
        } finally {
          //Esto se va a ejecutar tanto en el try como en el catch
          setLoading(false)
        }
        
      },[])

    // const getSortedMovies = () =>{
    //   console.log('getsortedmovies')
    //   const sortMovies = sort
    // ? [... movies].sort((a, b) => a.title.localeCompare(b.title)) 
    // : movies

    // return sortMovies
    // }

    const sortedMovies = useMemo(() => { //Ahora nuestro componente es muchas mas optimo ya que solo se renderiza cuando sea nesesario 
      //Esto deberia de utilizarce es cuando hay muchos datos ya que queremos evitar que se esten renderizando un monton de contenido
      return sort //Este calculo lo queremos memorizar para evitarla y que solo la haga cuando cambia cierta informacion
        ? [... movies].sort((a, b) => a.title.localeCompare(b.title)) 
        : movies
      },[sort, movies]) //Aqui tendriamos las dependencias que tenga en cuenta y que esto se vuelva a ejecutar cada que cambie esas dependencias
        //Cuando cambia el sort porque cambia de orden o tambien cuando cambien las peliculas
        //si no se cambia entonces el valor de sortedMovies se mantiene

    return { movies : sortedMovies, getMovies, loading }
}