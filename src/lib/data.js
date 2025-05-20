const stockSections = [
  { name: "Dust", style: "rgba(159, 226, 191, 1)" },
  { name: "WaterSoluble", style: "rgba(255, 191, 0, 1)" },
  { name: "Bio", style: "rgba(255, 127, 80, 1)" },
  { name: "Micronutrients", style: "rgba(222, 49, 99, 1)" },
  { name: "LiquidFertilizers", style: "rgba(159, 226, 191, 1)" },
  { name: "Granules", style: "rgba(64, 224, 208, 1)" },
  { name: "Ratol", style: "rgba(100, 149, 237, 1)" },
  { name: "Atharv", style: "rgba(204, 204, 255, 1)" },
  { name: "Others", style: "rgba(0, 0, 128, 1)" }
]

const getSectionDetails = (name) => {
  const section = stockSections.find(item => item.name === name);
  return section ? { name: section.name, style: section.style } : null;
}

export default getSectionDetails

