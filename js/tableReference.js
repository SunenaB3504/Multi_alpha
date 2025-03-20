/**
 * Multiplication Table Reference for Multiplication Adventure
 */

const TableReference = (function() {
    // Currently selected table
    let currentTable = 1;
    
    /**
     * Initialize table reference module
     */
    function init() {
        console.log('Initializing table reference module');
        
        // Set up table buttons
        setupTableButtons();
        
        // Generate initial table
        generateTable(currentTable);
        
        // Add dashboard button to reference
        const referenceButton = document.createElement('button');
        referenceButton.className = 'btn-primary reference-button';
        referenceButton.innerHTML = '<i class="fas fa-table"></i> View Tables';
        referenceButton.addEventListener('click', () => {
            UI.showSection('tableReference');
        });
        
        // Add to dashboard after level selector
        const levelSelector = document.querySelector('.level-selector');
        if (levelSelector) {
            levelSelector.after(referenceButton);
        }
    }
    
    /**
     * Set up table selection buttons
     */
    function setupTableButtons() {
        const tableButtons = document.querySelectorAll('.table-ref-btn');
        
        tableButtons.forEach(button => {
            button.addEventListener('click', () => {
                // Get table number
                const tableNum = parseInt(button.dataset.table);
                
                // Update active button
                tableButtons.forEach(btn => btn.classList.remove('active'));
                button.classList.add('active');
                
                // Generate table
                generateTable(tableNum);
                
                // Update current table
                currentTable = tableNum;
            });
        });
    }
    
    /**
     * Generate multiplication table
     * @param {Number} tableNum - The table number to generate
     */
    function generateTable(tableNum) {
        const tableContainer = document.getElementById('multiplicationTable');
        
        // Create table element
        const table = document.createElement('table');
        table.className = 'multi-table';
        
        // Add header row
        const headerRow = document.createElement('tr');
        
        // Add header cell for table number
        const tableHeader = document.createElement('th');
        tableHeader.textContent = `${tableNum}×`;
        headerRow.appendChild(tableHeader);
        
        // Add header cells for multipliers
        for (let i = 1; i <= 12; i++) {
            const th = document.createElement('th');
            th.textContent = i;
            headerRow.appendChild(th);
        }
        
        table.appendChild(headerRow);
        
        // Add data row
        const dataRow = document.createElement('tr');
        
        // Add label cell
        const labelCell = document.createElement('td');
        labelCell.textContent = 'Result:';
        dataRow.appendChild(labelCell);
        
        // Add result cells
        for (let i = 1; i <= 12; i++) {
            const td = document.createElement('td');
            td.className = 'highlighted';
            td.textContent = tableNum * i;
            dataRow.appendChild(td);
        }
        
        table.appendChild(dataRow);
        
        // Clear container and add new table
        tableContainer.innerHTML = '';
        tableContainer.appendChild(table);
        
        // Add equation displays below table
        const equationContainer = document.createElement('div');
        equationContainer.className = 'equation-container';
        
        for (let i = 1; i <= 12; i++) {
            const equation = document.createElement('div');
            equation.className = 'equation';
            equation.textContent = `${tableNum} × ${i} = ${tableNum * i}`;
            equationContainer.appendChild(equation);
        }
        
        tableContainer.appendChild(equationContainer);
    }
    
    /**
     * Show multiplication table section
     */
    function showTables() {
        UI.showSection('tableReference');
    }
    
    // Public API
    return {
        init,
        generateTable,
        showTables
    };
})();

// Initialize table reference module when document is ready
document.addEventListener('DOMContentLoaded', function() {
    TableReference.init();
});
