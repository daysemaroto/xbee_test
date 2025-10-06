// Enums
const WeekdayEnum = {
  MONDAY: "Monday",
  TUESDAY: "Tuesday",
  WEDNESDAY: "Wednesday",
  THURSDAY: "Thursday",
  FRIDAY: "Friday",
  SATURDAY: "Saturday",
  SUNDAY: "Sunday",
};

Object.freeze(WeekdayEnum);

const AcousticEnum = {
  YES: "Sí",
  NO: "No",
};

Object.freeze(AcousticEnum);

const DataSourceEnum = {
  HIGH_PERFORMANCE: "Alto performance",
  D_GT_16_FCA_GT_1_5_C_LT_2: "D>16 FCA>1.5 C<2",
  D_LT_16_FCA_LT_1_5_C_GT_2: "D<16 FCA<1.5 C>2",
  D_LT_16_FCA_LT_1_5_C_LT_2: "D<16 FCA<1.5 C<2",
};

Object.freeze(DataSourceEnum);

/**
 * General Data
 */

/** @type {number} - Pond number */
const pondNumber = 8;

/** @type {number} - Size of the pond in hectares */
const hectares = 6;

/**
 * Seeding Data
 */

/** @type {string} - Seeding date in format mm/dd/yyyy */
const seedingDate = "03/03/2025";

/** @type {number} - Total density per hectare at seeding */
const totalDensityPerHectare = 110200;

/** @type {number} - Initial weight of shrimp in grams at seeding */
const initialWeightGrams = 1.02;

/** @type {number} - Initial weekly weight increase of shrimp in grams */
const weeklyWeightIncreaseInitial = 2.5;

/** @type {number} - Weekly weight increase of shrimp in grams */
const weeklyWeightIncrease = 3.5;

/** @type {number} - Survival percentage at seeding (%) */
const seedingSurvivalPercentage = 100;

/** @type {number} - Weight of acoustic in grams */
const acousticWeight = 4;

/** @type {number} - Total animals in the pond */
const totalAnimalsInPond = calculateTotalAnimalsInPond(
  hectares,
  totalDensityPerHectare
);

/** @type {string} - Day of shrimp weighing */
const weighingDay = WeekdayEnum.MONDAY;

/** @type {string} - Acoustic presence */
const acousticPresence = AcousticEnum.YES;

/** @type {number} - Daily weight increase of shrimp in grams (initial) */
const dailyWeightIncreaseInitial = calculateDailyWeightIncrease(
  weeklyWeightIncreaseInitial
);

/** @type {number} - Daily weight increase of shrimp in grams (real) */
const dailyWeightIncreaseReal =
  calculateDailyWeightIncrease(weeklyWeightIncrease);

/**
 * Harvest Data
 */

/** @type {number} - Number of days until harvest */
const daysToHarvest = 70;

/** @type {number} - Target weight in grams at harvest */
const targetWeight = 28;

/** @type {number} - Survival percentage at harvest (%) */
const harvestSurvivalPercentage = 65;

/** @type {number} - FCA objective */
const fcaObjective = 1.5;

/** @type {string} - Data source */
const dataSource = DataSourceEnum.HIGH_PERFORMANCE;

/** @type {string} - Harvest date in format mm/dd/yyyy */
const harvestDate = calculateHarvestDate(seedingDate, daysToHarvest);

/**
 * Body Weight (BW) Data
 */

const shrimpWeight = [
  0.01, 1.0, 2.0, 3.0, 4.0, 5.0, 6.0, 7.0, 8.0, 9.0, 10.0, 11.0, 12.0, 13.0,
  14.0, 15.0, 16.0, 17.0, 18.0, 19.0, 20.0, 21.0, 22.0, 23.0, 24.0, 25.0, 26.0,
  27.0, 28.0, 29.0, 30.0, 31.0, 32.0, 33.0, 34.0, 35.0, 36.0, 37.0, 38.0, 39.0,
  40.0,
];

// D>16 FCA>1.5 C<2
const D_GT_16_FCA_GT_1_5_C_LT_2 = [
  12, 11.12, 9.48, 8.52, 7.84, 7.31, 6.88, 6.51, 6.19, 5.92, 5.67, 5.44, 4.94,
  4.63, 4.36, 4.13, 3.92, 3.73, 3.56, 3.41, 3.27, 3.15, 3.03, 2.93, 2.83, 2.74,
  2.65, 2.57, 2.5, 2.43, 2.36, 2.3, 2.24, 2.19, 2.14, 2.09, 2.08, 2.08, 2.08,
  2.08, 2.08,
];

// D<16 FCA<1.5 C>2
const D_LT_16_FCA_LT_1_5_C_GT_2 = [
  12, 11, 9, 8.5, 8, 7, 6.5, 6, 5.5, 5, 4.6, 4.13, 3.99, 3.86, 3.74, 3.62, 3.52,
  3.42, 3.33, 3.24, 3.15, 3.07, 3, 2.92, 2.85, 2.79, 2.72, 2.66, 2.6, 2.55,
  2.49, 2.44, 2.38, 2.33, 2.28, 2.24, 2.23, 2.23, 2.23, 2.23, 2.23,
];

