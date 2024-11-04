// Базовые интерфейсы для основных компонентов автомобиля
interface CarBody {
  type: "кабриолет" | "седан" | "внедорожник";
}

interface Engine {
  type: "бензиновый" | "дизельный" | "электрический";
}

interface Transmission {
  type: "автомат" | "механика";
}

// Общий интерфейс для авто
interface BaseCarStatus {
  engineStarted: boolean; // Состояние двигателя(запущен/выключен)
  speed: number; // Текущая скорость
  mileage: number; // Пробег
  temperature: number; // Температура двигателя
}

// Расширенный интерфейс для электромобилей
interface ElectricCarStatus extends BaseCarStatus {
  batteryLevel: number; // Уровень заряда в процентах
  batteryRange: number; // Запас хода на батарее в километрах
}

// Расширенный интерфейс для автомобилей с ДВС
interface FuelCarStatus extends BaseCarStatus {
  fuelLevel: number; // Уровень топлива в процентах
  fuelRange: number; // Запас хода на топливе в километрах
}

// Основной интерфейс, описывающий автомобиль
interface Car {
  uin: string; // Уникальный идентификационный номер
  model: string; // Модель автомобиля
  year: number; // Год выпуска
  body: CarBody; // Тип кузова
  engine: Engine; // Тип двигателя
  transmission: Transmission; // Тип трансмиссии
  status: ElectricCarStatus | FuelCarStatus; // Текущее состояние автомобиля
}

// Вспомогательная функция для определения типа автомобиля
function isElectricCar(
  status: ElectricCarStatus | FuelCarStatus
): status is ElectricCarStatus {
  return "batteryLevel" in status && "batteryRange" in status;
}

// Функции управления автомобилем
function getCarInfo(car: Car): void {
  console.log(`
    Автомобиль: ${car.model} (${car.year})
    UIN: ${car.uin}
    Тип кузова: ${car.body.type}
    Двигатель: ${car.engine.type}
    Трансмиссия: ${car.transmission.type}
  `);
}

function getCarStatus(car: Car): void {
  const { status } = car;

  console.log(`
    Статус автомобиля:
    ${
      isElectricCar(status)
        ? `Уровень заряда: ${status.batteryLevel}%
        Запас хода: ${status.batteryRange} км`
        : `Уровень топлива: ${status.fuelLevel}%
        Запас хода: ${status.fuelRange} км`
    }
    Двигатель: ${status.engineStarted ? "Запущен" : "Выключен"}
    Скорость: ${status.speed} км/ч
    Пробег: ${status.mileage} км
    Температура двигателя: ${status.temperature}°C
  `);
}

function startEngine(car: Car): Car {
  if (!car.status.engineStarted) {
    return {
      ...car,
      status: {
        ...car.status,
        engineStarted: true,
        temperature: 40, // При запуске температура поднимается до 40
      },
    };
  }
  console.log("Двигатель уже работает");
  return car;
}

function stopEngine(car: Car): Car {
  if (car.status.engineStarted) {
    return {
      ...car,
      status: {
        ...car.status,
        engineStarted: false,
        speed: 0, // При остановке двигателя скорость обнуляется
        temperature: 20, // Температура возвращается к начальной
      },
    };
  }
  console.log("Двигатель уже выключен");
  return car;
}

function updateSpeed(car: Car, newSpeed: number): Car {
  if (car.status.engineStarted) {
    return {
      ...car,
      status: {
        ...car.status,
        speed: newSpeed,
      },
    };
  }
  console.log("Невозможно изменить скорость: двигатель выключен");
  return car;
}

// создаем электрокар
const myElectricCar: Car = {
  uin: "CAR123",
  model: "Tesla Model S",
  year: 2023,
  body: { type: "седан" },
  engine: { type: "электрический" },
  transmission: { type: "автомат" },
  status: {
    batteryLevel: 80,
    batteryRange: 350,
    engineStarted: false,
    speed: 0,
    mileage: 1500,
    temperature: 20,
  },
};

// создаем автомобиль на топливе
const myFuelCar: Car = {
  uin: "CAR124",
  model: "BMW M5",
  year: 2023,
  body: { type: "седан" },
  engine: { type: "бензиновый" },
  transmission: { type: "автомат" },
  status: {
    fuelLevel: 75,
    fuelRange: 600,
    engineStarted: false,
    speed: 0,
    mileage: 2500,
    temperature: 20,
  },
};

console.log("ЭЛЕКТРОМОБИЛЬ");
getCarInfo(myElectricCar);
getCarStatus(myElectricCar);

console.log("АВТОМОБИЛЬ на топливе");
getCarInfo(myFuelCar);
getCarStatus(myFuelCar);

console.log(
  "Трогаемся с места, разгоняемся до 60 км/ч, а потом глушим двигатель"
);

let someCar = startEngine(myElectricCar);
someCar = updateSpeed(someCar, 60);
getCarStatus(someCar);
someCar = stopEngine(someCar);
getCarStatus(someCar);
