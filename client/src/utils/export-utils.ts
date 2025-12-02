import * as XLSX from 'xlsx';

export interface ExportData {
  [key: string]: any;
}

export const exportToExcel = (data: ExportData[], filename: string) => {
  const worksheet = XLSX.utils.json_to_sheet(data);
  const workbook = XLSX.utils.book_new();
  XLSX.utils.book_append_sheet(workbook, worksheet, 'Data');
  
  // Add some styling
  const range = XLSX.utils.decode_range(worksheet['!ref'] || 'A1');
  for (let C = range.s.c; C <= range.e.c; ++C) {
    const address = XLSX.utils.encode_col(C) + "1";
    if (!worksheet[address]) continue;
    worksheet[address].s = {
      font: { bold: true },
      fill: { fgColor: { rgb: "3B82F6" } },
      alignment: { horizontal: "center" }
    };
  }
  
  XLSX.writeFile(workbook, `${filename}.xlsx`);
};

export const exportToCSV = (data: ExportData[], filename: string) => {
  const worksheet = XLSX.utils.json_to_sheet(data);
  const csv = XLSX.utils.sheet_to_csv(worksheet);
  
  const blob = new Blob([csv], { type: 'text/csv;charset=utf-8;' });
  const link = document.createElement('a');
  const url = URL.createObjectURL(blob);
  
  link.setAttribute('href', url);
  link.setAttribute('download', `${filename}.csv`);
  link.style.visibility = 'hidden';
  
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
};

export const exportToPDF = async (elementId: string, filename: string) => {
  // This would require a library like jsPDF or html2pdf
  // For now, we'll use the browser's print dialog
  const element = document.getElementById(elementId);
  if (!element) {
    throw new Error(`Element with id ${elementId} not found`);
  }
  
  const printWindow = window.open('', '_blank');
  if (!printWindow) {
    throw new Error('Failed to open print window');
  }
  
  printWindow.document.write(`
    <!DOCTYPE html>
    <html>
      <head>
        <title>${filename}</title>
        <style>
          body { font-family: Arial, sans-serif; padding: 20px; }
          table { width: 100%; border-collapse: collapse; margin: 20px 0; }
          th, td { border: 1px solid #ddd; padding: 8px; text-align: left; }
          th { background-color: #3B82F6; color: white; }
          @media print {
            button { display: none; }
          }
        </style>
      </head>
      <body>
        ${element.innerHTML}
        <script>
          window.onload = function() {
            window.print();
            window.close();
          };
        </script>
      </body>
    </html>
  `);
  
  printWindow.document.close();
};

export const exportDashboardStats = (stats: any) => {
  const exportData = [
    {
      Metric: 'Total Patients',
      Value: stats.totalPatients || 0,
      Change: `${stats.patientsChange || 0}%`
    },
    {
      Metric: "Today's Visits",
      Value: stats.todayVisits || 0,
      Change: `${stats.visitsChange || 0}%`
    },
    {
      Metric: 'Total Revenue',
      Value: `₦${stats.totalRevenue?.toLocaleString() || 0}`,
      Change: `${stats.revenueChange || 0}%`
    },
    {
      Metric: 'Active Staff',
      Value: stats.activeStaff || 0,
      Change: 'N/A'
    },
    {
      Metric: 'Pending Labs',
      Value: stats.pendingLabs || 0,
      Change: `${stats.labsChange || 0}%`
    },
    {
      Metric: 'Low Stock Items',
      Value: stats.lowStockItems || 0,
      Change: `${stats.stockChange || 0}%`
    },
    {
      Metric: "Today's Appointments",
      Value: stats.appointmentsToday || 0,
      Change: 'N/A'
    },
    {
      Metric: 'Completed Appointments',
      Value: stats.completedAppointments || 0,
      Change: 'N/A'
    }
  ];
  
  const timestamp = new Date().toISOString().split('T')[0];
  exportToExcel(exportData, `dashboard-stats-${timestamp}`);
};

export const exportActivityLog = (activities: any[]) => {
  const exportData = activities.map(activity => ({
    Timestamp: activity.timestamp,
    User: activity.user,
    Action: activity.description,
    Type: activity.type,
    Severity: activity.severity
  }));
  
  const timestamp = new Date().toISOString().split('T')[0];
  exportToExcel(exportData, `activity-log-${timestamp}`);
};

export const exportStaffActivity = (staff: any[]) => {
  const exportData = staff.map(member => ({
    Name: member.name,
    Role: member.role,
    Status: member.status,
    'Tasks Completed': member.tasksCompleted,
    'Current Task': member.currentTask,
    'Last Active': member.lastActive
  }));
  
  const timestamp = new Date().toISOString().split('T')[0];
  exportToExcel(exportData, `staff-activity-${timestamp}`);
};