// D<16 FCA<1.5 C<2
const D_LT_16_FCA_LT_1_5_C_LT_2 = [
  12, 10.94, 8.36, 7.3, 6.86, 6.68, 6.61, 6.31, 5.94, 5.59, 5.28, 4.98, 4.71,
  4.46, 4.23, 4.02, 3.82, 3.64, 3.47, 3.31, 3.17, 3.03, 2.91, 2.8, 2.69, 2.59,
  2.5, 2.42, 2.34, 2.27, 2.21, 2.15, 2.09, 2.04, 1.99, 1.95, 1.94, 1.94, 1.94,
  1.94, 1.94,
];

/**
 * Average 100k Curve
 */

const average_100k_curve = [
  7, 17, 25, 33, 40, 46, 50, 54, 58, 62, 65, 67, 70, 72, 74, 76, 77, 78, 79, 80,
];

/**
 * Functions
 */

/**
 * Calculates the total number of animals in the pond based on hectares and total density per hectare.
 * @param {number} hectares - Size of the pond in hectares
 * @param {number} totalDensityPerHectare - Total density per hectare at seeding
 * @returns {number} - Total number of animals in the pond
 */
function calculateTotalAnimalsInPond(hectares, totalDensityPerHectare) {
  if (
    hectares === "" ||
    hectares === 0 ||
    totalDensityPerHectare === "" ||
    totalDensityPerHectare === 0
  ) {
    return 0;
  }
  return hectares * totalDensityPerHectare;
}

// /**
//  * Calculates the daily weight increase of shrimp in grams.
//  * @param {number} weeklyWeightIncrease - Weekly weight increase of shrimp in grams
//  * @returns {number} - Daily weight increase of shrimp in grams, rounded to two decimal places
//  */
// function calculateDailyWeightIncrease(weeklyWeightIncrease) {
//   if (weeklyWeightIncrease === "" || weeklyWeightIncrease === 0) {
//     return 0;
//   }
//   return Math.round((weeklyWeightIncrease / 7) * 100) / 100;
// }

/**
 * Calculates the daily weight increase of shrimp in grams.
 * @param {number} weeklyWeightIncrease - Weekly weight increase of shrimp in grams
 * @returns {number} - Daily weight increase of shrimp in grams, rounded to two decimal places
 */
function calculateDailyWeightIncrease(weeklyWeightIncrease) {
  if (weeklyWeightIncrease === "" || weeklyWeightIncrease === 0) {
    return 0;
  }
  return Math.trunc((weeklyWeightIncrease / 7) * 100) / 100;
}

/**
 * Calculates the harvest date based on the seeding date and number of days until harvest.
 * @param {string} seedingDate - Seeding date in format mm/dd/yyyy
 * @param {number} daysToHarvest - Number of days until harvest
 * @returns {string} - Harvest date in format mm/dd/yyyy
 */
function calculateHarvestDate(seedingDate, daysToHarvest) {
  if (seedingDate === "" || daysToHarvest === 0) {
    return "";
  }

  const [month, day, year] = seedingDate.split("/").map(Number);
  const seedingDateObj = new Date(year, month - 1, day);
  seedingDateObj.setDate(seedingDateObj.getDate() + daysToHarvest);

  const harvestMonth = String(seedingDateObj.getMonth() + 1).padStart(2, "0");
  const harvestDay = String(seedingDateObj.getDate()).padStart(2, "0");
  const harvestYear = seedingDateObj.getFullYear();

  return `${harvestMonth}/${harvestDay}/${harvestYear}`;
}

// /**
//  * Calculates the weight of shrimp in grams for a given day.
//  * @param {number} initialWeight - Initial weight of shrimp in grams
//  * @param {number} dailyIncrease - Daily weight increase of shrimp in grams
//  * @param {number} day - Day number starting from 0 (0 = initial day)
//  * @returns {number} - Weight of shrimp in grams for the given day
//  */
// function calculateWeightAtDay(initialWeight, dailyIncrease, day) {
//   if (
//     initialWeight === "" ||
//     initialWeight === 0 ||
//     dailyIncrease === "" ||
//     dailyIncrease === 0
//   ) {
//     return 0;
//   }
//   return Math.round((initialWeight + dailyIncrease * day) * 100) / 100;
// }

/**
 * Calculates the weight of shrimp in grams for a given day.
 * @param {number} initialWeight - Initial weight of shrimp in grams
 * @param {number} dailyIncrease - Daily weight increase of shrimp in grams
 * @param {number} day - Day number starting from 0 (0 = initial day)
 * @returns {number} - Weight of shrimp in grams for the given day
 */
function calculateWeightAtDay(initialWeight, dailyIncrease, day) {
  if (
    initialWeight === "" ||
    initialWeight === 0 ||
    dailyIncrease === "" ||
    dailyIncrease === 0
  ) {
    return 0;
  }
  return Math.trunc((initialWeight + dailyIncrease * day) * 100) / 100;
}

/**
 * Calculates the daily growth of shrimp in grams.
 * @param {number} currentWeight - Weight of shrimp in grams for the current day
 * @param {number} previousWeight - Weight of shrimp in grams for the previous day
 * @returns {number} - Daily growth of shrimp in grams
 */
function calculateDailyGrowth(currentWeight, previousWeight) {
  if (
    currentWeight === "" ||
    currentWeight === 0 ||
    previousWeight === "" ||
    previousWeight === 0
  ) {
    return 0;
  }
  return Math.round((currentWeight - previousWeight) * 100) / 100;
}

