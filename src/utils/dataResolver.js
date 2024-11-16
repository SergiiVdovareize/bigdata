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

    readDataType: async (type) => {
        switch (type) {
            case 'pedestrian':
                return await dataResolver.readPedestrians()
            case 'static':
                return await dataResolver.readStatic()
            case 'car':
                return await dataResolver.readCar()
            case 'bus':
                return await dataResolver.readBus()
            case 'train':
                return await dataResolver.readTrain()
            default:
                return [];
        }
    },

    readPedestrians: async (filename = 'A_2017.12.04_13.35.53.csv') => {
        return await dataResolver.read(`${telecomBasePath}/pedestrian/${filename}`)
    },

    readStatic: async (filename = 'A_2018.02.12_16.14.02.csv') => {
        return await dataResolver.read(`${telecomBasePath}/static/${filename}`)
    },

    readCar: async (filename = 'A_2017.12.08_07.01.34.csv') => {
        return await dataResolver.read(`${telecomBasePath}/car/${filename}`)
    },

    readBus: async (filename = 'A_2018.01.27_10.58.49.csv') => {
        return await dataResolver.read(`${telecomBasePath}/bus/${filename}`)
    },

    readTrain: async (filename = 'A_2018.02.05_15.07.33.csv') => {
        return await dataResolver.read(`${telecomBasePath}/train/${filename}`)
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