document.addEventListener('DOMContentLoaded', () => {
    const headerTable = document.getElementById('headerTable');
  
    // Load headers
    async function loadHeaders() {
      try {
        const response = await fetch('/api/headers');
        const headers = await response.json();
  
        headerTable.innerHTML = ''; // Clear existing data
  
        if (headers.length === 0) {
          headerTable.innerHTML = '<tr><td colspan="4" class="text-center">No headers found</td></tr>';
          return;
        }
  
        headers.forEach((header) => {
          const row = document.createElement('tr');
          row.innerHTML = `
            <td>${header.bukrs || 'N/A'}</td>
            <td>${header.zreq_no || 'N/A'}</td>
            <td>${header.butxt || 'N/A'}</td>
            <td><button class="btn btn-primary btn-sm view-items" data-id="${header.bukrs}">View Items</button></td>
          `;
          headerTable.appendChild(row);
        });
  
        // Add event listeners for "View Items" buttons
        document.querySelectorAll('.view-items').forEach((button) => {
          button.addEventListener('click', function () {
            const headerId = this.getAttribute('data-id');
            loadItems(headerId, this.closest('tr'));
          });
        });
      } catch (error) {
        console.error('Error loading headers:', error);
        alert('Failed to load headers.');
      }
    }
  
    // Load items for a specific header
    async function loadItems(headerId, headerRow) {
      try {
        const response = await fetch(`/api/items/${headerId}`);
        const items = await response.json();
  
        const nextSibling = headerRow.nextElementSibling;
        if (nextSibling && nextSibling.classList.contains('item-row')) {
          nextSibling.remove();
        }
  
        if (items.length === 0) {
          const noItemsRow = document.createElement('tr');
          noItemsRow.classList.add('item-row');
          noItemsRow.innerHTML = `
            <td colspan="4" class="text-center text-muted">No items found for this header</td>
          `;
          headerRow.insertAdjacentElement('afterend', noItemsRow);
          return;
        }
  
        const itemRow = document.createElement('tr');
        itemRow.classList.add('item-row');
        itemRow.innerHTML = `
          <td colspan="4">
            <ul class="list-group">
              ${items.map((item) => `<li class="list-group-item">${item.bukrs || 'N/A'}</li>`).join('')}
            </ul>
          </td>
        `;
        headerRow.insertAdjacentElement('afterend', itemRow);
      } catch (error) {
        console.error('Error loading items:', error);
        alert('Failed to load items.');
      }
    }
  
    // Initial load
    loadHeaders();
  });
  