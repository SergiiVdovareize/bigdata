import * as d3 from 'd3';

const dataFile = '/data/customers-5000.csv';

const telecomBasePath = '/data/telecom/'

const dataResolver = {
    parseCSV: (csv) => {
        const [header, ...rows] = csv.split('\n');
        const headers = header.split(',');
      
        return rows.map(row => {
          const values = row.split(',');
          return headers.reduce((object, header, index) => {
            object[header] = values[index];
            return object;
          }, {});
        });
    },

    read: async (path = dataFile, usePlainParser = true) => {
        const response = await fetch(path);
        const text = await response.text();
        const parsedData = usePlainParser ? dataResolver.parseCSV(text) : d3.csvParse(text)
        if (!!parsedData[0].bd) {
            return dataResolver.addBd(parsedData);
        }
        
        return parsedData
    },

    addBd: (data) => {
        const enrichedData = data.map(item => ({
            ...item,
            age: dataResolver.calculateAge(item["bd"])
        }));
        return enrichedData;
    },

    readPedestrians: async (filename = 'B_2018.02.11_13.30.46.csv') => {
        return await dataResolver.read(`${telecomBasePath}/pedestrian/${filename}`)
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