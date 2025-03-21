// export const formatToDateInput = (dateString) => {
//     if (!dateString) return ''; // Si está vacío o undefined, devuelve una cadena vacía
//     const parts = dateString.split('/');
//     if (parts.length !== 3) return ''; // Verificar que el formato es válido
//     const [day, month, yearAndTime] = parts;
//     const [year] = yearAndTime.split(' '); // Ignorar la parte "HH:mm:ss"
//     return `${year}-${month}-${day}`;
// };

export const formatToDateInput = (dateString) => {
    if (!dateString) return ''; // Handle empty or undefined values
    const parts = dateString.split('/');
    if (parts.length !== 3) return ''; // Ensure format is correct
    const [day, month, yearAndTime] = parts;
    const [year] = yearAndTime.split(' '); // Ignore time part

    // Ensure two-digit day and month
    const dayPadded = day.padStart(2, '0');
    const monthPadded = month.padStart(2, '0');

    return `${year}-${monthPadded}-${dayPadded}`;
};

// Función para transformar "YYYY-MM-DD" a "DD/MM/YYYY HH:mm:ss"
export const formatToDatabase = (dateString) => {
    if (!dateString || dateString.trim() === '') return ''; // Validar vacío
    const [year, month, day] = dateString.split('-');
    if (!year || !month || !day) return ''; // Validar formato incompleto
    return `${day}/${month}/${year} 00:00:00`;
};

export const parseDate = (dateString) => {
    if (!dateString) return '';
    const dateParsed = new Date(dateString).toLocaleDateString('es-ES', { day: '2-digit', month: '2-digit', year: 'numeric', hour: '2-digit', minute: '2-digit', second: '2-digit' })
    return dateParsed;
};


