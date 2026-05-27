function toCSV(data: Record<string, unknown>[]) {
  if (data.length === 0) {
    return '';
  }

  const replacer = (_key: string, value: unknown) => (value === null ? '' : value); // specify how you want to handle null values here
  const header = Object.keys(data[0]!);
  const csv = data.map(row =>
    header.map(fieldName => JSON.stringify(row[fieldName], replacer)).join(';'),
  );
  csv.unshift(header.join(';'));
  return csv.join('\r\n');
}

export function downloadCSV(fileName: string, data: Record<string, unknown>[]) {
  const csvData = toCSV(data);

  const blob = new Blob([csvData], { type: 'text/csv' });
  const url = URL.createObjectURL(blob);

  const link = document.createElement('a');
  link.setAttribute('href', url);
  link.setAttribute('download', `${fileName}.csv`);
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
}
