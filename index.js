// const fetchData = async(searchTerm) => {
//     const response = await axios.get('http://omdbapi.com/', {
//         params: {
//             apikey: 'e8146422',
//             s: 'avengers'
//         }
//     })

// if(response.data.Error){
//     return []
// }
// console.log(response.data.Search)

// }

// //fetchData()

autocompleteConfig = {
    renderOption(movie){
        const imgSrc = movie.Poster == 'N/A' ? '' : movie.Poster
        return`
        <img src="${imgSrc}" />
        ${movie.Title} (${movie.Year})
        `
    },
    inputValue(movie){
        return movie.Title
    },
    async fetchData(searchTerm){
        apiMovieURL = 'http:/www.omdapi.com'
        const response = await axios.get(apiMovieURL, {
            params:{
                apikey: 'e8146422',
                s: searchTerm
            }
        })
        if(response.data.Error){
            return []
        }

        console.log(response.data)
        return response.data.Search
    }
}

createAutoComplete({
    ...autocompleteConfig,
    root: document.querySelector('#left-autocomplete'),
    onOptionSelect(movie){
        document.querySelector('.tutorial').classList.add('is-hidden')
        onMovieSelect(movie, document.querySelector('#left-summmery'), 'left')
    }
})

createAutoComplete({
    ...autocompleteConfig,
    root: document.querySelector('#right-autocomplete'),
    onOptionSelect(movie){
        document.querySelector('.tutorial').classList.add('is-hidden')
        onMovieSelect(movie, document.querySelector('#right-summmery'), 'right')
    }
})

//Crear las variables para leftMovie y rightMOvie
let leftMovie
let rightMovie

const onMovieSelect = async (movie,summaryElement,side )=>{
    const response = await axios.get('http:/www.omdapi.com/', {
        params: {
            apikey: 'e8146422',
            i: movie.imdbID
        }
    })
    console.log(response.data)
    summaryElement.innerHTML = movieTemplate(response.data)

    if(side == 'left '){
        leftMovie = response.data
    }else{
        rightMovie = response.data
    }

    //Preguntamos si tenemos ambos lados
    if(leftMovie && rightMovie){
        //Entonces ejecuitamos la funcion de comparacion
        runComparison()
    }
}

const runComparison = () => {
    console.log('Comparacion de peliculas')
    const leftSideStatus = document.querySelectorAll('#letf-summary .notification')
    const rightSideStatus = document.querySelectorAll('#right-summary .notification')

    leftSideStatus.forEach((leftStat, index) => {
        const rightStat = rightSideStatus[index]
        const leftSideValue = parseInt(leftStat.dataset.value)
        const rightSideValue = parseInt(rightStat.dataset.value)

        if(rightSideValue > leftSideValue){
            leftStat.classList.remove('is-primary')
            leftStat.classList.add('is-danger')
        }else{
            rightStat.classList.remove('is-primary')
            rightStat.classList.add('is-danger')
        }
       


    })

}

const root = document.querySelector(' .autocomplete')
root.innerHTML = `
    <label><b>Busqueda de Peliculas</b></label>
    <input class="input" />
    <div class="dropdow">
        <div class="dropdown-menu">
            <div class="dropdown-content results"></div>
        </div>
    </div>
`

const input = document.querySelector("Input")
const dropdonw = document.querySelector(' .dropdown')
const resultsWrapper = document.querySelector(' .results')
   
const debonce = (func, delay = 1000) =>{
    let timeoutId
    return(...args) => {
        clearTimeout(timeoutId)
        timeoutId = setTimeout(() => {
            func.apply(null, args)
        }, delay)
    }
}
const onInput = async(event) =>{
    const movies = await fetchData(event.target.value)
    console.log("MOVIES: ", movies)

    if(!movies.length){
        dropdonw.classList.remove('is-active')
    }

    resultsWrapper.innerHTML = ''
    dropdonw.classList.add('is-active')

    for(let movie of movies){
        const option = document.createElement('a')
        const imgSrc = movie.Poster === 'N/A'?'': movie.Poster

        option.classList.add('dropdown-item')
        option.innerHTML = `
        <img src ="${imgSrc}" />
        ${movie.Title}
        `
        option.addEventListener('click', () => {
            dropdonw.classList.remove('is-active')
            input.value = movie.Title
            onMovieSelect(movie)
        })
        resultsWrapper.appendChild(option)
    }
}

input.addEventListener('input', debunce(onInput, 1000))

document.addEventListener('click', event => {
    if(!root.contains(event.target)) {
        dropdonw.classList.remove('is-active')
    }
})

const onMuvieSelect = async (movie) => {
    const response = await axios.get('http://www.omdbapi.com/', {
        params: {
            apikey: '',
        i: movie.imdID
        }
    })

    console.log(response.data)
    document.querySelector('#sumary').innerHTML = movieTemplate(response)
}

const movieTemplate = (movieDetail) => {
    return `
        <article class="media">
            <figure class"media-left">
                <p class="image">
                    <img src="${movieDetail.POster}" />
                </p>
            </figure>
            <div class="content">
                <h1>${movieDetail.Title}</h1>
                <h4>${movieDetail.Genre}</h4>
                <p>${movieDetail.Plot}</p>
            </div>
        </article>
    `

}