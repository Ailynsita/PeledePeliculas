const createAutoComplete =({root, rederOption, onOptionSelect, inputValue, fetchData}) => {
    //Funcion AutoComplete

    root.innerHTML=`
    <label><b>Busqueda de peliculas</b></label>
    <input class= "input" />
    <div class="dropdown">
    <div class= "dropdown-menu">
    <div class= "dropdown-content results"> 
    </div>
    </div>
    </div>
    `
} 
    const input= root.querySelector("input")
    const dropdown = root.querySelector('.dropdown')
    const resultswrapper = root.querySelector('.results')
    
    const debonce = (func, delay = 1000)=>{
        let timeoutId
        return(...args)=>{
            clearTimeout(timeoutId)
            timeoutId= setTimeout(()=>{
            func.apply(null, args)
            },delay)
    }
  }


const onInput = async event =>{
    const items = await fetchData (event.target.value)
    console.log("movies", items)

    if(items.length){
        dropdown.classList.remove('is-active')
        for(let item of items){
            const option = document.createElement('a')

            option.classList.add('dropdown-item')
            option.innerHTML = renderOption(item)
            option.addEventListener('click', ()=>{
                input.value = inputValue(item)
                onOptionSelect(item)
                console.log("onMovieSelector")
            })
            resultsWrapper.appendChild(option)
        }
        input.addEventListener(`input` , debonce(onInput, 1000))

        document.addEventListener(`click` , event =>{
        if(!root.contains(event.target)){
            dropdown.classList.remove(`is-active`)
        }
    })
  }
}