const XLSX = require('xlsx');
const fs = require('fs');
const yargs = require('yargs');

// Configuração para capturar os parâmetros de entrada
const argv = yargs
  .option('file', {
    alias: 'f',
    description: 'Caminho do arquivo Excel (.xls ou .xlsx)',
    type: 'string',
    demandOption: true
  })
  .option('date', {
    alias: 'd',
    description: 'Data (formato: YYYY-MM-DD)',
    type: 'string',
    demandOption: false
  })
  .option('time', {
    alias: 't',
    description: 'Hora (formato: HH:mm:sss)',
    type: 'string',
    demandOption: false
  })
  .option('expression', {
    alias: 'e',
    description: 'Expressão a ser procurada no arquivo',
    type: 'string',
    demandOption: true
  })
  .help()
  .alias('help', 'h')
  .argv;

// Função para converter data no formato juliano
const convertToJulianDate = (date) => {
  const inputDate = new Date(date);
  const startOfYear = new Date(inputDate.getFullYear(), 0, 0);
  const diff = inputDate - startOfYear;
  const oneDay = 1000 * 60 * 60 * 24;
  const dayOfYear = Math.floor(diff / oneDay);
  return `${inputDate.getFullYear()}${dayOfYear.toString().padStart(3, '0')}`;
};

// Função para converter hora no formato HHmmssSSS
const convertToFormattedTime = (timeString) => {
  const [hours, minutes, ms] = timeString.split(':');
  return `${hours}${minutes}${ms}`;
};

// Lê o arquivo Excel
const readExcelFile = (filePath) => {
  if (!fs.existsSync(filePath)) {
    console.error('Arquivo não encontrado!');
    process.exit(1);
  }

  const workbook = XLSX.readFile(filePath);
  const sheetName = workbook.SheetNames[0];
  const worksheet = workbook.Sheets[sheetName];

  return XLSX.utils.sheet_to_json(worksheet, { header: 1 }); // Converte para array de arrays
};

// Filtra as linhas conforme a expressão e a data
const filterRowsByExpressionAndDate = (data, expression, date, time) => {
  const rows = [];

  const julianDate = date ? convertToJulianDate(date) : null;
  const formattedTime = time ? convertToFormattedTime(time) : null;

  data.forEach((row, index) => {
    const rowDate = row[0]; // Supondo que a data está na primeira coluna
    const rowTime = row[1] //Supondo que a hora esteja na segunda coluna

    // Verifica se a expressão está na linha e se a data, se fornecida, corresponde
    if (row.some(cell => cell && cell.toString().includes(expression)) && (!date || rowDate === julianDate) && (!time || rowTime === rowTime.startsWith(formattedTime))) {
      rows.push(row);
      if (data[index + 1]) rows.push(data[index + 1]); // Linha seguinte
      if (data[index + 2]) rows.push(data[index + 2]); // Segunda linha seguinte
    }
  });

  return rows;
};

// Gera um novo arquivo Excel com as linhas filtradas
const writeExcelFile = (data, date, time) => {
  const newWorkbook = XLSX.utils.book_new();
  const newWorksheet = XLSX.utils.aoa_to_sheet(data);

  XLSX.utils.book_append_sheet(newWorkbook, newWorksheet, 'FilteredData');

  const newFileName = `filtered_data_${date || 'no_date'}_${time ? time.replace(':', '-') : 'no_time'}.xlsx`;
  XLSX.writeFile(newWorkbook, newFileName);

  console.log(`Novo arquivo criado: ${newFileName}`);
};

// Fluxo principal
const main = () => {
  const filePath = argv.file;
  const date = argv.date || null;
  const time = argv.time || null;
  const expression = argv.expression;

  const data = readExcelFile(filePath);
  const filteredRows = filterRowsByExpressionAndDate(data, expression, date, time);
  if (filteredRows.length > 0) {
    writeExcelFile(filteredRows, date, time);
  } else {
    console.log('Nenhuma linha correspondente à expressão e data encontrada.');
  }
};

main();
