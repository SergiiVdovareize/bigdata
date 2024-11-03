import * as d3 from 'd3';

const dataFile = '/data/customers-5000.csv';

const dataResolver = {
    read: async (path = dataFile) => {
        const response = await fetch(path);
        const text = await response.text();
        const parsedData = d3.csvParse(text);
        const enrichedData = parsedData.map(item => ({
            ...item,
            age: dataResolver.calculateAge(item["bd"])
          }));
        return enrichedData;
    },

    normalize: (data) => {
        return Object.values(data).map(value => ({name: value.name, value: value.values.length}))
    },

    calculateAge: (dob) => {
        const birthDate = new Date(dob);
        const today = new Date();
        let age = today.getFullYear() - birthDate.getFullYear();
        const monthDifference = today.getMonth() - birthDate.getMonth();
        
        if (monthDifference < 0 || (monthDifference === 0 && today.getDate() < birthDate.getDate())) {
          age--;
        }
        return age;
    },
}

export default dataResolver;