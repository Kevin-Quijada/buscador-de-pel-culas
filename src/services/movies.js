const API_KEY = '4287ad07'

export const searchMovies = async ({ search }) => {
    if(search == '') return null

    try{
        const response = await fetch(`https://www.omdbapi.com/?apikey=${API_KEY}&s=${search}`)
        const json = await response.json()

        const movies = json.Search

        return movies?.map(movie => ({  //metodo para que sea mas comodo a la hora de cambiar la API 
            id: movie.imdbID,
            title: movie.Title,
            year: movie.Year,
            poster: movie.Poster
        }))
    } catch (e){
        throw new error('Error searching movies')
    }

    
}