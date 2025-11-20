// Note: All PDF libraries (jspdf, jspdf-autotable) have been removed from this file.

// Utility function to export data to CSV (Excel compatible)
export const exportToCSV = (data, filename = 'financial_report.csv') => {
    if (!data || data.length === 0) {
        alert("No transactions to export.");
        return;
    }

    // Define the column headers and the fields to extract
    const headers = ["ID", "Timestamp", "Type", "Category", "Amount", "Note", "User ID"];
    const fields = ["id", "timestamp", "type", "category", "amount", "note", "user.id"];

    const csvRows = [];
    csvRows.push(headers.join(','));

    for (const item of data) {
        const values = fields.map(field => {
            let value = '';
            
            // Handle nested field (user.id)
            if (field.includes('.')) {
                const [parent, child] = field.split('.');
                value = item[parent] ? item[parent][child] : '';
            } else {
                value = item[field];
            }
            
            // Escape double quotes and surround with quotes if value contains comma or quotes
            if (typeof value === 'string') {
                value = value.replace(/"/g, '""');
                if (value.includes(',')) {
                    value = `"${value}"`;
                }
            }
            return value;
        });
        csvRows.push(values.join(','));
    }

    const csvString = csvRows.join('\n');
    const blob = new Blob([csvString], { type: 'text/csv;charset=utf-8;' });
    const link = document.createElement("a");
    
    if (link.download !== undefined) {
        const url = URL.createObjectURL(blob);
        link.setAttribute("href", url);
        link.setAttribute("download", filename);
        link.style.visibility = 'hidden';
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
        URL.revokeObjectURL(url);
    }
};