/**
 * Calculates the weekly growth of shrimp in grams.
 * @param {number} currentWeight - Weight of shrimp in grams for the current day
 * @param {number} previousWeight - Weight of shrimp in grams for the day one week ago
 * @returns {number} - Weekly growth of shrimp in grams, rounded to two decimal places
 */
function calculateWeeklyGrowth(currentWeight, previousWeight) {
  if (
    currentWeight === "" ||
    currentWeight === 0 ||
    previousWeight === "" ||
    previousWeight === 0
  ) {
    return 0;
  }
  return Math.round((currentWeight - previousWeight) * 100) / 100;
}

/**
 * Calculates the linear growth of shrimp in grams.
 * @param {number} currentWeight - Weight of shrimp in grams for the current day
 * @param {number} initialWeight - Initial weight of shrimp in grams
 * @param {number} day - Day number starting from 1 (1 = first day)
 * @returns {number} - Linear growth of shrimp in grams, rounded to two decimal places
 */
function calculateLinearGrowth(currentWeight, initialWeight, day) {
  if (
    currentWeight === "" ||
    currentWeight === 0 ||
    initialWeight === "" ||
    initialWeight === 0 ||
    day === "" ||
    day === 0
  ) {
    return 0;
  }
  return Math.round(((currentWeight - initialWeight) / day) * 100) / 100;
}

// /**
//  * Calculates the survival percentage for a given day.
//  * @param {number} previousSurvival - Survival percentage of the previous day
//  * @returns {number} - Survival percentage for the current day, rounded to two decimal places
//  */
// function calculateSurvivalPercentage(previousSurvival) {
//   if (previousSurvival === "" || previousSurvival === 0) {
//     return 0;
//   }
//   const decrement = 0.29;
//   return Math.trunc((previousSurvival - decrement) * 10) / 10;
// }

/**
 * Calculates the survival percentage for a given day.
 * @param {number} previousSurvival - Survival percentage of the previous day
 * @returns {number} - Survival percentage for the current day, rounded to two decimal places
 */
function calculateSurvivalPercentage(previousSurvival) {
  if (previousSurvival === "" || previousSurvival === 0) {
    return 0;
  }
  const decrementRate = 0.0029; // 0.29%
  const newSurvival = previousSurvival * (1 - decrementRate);
  return parseFloat(newSurvival.toFixed(1)); // Redondear a dos decimales
}

/**
 * Calculates the density by pond for a given day.
 * @param {number} survivalPercentage - Survival percentage of the current day
 * @param {number} totalAnimals - Total animals in the pond
 * @returns {number} - Density by pond, rounded to two decimal places
 */
function calculateDensityByPond(survivalPercentage, totalAnimals) {
  if (
    survivalPercentage === "" ||
    survivalPercentage === 0 ||
    totalAnimals === "" ||
    totalAnimals === 0
  ) {
    return 0;
  }
  return Math.round((survivalPercentage / 100) * totalAnimals * 100) / 100;
}

/**
 * Calculates the density per hectare for a given day.
 * @param {number} survivalPercentage - Survival percentage of the current day
 * @param {number} totalDensity - Total density per hectare at seeding
 * @returns {number} - Density per hectare, rounded to two decimal places
 */
function calculateDensityPerHectare(survivalPercentage, totalDensity) {
  if (
    survivalPercentage === "" ||
    survivalPercentage === 0 ||
    totalDensity === "" ||
    totalDensity === 0
  ) {
    return 0;
  }
  return Math.round((survivalPercentage / 100) * totalDensity * 100) / 100;
}

/**
 * Calculates the density per square meter for a given day.
 * @param {number} densityPerHectare - Density per hectare of the current day
 * @returns {number} - Density per square meter, rounded to two decimal places
 */
function calculateDensityPerSquareMeter(densityPerHectare) {
  if (densityPerHectare === "" || densityPerHectare === 0) {
    return 0;
  }
  return Math.round((densityPerHectare / 10000) * 10) / 10;
}

/**
 * Calculates the biomass per hectare for a given day.
 * @param {number} densityPerHectare - Density per hectare of the current day
 * @param {number} weight - Weight of shrimp in grams for the current day
 * @returns {number} - Biomass per hectare, rounded to two decimal places
 */
function calculateBiomassPerHectareKg(densityPerHectare, weight) {
  if (
    densityPerHectare === "" ||
    densityPerHectare === 0 ||
    weight === "" ||
    weight === 0
  ) {
    return 0;
  }
  return Math.round((densityPerHectare * weight) / 1000);
}

/**
 * Calculates the biomass per hectare in pounds.
 * @param {number|string} biomassPerHectareKg - Biomass per hectare value in kg
 * @returns {number|string} - Biomass per hectare in pounds or an empty string if input is invalid
 */
function calculateBiomassPerHectareLbs(biomassPerHectareKg) {
  if (biomassPerHectareKg === "") {
    return 0;
  }

  return Math.round(biomassPerHectareKg * 2.20462);
}

/**
 * Calculates the biomass per pond for a given day.
 * @param {number} biomassPerHectare - Biomass per hectare of the current day
 * @param {number} hectares - Size of the pond in hectares
 * @returns {number} - Biomass per pond, rounded to two decimal places
 */
