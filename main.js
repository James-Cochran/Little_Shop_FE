import './style.css'
import {fetchData, postData, deleteData, editData} from './apiCalls'
import {showStatus} from './errorHandling'

//Sections, buttons, text
const itemsView = document.querySelector("#items-view")
const noItemsView = document.querySelector("#noItems-view")
const merchantsView = document.querySelector("#merchants-view")
const merchantsNavButton = document.querySelector("#merchants-nav")
const itemsNavButton = document.querySelector("#items-nav")
const addNewButton = document.querySelector("#add-new-button")
const showingText = document.querySelector("#showing-text")
const metrics  = document.querySelector("#display-metrics")
const sortMerchantsButton = document.querySelector("#sort-merchants-button")


//Form elements
const merchantForm = document.querySelector("#new-merchant-form")
const newMerchantName = document.querySelector("#new-merchant-name")
const submitMerchantButton = document.querySelector("#submit-merchant")

// Event Listeners
merchantsView.addEventListener('click', (event) => {
  handleMerchantClicks(event)
})

merchantsNavButton.addEventListener('click', showMerchantsView)
itemsNavButton.addEventListener('click', showItemsView)

addNewButton.addEventListener('click', () => {
  show([merchantForm])
})

submitMerchantButton.addEventListener('click', (event) => {
  submitMerchant(event)
})

sortMerchantsButton.addEventListener('click', sortMerchants)

//Global variables
let merchants;
let merchantsSorted;
let items;

//Page load data fetching
Promise.all([fetchData('merchants'), fetchData('items')])
.then(responses => {
    merchants = responses[0].data
    merchantsSorted = [...responses[0].data]  // shallow copy.
    items = responses[1].data
    displayMerchants(merchants)
  })
  .catch(err => {
    console.log('catch error: ', err)
  })

// Merchant CRUD Functions
function handleMerchantClicks(event) {
  if (event.target.classList.contains("delete-merchant")) {
    deleteMerchant(event)
  } else if (event.target.classList.contains("edit-merchant")) {
    editMerchant(event)
  } else if (event.target.classList.contains("view-merchant-items")) {
    displayMerchantItems(event)
  } else if (event.target.classList.contains("submit-merchant-edits")) {
    submitMerchantEdits(event)
  } else if (event.target.classList.contains("discard-merchant-edits")) {
    discardMerchantEdits(event)
  }
}

function deleteMerchant(event) {
  const id = event.target.closest("article").id.split('-')[1]
  deleteData(`merchants/${id}`)
    .then(() => {
      let deletedMerchant = findMerchant(id)
      let indexOfMerchant = merchants.indexOf(deletedMerchant)
      let indexOfMerchantsSorted = merchantsSorted.indexOf(deletedMerchant)
      merchants.splice(indexOfMerchant, 1)
      merchantsSorted.splice(indexOfMerchantsSorted, 1)
      displayMerchants(merchants)
      showStatus('Success! Merchant removed!', true)

    })
}

function editMerchant(event) {
  const article = event.target.closest("article")
  const h3Name = article.firstElementChild
  const editInput = article.querySelector(".edit-merchant-input")
  const submitEditsButton = article.querySelector(".submit-merchant-edits")
  const discardEditsButton = article.querySelector(".discard-merchant-edits")
  editInput.value = h3Name.innerText
  show([editInput, submitEditsButton, discardEditsButton])
}

function submitMerchantEdits(event) {
  event.preventDefault();
  const article = event.target.closest("article")
  const editInput = article.querySelector(".edit-merchant-input")
  const id = article.id.split('-')[1]

  const patchBody = { name: editInput.value }
  editData(`merchants/${id}`, patchBody)
    .then(patchResponse => {
      let merchantToUpdate = findMerchant(patchResponse.data.id)
      let indexOfMerchant = merchants.indexOf(merchantToUpdate)
      let indexOfMerchantsSorted = merchantsSorted.indexOf(merchantToUpdate)
      merchants.splice(indexOfMerchant, 1, patchResponse.data)
      merchantsSorted.splice(indexOfMerchantsSorted, 1, patchResponse.data)
      displayMerchants(merchants)
      showStatus('Success! Merchant updated!', true)
    })
}

