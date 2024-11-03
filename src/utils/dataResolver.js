import * as d3 from 'd3';

const dataResolver = {
    read: async (path) => {
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
        return Object.keys(data).map(key=> ({name: key, value: data[key].length}))
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

    groupByCity: (data) => {
        return data.reduce((acc, item) => {
            const city = item.location;
            if (!acc[city]) {
                acc[city] = [];
            }
            acc[city].push(item);
            return acc;
        }, {});
    },

    groupByAge: (data) => {
        const ageGroups = {
          "less than 16 years": [],
          "16-25 years": [],
          "26-40 years": [],
          "40-60 years": [],
          "60+ years": []
        };
    
        data.forEach(item => {
          const age = item.age;
          if (age < 16) {
            ageGroups["less than 16 years"].push(item);
          } else if (age <= 25) {
            ageGroups["16-25 years"].push(item);
          } else if (age <= 40) {
            ageGroups["26-40 years"].push(item);
          } else if (age <= 60) {
            ageGroups["40-60 years"].push(item);
          } else {
            ageGroups["60+ years"].push(item);
          }
        });
  
        return ageGroups;
    }
}

export default dataResolver;