function calculateBiomassPerPondKg(biomassPerHectare, hectares) {
  if (
    biomassPerHectare === "" ||
    biomassPerHectare === 0 ||
    hectares === "" ||
    hectares === 0
  ) {
    return 0;
  }
  return Math.round(biomassPerHectare * hectares);
}

/**
 * Calculates the biomass per pond in pounds.
 * @param {number|string} biomassPerPond - Biomass per pond value in kg
 * @returns {number|string} - Biomass per pond in pounds or an empty string if input is invalid
 */
function calculateBiomassPerPondLbs(biomassPerPond) {
  if (biomassPerPond === "") {
    return 0;
  }

  return Math.round(biomassPerPond * 2.20462);
}

/**
 * Calculates the %BW High Performance for a given shrimp weight.
 * @param {number} weight - Weight of shrimp in grams
 * @returns {number} - %BW, rounded to nine decimal places
 */
function calculateBWPercentageHP(weight) {
  if (weight === "" || weight === 0) {
    return 0;
  }
  let bwPercentage;
  if (weight < 8.5) {
    bwPercentage =
      4.11732527 +
      weight * 0.02544298 +
      4.8773194 * Math.exp(-0.37936805 * weight);
  } else {
    bwPercentage = 8.05766767 - 1.63709981 * Math.log(weight);
  }
  return parseFloat(bwPercentage.toFixed(9));
}

/**
 * Gets the %BW value for a given shrimp weight and data source.
 * @param {number} weight - Weight of shrimp in grams
 * @param {string} dataSource - Data source type
 * @returns {number} - %BW value
 */
function getBWValue(weight, dataSource) {
  if (weight === "" || weight === 0) {
    return 0;
  }

  // Find the index of the closest smaller or equal weight in shrimpWeight
  let index = shrimpWeight.findIndex((w) => w > weight);
  if (index === -1) {
    index = shrimpWeight.length - 1;
  } else if (index > 0) {
    index -= 1;
  }

  // Get the corresponding %BW value based on the data source
  switch (dataSource) {
    case DataSourceEnum.HIGH_PERFORMANCE:
      return calculateBWPercentageHP(weight);
    case DataSourceEnum.D_GT_16_FCA_GT_1_5_C_LT_2:
      return D_GT_16_FCA_GT_1_5_C_LT_2[index];
    case DataSourceEnum.D_LT_16_FCA_LT_1_5_C_GT_2:
      return D_LT_16_FCA_LT_1_5_C_GT_2[index];
    case DataSourceEnum.D_LT_16_FCA_LT_1_5_C_LT_2:
      return D_LT_16_FCA_LT_1_5_C_LT_2[index];
    default:
      return 0;
  }
}

/**
 * Gets the average curve 100k value for a given shrimp weight.
 * @param {number} weight - Weight of shrimp in grams
 * @returns {number} - Average curve 100k value
 */
function getAverageCurve100k(weight) {
  if (weight === "" || weight === 0) {
    return 0;
  }

  if (weight <= 2.09) {
    return 7;
  } else if (weight <= 4.09) {
    return 17;
  } else if (weight <= 6.09) {
    return 25;
  } else if (weight <= 8.09) {
    return 33;
  } else if (weight <= 10.09) {
    return 40;
  } else if (weight <= 12.09) {
    return 46;
  } else if (weight <= 14.09) {
    return 50;
  } else if (weight <= 16.09) {
    return 54;
  } else if (weight <= 18.09) {
    return 58;
  } else if (weight <= 20.09) {
    return 62;
  } else if (weight <= 22.09) {
    return 65;
  } else if (weight <= 24.09) {
    return 67;
  } else if (weight <= 26.09) {
    return 70;
  } else if (weight <= 28.09) {
    return 72;
  } else if (weight <= 30.09) {
    return 74;
  } else if (weight <= 32.09) {
    return 76;
  } else if (weight <= 34.09) {
    return 77;
  } else if (weight <= 36.09) {
    return 78;
  } else if (weight <= 38.09) {
    return 79;
  } else if (weight <= 40.09) {
    return 80;
  } else {
    return 0;
  }
}

/**
 * Calculates the food per day in kg per hectare for a given row.
 * @param {number|string} biomassPerHectare - Biomass per hectare value
 * @param {number|string} bodyWeightPercentage - Body weight percentage
 * @returns {number|string} - Food per day in kg per hectare or an empty string if input is invalid
 */
function calculateFoodPerDayPerHectare(
  biomassPerHectare,
  bodyWeightPercentage
) {
  if (
    biomassPerHectare === "" ||
    biomassPerHectare === 0 ||
    bodyWeightPercentage === "" ||
    bodyWeightPercentage === 0
  ) {
    return 0;
  }

  return Math.round((biomassPerHectare * bodyWeightPercentage) / 100);
}

/**
 * Calculates the food per day in kg per pond for a given row.
 * @param {number|string} foodPerDayPerHectare - Food per day in kg per hectare value
 * @param {number|string} hectares - Hectares value
 * @returns {number|string} - Food per day in kg per pond or an empty string if input is invalid
 */