function discardMerchantEdits(event) {
  const article = event.target.closest("article")
  const editInput = article.querySelector(".edit-merchant-input")
  const submitEditsButton = article.querySelector(".submit-merchant-edits")
  const discardEditsButton = article.querySelector(".discard-merchant-edits")

  editInput.value = ""
  hide([editInput, submitEditsButton, discardEditsButton])
}

function submitMerchant(event) {
  event.preventDefault()
  var merchantName = newMerchantName.value
  postData('merchants', { name: merchantName })
    .then(postedMerchant => {
      merchants.push(postedMerchant.data)
      merchantsSorted.push(postedMerchant.data)
      displayAddedMerchant(postedMerchant.data)
      newMerchantName.value = ''
      showStatus('Success! Merchant added!', true)
      hide([merchantForm]) 
    })
}

// Functions that control the view 
function showMerchantsView() {
  showingText.innerText = "All Merchants"
  addRemoveActiveNav(merchantsNavButton, itemsNavButton)
  addNewButton.dataset.state = 'merchant'
  show([merchantsView, addNewButton, sortMerchantsButton])
  hide([itemsView])
  console.log(merchants)
  displayMerchants(merchants)
}

function showItemsView() {
  showingText.innerText = "All Items"
  addRemoveActiveNav(itemsNavButton, merchantsNavButton)
  addNewButton.dataset.state = 'item'
  show([itemsView])
  displayItemMetrics(items)
  hide([merchantsView, merchantForm, addNewButton, sortMerchantsButton])
  displayItems(items)
}

function showMerchantItemsView(id, items) {
  showingText.innerText = `All Items for Merchant #${id}`
  show([itemsView])
  hide([merchantsView, addNewButton, sortMerchantsButton])
  addRemoveActiveNav(itemsNavButton, merchantsNavButton)
  addNewButton.dataset.state = 'item'
  displayItemMetrics(items)
  displayItems(items)
}

// Functions that add data to the DOM
function displayItems(items) {
  itemsView.innerHTML = ''
  if (items.length === 0 ) {
    itemsView.innerHTML += `
    <article class="no-item" id="item-">
    <h2>This merchant currently has no items available.</h2>
      <img src="https://cdn3d.iconscout.com/3d/premium/thumb/empty-box-3d-icon-download-in-png-blend-fbx-gltf-file-formats--state-result-not-found-pack-design-shapes-icons-7335859.png" alt="Empty box.">
      <p><i>Please check back soon or explore other merchants for great products!</i></p>
      <p>Thank you.</p>
      <p class="merchant-name-in-item"> </p>
    </article>
    `
  } else {
  let firstHundredItems = items.slice(0, 99)
  firstHundredItems.forEach(item => {
    let merchant = findMerchant(item.attributes.merchant_id).attributes.name
    itemsView.innerHTML += `
     <article class="item" id="item-${item.id}">
          <img src="" alt="">
          <h2>${item.attributes.name}</h2>
          <p>${item.attributes.description}</p>
          <p>$${item.attributes.unit_price}</p>
          <p class="merchant-name-in-item">Merchant: ${merchant}</p>
        </article>
    `
    })
  }
}

