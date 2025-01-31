// Import Bootstrap CSS
import 'bootstrap/dist/css/bootstrap.min.css';

// Import Bootstrap JS (optional)
import 'bootstrap/dist/js/bootstrap.bundle.min.js';


// Import jQuery (optional)
import $ from 'jquery';

// Import Axios
import axios from 'axios';


// Configure Axios instance with authentication
const apiClient = axios.create({
  baseURL: 'https://divhanasrv.diverseinfotech.net:44300/sap/opu/odata4/sap/zio_sb_v4/srvd/sap/zio_srv/0001/',
  headers: {
    'Content-Type': 'application/json',
  },
  auth: {
    username: 'abapcons', // Replace with your username
    password: 'Dipl@4321', // Replace with your password
  },
});

// Load headers
async function loadHeaders() {
  try {
    const response = await apiClient.get('/zIo_budget');
    const headers = response.data;

    const headerTable = document.getElementById('headerTable');
    headerTable.innerHTML = ''; // Clear existing data

    headers.forEach(header => {
      const row = document.createElement('tr');
      row.innerHTML = `
        <td>${header.bukrs}</td>
        <td>${header.zreq_no}</td>
        <td>${header.butxt}</td>
        <td><button class="btn btn-primary btn-sm view-items" data-id="${header.bukrs}">View Items</button></td>
      `;
      headerTable.appendChild(row);
    });

    // Add event listeners for "View Items" buttons
    document.querySelectorAll('.view-items').forEach(button => {
      button.addEventListener('click', function () {
        const headerId = this.getAttribute('data-id');
        loadItems(headerId, this.closest('tr'));
      });
    });
  } catch (error) {
    console.error('Error loading headers:', error);
  }
}

// Load items
async function loadItems(headerId, headerRow) {
  try {
    const response = await apiClient.get(`/zIo_budget_Item?headerId=${headerId}`);
    const items = response.data;

    const nextSibling = headerRow.nextElementSibling;
    if (nextSibling && nextSibling.classList.contains('item-row')) {
      nextSibling.remove();
    }

    const itemRow = document.createElement('tr');
    itemRow.classList.add('item-row');
    itemRow.innerHTML = `
      <td colspan="3">
        <ul class="list-group">
          ${items.map(item => `<li class="list-group-item">${item.bukrs}</li>`).join('')}
        </ul>
      </td>
    `;
    headerRow.insertAdjacentElement('afterend', itemRow);
  } catch (error) {
    console.error('Error loading items:', error);
  }
}

// Load headers on page load
loadHeaders();