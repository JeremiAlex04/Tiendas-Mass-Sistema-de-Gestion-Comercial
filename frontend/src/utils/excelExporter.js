import ExcelJS from 'exceljs';
import { saveAs } from 'file-saver';
import logo from '../assets/tienda_mass_logo.png';

export const generateExcelReport = async ({
    title,
    subtitle,
    columns,
    data,
    filename = 'reporte.xlsx'
}) => {
    const workbook = new ExcelJS.Workbook();
    const worksheet = workbook.addWorksheet('Reporte');

    const response = await fetch(logo);
    const buffer = await response.arrayBuffer();
    const imageId = workbook.addImage({
        buffer: buffer,
        extension: 'png',
    });

    worksheet.addImage(imageId, {
        tl: { col: 0, row: 0 },
        ext: { width: 150, height: 60 }
    });


    worksheet.mergeCells('C1:F2');
    const titleCell = worksheet.getCell('C1');
    titleCell.value = title;
    titleCell.font = { name: 'Arial', family: 4, size: 16, bold: true, color: { argb: 'FF30348C' } }; // Secondary Color
    titleCell.alignment = { vertical: 'middle', horizontal: 'center' };

    worksheet.mergeCells('C3:F3');
    const subtitleCell = worksheet.getCell('C3');
    subtitleCell.value = subtitle || `Generado el: ${new Date().toLocaleString()}`;
    subtitleCell.font = { name: 'Arial', family: 4, size: 10, italic: true };
    subtitleCell.alignment = { vertical: 'middle', horizontal: 'center' };

    worksheet.addRow([]);
    worksheet.addRow([]);
    worksheet.addRow([]);

    const headerRow = worksheet.getRow(6);
    headerRow.values = columns.map(col => col.header);

    headerRow.eachCell((cell) => {
        cell.fill = {
            type: 'pattern',
            pattern: 'solid',
            fgColor: { argb: 'FFF6B800' }
        };
        cell.font = {
            bold: true,
            color: { argb: 'FF000000' },
            size: 12
        };
        cell.alignment = { vertical: 'middle', horizontal: 'center' };
        cell.border = {
            top: { style: 'thin' },
            left: { style: 'thin' },
            bottom: { style: 'thin' },
            right: { style: 'thin' }
        };
    });

    data.forEach((item) => {
        const rowValues = columns.map(col => item[col.key]);
        const row = worksheet.addRow(rowValues);

        row.eachCell((cell) => {
            cell.border = {
                top: { style: 'thin' },
                left: { style: 'thin' },
                bottom: { style: 'thin' },
                right: { style: 'thin' }
            };
            cell.alignment = { vertical: 'middle', horizontal: 'left' };
        });
    });

    worksheet.columns.forEach((column, index) => {
        const colDef = columns[index];
        column.width = colDef.width || 20;
    });

    const bufferOut = await workbook.xlsx.writeBuffer();
    const blob = new Blob([bufferOut], { type: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet' });
    saveAs(blob, filename);
};