function displayMerchants(merchants) {
    merchantsView.innerHTML = ''
    displayMerchantMetrics(merchants)
    merchants.forEach(merchant => {
        merchantsView.innerHTML += 
        `<article class="merchant" id="merchant-${merchant.id}">
          <h3 class="merchant-name">${merchant.attributes.name}</h3>
          <div>
            <button class="view-merchant-items">View Merchant Items</button>
            <button class="edit-merchant icon">✎</button>
            <input class="edit-merchant-input hidden" name="edit-merchant" type="text">
            <button class="submit-merchant-edits hidden">
              Submit Edits
            </button>
            <button class="discard-merchant-edits hidden">
              Discard Edits
            </button>
            <button class="delete-merchant icon">🗑️</button>
          </div>
        </article>`
    })
}

function displayMerchantMetrics(merchants){
  metrics.innerHTML =''
  metrics.innerHTML = `
    <div class='metrics orange-purple'> 
      <img src='public/shop.svg'/>
      <p>Total Merchants = ${merchants.length}</p<
    </div>
  `
}


function displayItemMetrics(items) {
  metrics.innerHTML = '';
  if (items.length == 0){
    return
  }
  const highest_cost = items.reduce((accum, item) => {
    accum += item.attributes.unit_price;
    return accum;
  }, 0);
  const average_cost = highest_cost / items.length;
  const average_cost_rounded = Math.round(average_cost * 100) / 100;
  metrics.innerHTML = `
    <div class='metrics orange-blue'> 
      <img src='public/receipt.svg' alt='Shop Icon'/>
      <p>Total Items = ${items.length}</p>
    </div>
    <div class='metrics blue-purple'> 
      <img src='public/cash-stack.svg' alt='Shop Icon'/>
      <p>Average Cost = ${average_cost_rounded}</p>
    </div>
  `;
}

function displayAddedMerchant(merchant) {
      merchantsView.insertAdjacentHTML('beforeend', 
      `<article class="merchant" id="merchant-${merchant.id}">
          <h3 class="merchant-name">${merchant.attributes.name}</h3>
          <div>
            <button class="view-merchant-items">View Merchant Items</button>
            <button class="edit-merchant icon">✎</button>
            <input class="edit-merchant-input hidden" name="edit-merchant" type="text">
            <button class="submit-merchant-edits hidden">
              Submit Edits
            </button>
            <button class="discard-merchant-edits hidden">
              Discard Edits
            </button>
            <button class="delete-merchant icon">🗑️</button>
          </div>
        </article>`)
}

function displayMerchantItems(event) {
  let merchantId = event.target.closest("article").id.split('-')[1]
  const filteredMerchantItems = filterByMerchant(merchantId)
  showMerchantItemsView(merchantId, filteredMerchantItems)
}

//Helper Functions
function show(elements) {
  elements.forEach(element => {
    element.classList.remove('hidden')
  
    if (element === itemsView) {
      setTimeout(() => {

        element.classList.add('fade-in')
      }, 0); 
    }

    if (element === merchantsView) {
      setTimeout(() => {
        element.classList.add('fade-in')
      }, 0);
    }
  })
}

function hide(elements) {
  elements.forEach(element => {
    if (element === itemsView) {
      element.classList.remove('fade-in') 
    }
    if (element === merchantsView) {
      element.classList.remove('fade-in')
    }
    element.classList.add('hidden')
  })
}

function addRemoveActiveNav(nav1, nav2) {
  nav1.classList.add('active-nav')
  nav1.classList.add('active-bubble')
  nav2.classList.remove('active-nav')
  nav2.classList.remove('active-bubble')
}

function filterByMerchant(merchantId) {
  const specificMerchantItems = items.filter((item) => {
    return item.attributes.merchant_id === parseInt(merchantId)
  })
  return specificMerchantItems
}

function findMerchant(id) {

  let foundMerchant = merchants.find((merchant) => {
    return (parseInt(id)) === (parseInt(merchant.id))
  })

  return foundMerchant
   
}

function sortMerchants() {
  merchantsSorted.sort((a, b) => {
    const first = a.attributes.name.toLowerCase()
    const second = b.attributes.name.toLowerCase()

    return first.localeCompare(second);
  })

  displayMerchants(merchantsSorted)
}
