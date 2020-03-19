(function () {
  // 變數宣告
  const BASE_URL = 'https://movie-list.alphacamp.io/'
  const INDEX_URL = BASE_URL + 'api/v1/movies/'
  const POSTER_URL = BASE_URL + 'posters/'
  const data = []

  const dataPanel = document.getElementById('data-panel')
  const listGroup = document.getElementById('list-group')
  const searchForm = document.getElementById('search')
  const searchInput = document.getElementById('search-input')

  const pagination = document.getElementById('pagination')
  const ITEM_PER_PAGE = 12
  let paginationData = []

  const genres = {
    "1": "Action",
    "2": "Adventure",
    "3": "Animation",
    "4": "Comedy",
    "5": "Crime",
    "6": "Documentary",
    "7": "Drama",
    "8": "Family",
    "9": "Fantasy",
    "10": "History",
    "11": "Horror",
    "12": "Music",
    "13": "Mystery",
    "14": "Romance",
    "15": "Science Fiction",
    "16": "TV Movie",
    "17": "Thriller",
    "18": "War",
    "19": "Western"
  }


  axios.get(INDEX_URL)
    .then((response) => {
      let a = []
      data.push(...response.data.results)
      console.log(data)
      getTotalPages(data)
      displayDataList(data)
      getPageData(1, data)

    })
    .catch((err) => console.log(err))

  // 顯示分類
  for (let i in genres) {
    listContent = `
    <a class="list-group-item list-group-item-action" id="list-home-list" data-toggle="list" href="#list-home" role="tab" aria-controls="home">${genres[i]}</a>
  `
    listGroup.innerHTML += listContent
  }

  // 事件
  pagination.addEventListener('click', event => {
    console.log(event.target.dataset.page)
    if (event.target.tagName === 'A') {
      getPageData(event.target.dataset.page)
    }
  })


  searchForm.addEventListener('submit', event => {
    event.preventDefault()
    if (searchInput.value !== '') {
      let input = searchInput.value.toLowerCase()
      let results = data.filter(
        movie => movie.title.toLowerCase().includes(input)
      )
      console.log(results)
      getTotalPages(results)
      displayDataList(results)
      getPageData(1, results)
    }
    else {
      alert("請輸入電影名稱")
    }
  })

  listGroup.addEventListener('click', event => {
    let input = event.target.innerText
    let results = data.filter(movie =>
      movie.genres.some(key => input === genres[key])
    )
    if (results.length !== 0) {
      console.log(results)
      getTotalPages(results)
      displayDataList(results)
      getPageData(1, results)
    }
    else {
      nullValueDataList()
    }
  })


  // 函式
  function getTotalPages(data) {
    let totalPages = Math.ceil(data.length / ITEM_PER_PAGE) || 1
    let pageItemContent = ''
    for (let i = 0; i < totalPages; i++) {
      pageItemContent += `
        <li class="page-item">
          <a class="page-link" href="javascript:;" data-page="${i + 1}">${i + 1}</a>
        </li>
      `
    }
    pagination.innerHTML = pageItemContent
  }


  function getPageData(pageNum, data) {
    paginationData = data || paginationData
    let offset = (pageNum - 1) * ITEM_PER_PAGE
    let pageData = paginationData.slice(offset, offset + ITEM_PER_PAGE)
    displayDataList(pageData)
  }


  function displayDataList(data) {
    let htmlContent = ''

    data.forEach(function (item, index) {
      let label = ''

      for (let i in item.genres) {
        label += `
          <span class="badge badge-light">${genres[item.genres[i]]}</span>
        `
      }

      htmlContent += `
      <div class="col-sm-3">
        <div class="card mb-2">
          <img class="card-img-top " src="${POSTER_URL}${item.image}" alt="Card image cap">
          <div class="card-body movie-item-body" id="card-body">
            <h6 class="card-title">${item.title}</h6>
            ${label}
          </div>
        </div>
      </div>
      `

      dataPanel.innerHTML = htmlContent
    })
  }

  function nullValueDataList() {
    let htmlContent = ''
    htmlContent += `
      <h3>此分類沒有資料</h3>
      `
    dataPanel.innerHTML = htmlContent
  }
})()
