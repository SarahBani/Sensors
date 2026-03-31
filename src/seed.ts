import { SensorValuesRepository } from "./repositories/sensor_values_repository";
import { SensorsRepository } from "./repositories/sensors_repository";
import { Timestamp } from "./utils/types";

// Insert some dummy values to ease development
export const seed = () => {
  SensorsRepository.create({ name: "BedSense A" });
  SensorsRepository.create({ name: "BedSense B" });

  Promise.all(
    Array(10)
      .keys()
      .map((i) => {
        SensorValuesRepository.create({
          sensor_id: 1,
          timestamp: (Date.now() - i * 100) as Timestamp,
          values: [i, i, i],
        });
      }),
  );
};
