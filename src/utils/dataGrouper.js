const ageGroups = [
  {id: 1, min: 0, max: 16, name: '0-16 years'},
  {id: 2, min: 17, max: 25, name: '16-25 years'},
  {id: 3, min: 26, max: 40, name: '26-40 years'},
  {id: 4, min: 40, max: 60, name: '40-60 years'},
  {id: 5, min: 60, max: 200, name: '60+ years'},
]

const dataGrouper = {
  groupByCity: (data) => {
    const groups = []

    data.forEach(item => {
        const city = item.location;
        const currentGroup = groups.find(gr => gr.name === city)
        if (currentGroup) {
          currentGroup.values.push(item)
        } else {
          groups.push({name: city, values: []})
        }
    });
    return groups;
  },

  groupByAge: (data) => {
      const groups = [...ageGroups].map(gr => ({...gr, values: []}))
  
      data.forEach(item => {
        const age = item.age;
        const currGroup = groups.find(gr => (age >= gr.min && age <= gr.max))
        currGroup.values.push(item)
      });

      return groups;
  },

  groupByCityAge: (data) => {
    const groups = []

    data.forEach(item => {
        const { age, location: city } = item
        const currentAgeGroup = ageGroups.find(gr => (age >= gr.min && age <= gr.max))
        const currentGroup = groups.find(gr => (gr.name === city && gr.ageGroupId === currentAgeGroup.id))
        // const
        if (currentGroup) {
          // currentGroup.values.push(item)
          currentGroup.value++
        } else {
          groups.push({name: city, ageGroup: currentAgeGroup.name, ageGroupId: currentAgeGroup.id, value: 0})
        }
    });


    return groups;
  },
  ageGroups,
}

export default dataGrouper;