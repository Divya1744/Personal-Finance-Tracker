import jsPDF from 'jspdf';
import 'jspdf-autotable'; // <-- CRUCIAL: This line must be present for the plugin to attach

// Utility function to export data to CSV
export const exportToCSV = (data, filename = 'financial_report.csv') => {
    if (!data || data.length === 0) {
        alert("No transactions to export.");
        return;
    }

    const headers = ["ID", "Timestamp", "Type", "Category", "Amount", "Note", "User ID"];
    const fields = ["id", "timestamp", "type", "category", "amount", "note", "user.id"];

    const csvRows = [];
    csvRows.push(headers.join(','));

    for (const item of data) {
        const values = fields.map(field => {
            let value = '';
            
            if (field.includes('.')) {
                const [parent, child] = field.split('.');
                value = item[parent] ? item[parent][child] : '';
            } else {
                value = item[field];
            }
            
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


// Utility function to export data to PDF
export const exportToPDF = (data, filename = 'financial_report.pdf') => {
    if (!data || data.length === 0) {
        alert("No transactions to export.");
        return;
    }

    // Initialize jsPDF
    const doc = new jsPDF();
    const headers = [
        "ID", 
        "Date", 
        "Type", 
        "Category", 
        "Amount (₹)", 
        "Note"
    ];

    // Prepare table data (rows)
    const body = data.map(item => [
        item.id,
        new Date(item.timestamp).toLocaleDateString(),
        item.type,
        item.category,
        `₹${item.amount.toFixed(2)}`,
        item.note || 'N/A'
    ]);

    // Add title
    doc.setFontSize(18);
    doc.text("Personal Finance Report", 14, 20);
    
    // Add date range
    doc.setFontSize(10);
    const dateRange = data.length > 0 
        ? `From ${new Date(data[0].timestamp).toLocaleDateString()} to ${new Date(data[data.length - 1].timestamp).toLocaleDateString()}` 
        : '';
    doc.text(dateRange, 14, 25);

    // Call autoTable (now successfully attached)
    doc.autoTable({
        startY: 30, 
        head: [headers],
        body: body,
        theme: 'striped',
        styles: { fontSize: 8 },
        headStyles: { fillColor: [79, 70, 229] }, 
        margin: { top: 10 }
    });

    // Save the PDF
    doc.save(filename);
};