function calculateFoodPerDayPerPond(foodPerDayPerHectare, hectares) {
  if (
    foodPerDayPerHectare === "" ||
    foodPerDayPerHectare === 0 ||
    hectares === "" ||
    hectares === 0
  ) {
    return 0;
  }

  return Math.round(foodPerDayPerHectare * hectares);
}

/**
 * Calculates the food per day in kg per pond based on curve 100k.
 * @param {number|string} densityByPond - Density by pond value
 * @param {number|string} averageCurve100k - Average curve 100k value
 * @returns {number|string} - Food per day in kg per pond based on curve 100k or an empty string if input is invalid
 */
function calculateFoodPerDayPerPondCurve100k(densityByPond, averageCurve100k) {
  if (
    densityByPond === "" ||
    densityByPond === 0 ||
    averageCurve100k === "" ||
    averageCurve100k === 0
  ) {
    return 0;
  }

  return Math.round((densityByPond / 100000) * averageCurve100k);
}

/**
 * Calculates the accumulated food per day in kg per pond
 * @param {number|string} previousAccumulatedFood - Previous accumulated food value
 * @param {number|string} foodPerDayPerPond - Food per day in kg per pond value
 * @param {boolean} isFirstIteration - Flag indicating if it's the first iteration
 * @returns {number} - Accumulated food per day in kg per pond
 */
function calculateAccumulatedFoodPerDayPerPond(
  previousAccumulatedFood,
  foodPerDayPerPond,
  isFirstIteration
) {
  if (foodPerDayPerPond === "" || foodPerDayPerPond === 0) {
    return 0;
  }

  if (isFirstIteration) {
    return Math.round(foodPerDayPerPond);
  }

  if (previousAccumulatedFood === "" || previousAccumulatedFood === 0) {
    return 0;
  }

  return Math.round(previousAccumulatedFood + foodPerDayPerPond);
}

/**
 * Calculates the accumulated food per day in kg per hectare.
 * @param {number|string} previousAccumulatedFood - Previous accumulated food value
 * @param {number|string} foodPerDayPerHectare - Food per day in kg per hectare value
 * @param {boolean} isFirstIteration - Flag indicating if it's the first iteration
 * @returns {number} - Accumulated food per day in kg per hectare or 0 if input is invalid
 */
function calculateAccumulatedFoodPerDayPerHectare(
  previousAccumulatedFood,
  foodPerDayPerHectare,
  isFirstIteration
) {
  if (foodPerDayPerHectare === "" || foodPerDayPerHectare === 0) {
    return 0;
  }

  if (isFirstIteration) {
    return Math.round(foodPerDayPerHectare);
  }

  if (previousAccumulatedFood === "" || previousAccumulatedFood === 0) {
    return 0;
  }

  return Math.round(previousAccumulatedFood + foodPerDayPerHectare);
}

/**
 * Calculates the Factor de Conversión de Alimento (FCA).
 * @param {number|string} accumulatedFoodPerDayPerPond - Accumulated food per day in kg per pond
 * @param {number|string} biomassPerPond - Biomass per day in kg per pond
 * @returns {number|string} - Factor de Conversión de Alimento (FCA) or an empty string if input is invalid
 */
function calculateFCA(accumulatedFoodPerDayPerPond, biomassPerPond) {
  if (
    accumulatedFoodPerDayPerPond === "" ||
    accumulatedFoodPerDayPerPond === 0 ||
    biomassPerPond === "" ||
    biomassPerPond === 0
  ) {
    return 0;
  }

  return (accumulatedFoodPerDayPerPond / biomassPerPond).toFixed(1);
}

/**
 * Calculates the percentage difference between two values.
 * @param {number|string} realWeight - Current value
 * @param {number|string} initialWeight - Base value
 * @returns {number|string} - Percentage difference or an empty string if input is invalid
 */
function calculateWeightPercentageDifference(realWeight, initialWeight) {
  if (
    realWeight === "" ||
    realWeight === 0 ||
    initialWeight === "" ||
    initialWeight === 0
  ) {
    return 0;
  }

  return ((realWeight / initialWeight - 1) * 100).toFixed(2);
}

/**
 * Calculates the percentage difference of FCA.
 * @param {number|string} initialFCA - Current FCA value
 * @param {number|string} realFCA - Base FCA value
 * @returns {number|string} - Percentage difference of FCA or an empty string if input is invalid
 */
function calculateFCAPercentageDifference(initialFCA, realFCA) {
  if (
    initialFCA === "" ||
    initialFCA === 0 ||
    realFCA === "" ||
    realFCA === 0
  ) {
    return 0;
  }

  return ((initialFCA / realFCA - 1) * 100).toFixed(2);
}

/**
 * Output
 */

console.log({
  pondNumber,
  hectares,
  seedingDate,
  totalDensityPerHectare,
  initialWeightGrams,
  weeklyWeightIncreaseInitial,
  weeklyWeightIncrease,
  seedingSurvivalPercentage,
  acousticWeight,
  totalAnimalsInPond,
  dailyWeightIncreaseInitial,
  dailyWeightIncreaseReal,
  weighingDay,
  acousticPresence,
  daysToHarvest,
  targetWeight,
  harvestSurvivalPercentage,
  harvestDate,
  fcaObjective,
  dataSource,
});

console.log("\n");

/////////////////////////////////////////////////////////////////////////////////////////////////
// Array to store daily weights
const dailyWeights = [];

