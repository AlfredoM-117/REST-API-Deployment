fetch('https://rest-api-deployment-dev-znba.3.us-1.fl0.io/movies')
  .then(response => response.json())
  .then(movies => {
    const html = movies.map(movie => {
      return `
        <article data-id="${movie.id}">
          <h2>${movie.title}</h2>
          <img src="${movie.poster}" alt="${movie.title}">        
          <p>${movie.year}</p>

          <button>Eliminar</button>
        </article>
      `
    }).join('')

    document.querySelector('main').innerHTML = html
    document.addEventListener('click', event => {
      if (event.target.matches('button')) {
        const article = event.target.closest('article')
        const { id } = article.dataset

        fetch(`https://rest-api-deployment-dev-znba.3.us-1.fl0.io/movies/${id}`, {
          method: 'DELETE'
        })
          .then(response => {
            if (response.ok) {
              article.remove()
            }
          })
      }
    })
  })