// Calculate the weight for each day from day 0 to day 74 (75 days in total)
for (let day = 0; day < daysToHarvest; day++) {
  const weight = calculateWeightAtDay(
    initialWeightGrams,
    dailyWeightIncreaseInitial,
    day
  );
  dailyWeights.push(weight);
}

// Array to store daily growth in grams
const dailyGrowth = [];

// Calculate the daily growth for each day
for (let day = 1; day < daysToHarvest; day++) {
  const growth = calculateDailyGrowth(dailyWeights[day], dailyWeights[day - 1]);
  dailyGrowth.push(growth);
}

// The first daily growth value is left empty
dailyGrowth.unshift("");

// Array to store weekly growth in grams
// const weeklyGrowth = [];

// // Calculate weekly growth every 6 days, placing it on day 8 (index 7)
// for (let day = 6; day < daysToHarvest; day += 6) {
//   const growth = calculateWeeklyGrowth(
//     dailyWeights[day],
//     dailyWeights[day - 6]
//   );
//   weeklyGrowth.push({ day: day + 2, growth });
// }

// // Populate the final array with weekly growth values in the correct positions
// const finalWeeklyGrowth = Array(daysToHarvest).fill("");
// for (const entry of weeklyGrowth) {
//   finalWeeklyGrowth[entry.day] = entry.growth;
// }

// Array to store linear growth in grams
const linearGrowth = [];

// Calculate the linear growth for each day
for (let day = 1; day <= daysToHarvest; day++) {
  const growth = calculateLinearGrowth(
    dailyWeights[day - 1],
    initialWeightGrams,
    day
  );
  linearGrowth.push(growth);
}

// Array to store survival in percentage
const survivalPercentage = [];

// Initialize the first survival value with seedingSurvivalPercentage
survivalPercentage.push(seedingSurvivalPercentage);

// Calculate survival for each subsequent day
for (let day = 1; day < daysToHarvest; day++) {
  const previousSurvival = survivalPercentage[day - 1];
  const currentSurvival = calculateSurvivalPercentage(previousSurvival);
  survivalPercentage.push(currentSurvival);
}

// Array to store density per pond
const densityByPond = [];

// Calculate density per pond for each day
for (let day = 0; day < daysToHarvest; day++) {
  const survival = survivalPercentage[day];
  const density = calculateDensityByPond(survival, totalAnimalsInPond);
  densityByPond.push(density);
}

// Array to store density per hectare
const densityPerHectare = [];

// Calculate density per hectare for each day
for (let day = 0; day < daysToHarvest; day++) {
  const survival = survivalPercentage[day];
  const density = calculateDensityPerHectare(survival, totalDensityPerHectare);
  densityPerHectare.push(density);
}

// Array to store density per square meter
const densityPerSquareMeter = [];

// Calculate density per square meter for each day
for (let day = 0; day < daysToHarvest; day++) {
  const densityHectare = densityPerHectare[day];
  const densityM2 = calculateDensityPerSquareMeter(densityHectare);
  densityPerSquareMeter.push(densityM2);
}

// Array to store biomass per hectare
const biomassPerHectare = [];

// Calculate biomass per hectare for each day
for (let day = 0; day < daysToHarvest; day++) {
  const densityHectare = densityPerHectare[day];
  const weight = dailyWeights[day];
  const biomass = calculateBiomassPerHectareKg(densityHectare, weight);
  biomassPerHectare.push(biomass);
}

// Array to store biomass per pond
const biomassPerPond = [];

// Calculate biomass per pond for each day
for (let day = 0; day < daysToHarvest; day++) {
  const biomassHectare = biomassPerHectare[day];
  const biomassPond = calculateBiomassPerPondKg(biomassHectare, hectares);
  biomassPerPond.push(biomassPond);
}

const testWeights = [0.01, 1.49, 2.99, 4.49, 5.99, 7.49, 8.99, 10.49, 11.99];

// testWeights.forEach((weight) => {
//   const bwPercentage = calculateBWPercentageHP(weight);
//   console.log(`Weight: ${weight}, %BW: ${bwPercentage}`);
// });

// console.log("\n");

// const testWeight = 10.0;4
// const testWeight = 23.4;
// const testWeight = 0.5;
// const testWeight = 0.85;
// const testWeight = 1.2;
const testWeight = 3.3;

const bwHighPerformance = getBWValue(
  testWeight,
  DataSourceEnum.HIGH_PERFORMANCE
);
const bwD_GT_16_FCA_GT_1_5_C_LT_2 = getBWValue(
  testWeight,
  DataSourceEnum.D_GT_16_FCA_GT_1_5_C_LT_2
);
const bwD_LT_16_FCA_LT_1_5_C_GT_2 = getBWValue(
  testWeight,
  DataSourceEnum.D_LT_16_FCA_LT_1_5_C_GT_2
);
const bwD_LT_16_FCA_LT_1_5_C_LT_2 = getBWValue(
  testWeight,
  DataSourceEnum.D_LT_16_FCA_LT_1_5_C_LT_2
);

console.log("Daily Weights:", dailyWeights);
console.log("\nDaily Growth:", dailyGrowth);
// console.log("\nWeekly Growth:", finalWeeklyGrowth);
console.log("\nWeekly Growth:", calculateWeeklyGrowth(3.47, 1.02));
console.log("\nLinear Growth:", linearGrowth);
console.log("\nSurvival Percentage:", survivalPercentage);
console.log("\nDensity by Pond:", densityByPond);
console.log("\nDensity Per Hectare:", densityPerHectare);
console.log("\nDensity Per Square Meter:", densityPerSquareMeter);
console.log("\nBiomass Per Hectare in kg:", biomassPerHectare);
console.log("\nBiomass Per Pond in kg:", biomassPerPond);

console.log("\n");

console.log(
  `Weight: ${testWeight}, %BW (High Performance): ${bwHighPerformance}`
);
console.log(
  `Weight: ${testWeight}, %BW (D>16 FCA>1.5 C<2): ${bwD_GT_16_FCA_GT_1_5_C_LT_2}`
);
console.log(
  `Weight: ${testWeight}, %BW (D<16 FCA<1.5 C>2): ${bwD_LT_16_FCA_LT_1_5_C_GT_2}`
);
console.log(
  `Weight: ${testWeight}, %BW (D<16 FCA<1.5 C<2): ${bwD_LT_16_FCA_LT_1_5_C_LT_2}\n`
);

const testWeightsAverageCurve = [
  1.0, 2.09, 4.09, 6.09, 8.09, 10.09, 12.09, 14.09, 16.09, 18.09, 20.09, 22.09,
  24.09, 26.09, 28.09, 30.09, 32.09, 34.09, 36.09, 38.09, 40.09, 41.0,
];

testWeightsAverageCurve.forEach((weight) => {
  const avgCurve = getAverageCurve100k(weight);
  console.log(`Weight: ${weight}, Average Curve 100k: ${avgCurve}`);
});

console.log("\n");

const data = [
  { biomassPerHectare: 70, bodyWeightPercentage: 8.1646652242 },
  { biomassPerHectare: 119, bodyWeightPercentage: 7.6719007684 },
  { biomassPerHectare: 167, bodyWeightPercentage: 7.2415145247 },
  { biomassPerHectare: 215, bodyWeightPercentage: 6.8657503082 },
  { biomassPerHectare: 263, bodyWeightPercentage: 6.5378163479 },
  { biomassPerHectare: 310, bodyWeightPercentage: 6.2517653699 },
];

data.forEach((row, index) => {
  const foodPerDay = calculateFoodPerDayPerHectare(
    row.biomassPerHectare,
    row.bodyWeightPercentage
  );
  console.log(
    `Row ${index + 1}: Biomass Per Hectare: ${
      row.biomassPerHectare
    }, Body Weight Percentage: ${
      row.bodyWeightPercentage
    }, Food Per Day (kg/ha): ${foodPerDay}`
  );
});

console.log("\n");

const data2 = [
  { foodPerDayPerHectare: 6, hectares: 4.2 },
  { foodPerDayPerHectare: 9, hectares: 4.2 },
  { foodPerDayPerHectare: 12, hectares: 4.2 },
  { foodPerDayPerHectare: 15, hectares: 4.2 },
  { foodPerDayPerHectare: 17, hectares: 4.2 },
  { foodPerDayPerHectare: 19, hectares: 4.2 },
];

const hectares2 = 4.2;

data2.forEach((row, index) => {
  const foodPerDayPerPond = calculateFoodPerDayPerPond(
    row.foodPerDayPerHectare,
    row.hectares
  );
  console.log(
    `Row ${index + 1}: Food Per Day Per Hectare: ${
      row.foodPerDayPerHectare
    }, Hectares: ${hectares2}, Food Per Day Per Pond (kg/pond): ${foodPerDayPerPond}`
  );
});

console.log("\n");

const data3 = [
  { densityByPond: 588000, averageCurve100k: 7 },
  { densityByPond: 586294.8, averageCurve100k: 7 },
  { densityByPond: 584589.6, averageCurve100k: 7 },
  { densityByPond: 582884.4, averageCurve100k: 7 },
  { densityByPond: 581179.2, averageCurve100k: 7 },
  { densityByPond: 579474, averageCurve100k: 17 },
];

data3.forEach((row, index) => {
  const foodPerDayPerPondCurve100k = calculateFoodPerDayPerPondCurve100k(
    row.densityByPond,
    row.averageCurve100k
  );
  console.log(
    `Row ${index + 1}: Density By Pond: ${
      row.densityByPond
    }, Average Curve 100k: ${
      row.averageCurve100k
    }, Food Per Day Per Pond - Curve 100k (kg/pond): ${foodPerDayPerPondCurve100k}`
  );
});

console.log("\n");

const data4 = [
  { previousAccumulatedFood: 0, foodPerDayPerPond: 24 },
  { previousAccumulatedFood: 24, foodPerDayPerPond: 38 },
  { previousAccumulatedFood: 62, foodPerDayPerPond: 51 },
  { previousAccumulatedFood: 113, foodPerDayPerPond: 62 },
  { previousAccumulatedFood: 175, foodPerDayPerPond: 72 },
  { previousAccumulatedFood: 247, foodPerDayPerPond: 82 },
];

data4.forEach((row, index) => {
  const isFirstIteration = index === 0;
  const accumulatedFoodPerDayPerPond = calculateAccumulatedFoodPerDayPerPond(
    row.previousAccumulatedFood,
    row.foodPerDayPerPond,
    isFirstIteration
  );
  console.log(
    `Row ${index + 1}: Previous Accumulated Food: ${
      row.previousAccumulatedFood
    }, Food Per Day Per Pond: ${
      row.foodPerDayPerPond
    }, Accumulated Food Per Day Per Pond - Curve 100k (kg/pond): ${accumulatedFoodPerDayPerPond}`
  );
});

console.log("\n");

const data5 = [
  { previousAccumulatedFood: 0, foodPerDayPerHectare: 6 },
  { previousAccumulatedFood: 6, foodPerDayPerHectare: 9 },
  { previousAccumulatedFood: 15, foodPerDayPerHectare: 12 },
  { previousAccumulatedFood: 27, foodPerDayPerHectare: 15 },
  { previousAccumulatedFood: 42, foodPerDayPerHectare: 17 },
  { previousAccumulatedFood: 59, foodPerDayPerHectare: 19 },
];

data5.forEach((row, index) => {
  const isFirstIteration = index === 0;
  const accumulatedFoodPerDayPerHectare =
    calculateAccumulatedFoodPerDayPerHectare(
      row.previousAccumulatedFood,
      row.foodPerDayPerHectare,
      isFirstIteration
    );
  console.log(
    `Row ${index + 1}: Previous Accumulated Food: ${
      row.previousAccumulatedFood
    }, Food Per Day Per Hectare: ${
      row.foodPerDayPerHectare
    }, Accumulated Food Per Day Per Hectare (kg/ha): ${accumulatedFoodPerDayPerHectare}`
  );
});

console.log("\n");

const data6 = [
  { accumulatedFoodPerDayPerPond: 24, biomassPerPond: 294 },
  { accumulatedFoodPerDayPerPond: 62, biomassPerPond: 498 },
  { accumulatedFoodPerDayPerPond: 113, biomassPerPond: 702 },
  { accumulatedFoodPerDayPerPond: 175, biomassPerPond: 903 },
  { accumulatedFoodPerDayPerPond: 247, biomassPerPond: 1104 },
  { accumulatedFoodPerDayPerPond: 329, biomassPerPond: 1304 },
];

data6.forEach((row, index) => {
  const fca = calculateFCA(
    row.accumulatedFoodPerDayPerPond,
    row.biomassPerPond
  );
  console.log(
    `Row ${index + 1}: Accumulated Food Per Day Per Pond: ${
      row.accumulatedFoodPerDayPerPond
    }, Biomass Per Pond: ${row.biomassPerPond}, FCA: ${fca}`
  );
});

console.log("\n");

const data7 = [
  { currentValue: 0.5, baseValue: 0.5 },
  { currentValue: 0.85, baseValue: 0.85 },
  { currentValue: 1.2, baseValue: 1.2 },
  { currentValue: 1.55, baseValue: 1.55 },
  { currentValue: 1.9, baseValue: 1.9 },
  { currentValue: 2.25, baseValue: 2.25 },
];

data7.forEach((row, index) => {
  const percentageDifference = calculateWeightPercentageDifference(
    row.currentValue,
    row.baseValue
  );
  console.log(
    `Row ${index + 1}: Current Value: ${row.currentValue}, Base Value: ${
      row.baseValue
    }, % Diferencia: ${percentageDifference}`
  );
});

console.log("\n");

const data8 = [
  { currentFCA: 0.5, baseFCA: 0.5 },
  { currentFCA: 0.85, baseFCA: 0.5 },
  { currentFCA: 0.75, baseFCA: 0 },
  { currentFCA: 0, baseFCA: 0.5 },
  { currentFCA: "", baseFCA: 0.5 },
  { currentFCA: 1.2, baseFCA: 1.0 },
];

data8.forEach((row, index) => {
  const fcaPercentageDifference = calculateFCAPercentageDifference(
    row.currentFCA,
    row.baseFCA
  );
  console.log(
    `Row ${index + 1}: Current FCA: ${row.currentFCA}, Base FCA: ${
      row.baseFCA
    }, % Diferencia de FCA: ${fcaPercentageDifference}`
  );
});

console.log("\n");

const data9 = [
  { biomassPerPondInKg: 294 },
  { biomassPerPondInKg: 498 },
  { biomassPerPondInKg: 702 },
  { biomassPerPondInKg: 903 },
  { biomassPerPondInKg: 1104 },
  { biomassPerPondInKg: 1304 },
];

data9.forEach((row, index) => {
  const biomassPerPondLbs = calculateBiomassPerPondLbs(row.biomassPerPondInKg);
  console.log(`Row ${index + 1}: Biomass Per Pond (lbs): ${biomassPerPondLbs}`);
});

console.log("\n");

const data10 = [
  { biomassPerHectareKg: 70 },
  { biomassPerHectareKg: 119 },
  { biomassPerHectareKg: 167 },
  { biomassPerHectareKg: 215 },
  { biomassPerHectareKg: 263 },
  { biomassPerHectareKg: 310 },
];

data10.forEach((row, index) => {
  const biomassPerHectareLbs = calculateBiomassPerHectareLbs(
    row.biomassPerHectareKg
  );
  console.log(
    `Row ${index + 1}: Biomass Per Hectare (lbs): ${biomassPerHectareLbs}`
  );
});
