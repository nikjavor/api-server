import { fetchWeatherApi } from "openmeteo";
import chroma from "chroma-js";
import { clamp, coloredString } from "@/utils/helpers";

export const calculateAura = async (temp?: number) => {
  const params = {
    // latitude: 38.7167, // Lisbon
    // longitude: -9.1333, // Lisbon
    latitude: 46.0511, // Ljubljana
    longitude: 14.5051, // Ljubljana
    current: ["temperature_2m", "is_day", "precipitation", "cloud_cover"],
    past_days: 0,
    forecast_days: 1,
  };

  const url = "https://api.open-meteo.com/v1/forecast";
  const responses = await fetchWeatherApi(url, params);
  const response = responses[0];
  const current = response.current()!;

  // Note: The order of weather variables in the URL query and the indices below need to match!
  const weatherData = {
    temperature: current.variables(0)!.value(),
    is_day: current.variables(1)!.value(),
    precipitation: current.variables(2)!.value(),
    cloud_cover: current.variables(3)!.value(),
  };

  // const normWeatherData = {
  //   temperature: clamp(weatherData.temperature, 0, 40) / 40,
  //   is_day: weatherData.is_day,
  //   precipitation: clamp(weatherData.precipitation, 0, 130) / 130,
  //   cloud_cover: weatherData.cloud_cover / 100,
  // };

  // END OF FETCHING

  function getTemperatureColor(temperature: number) {
    const MIN_TEMP = -20;
    const MAX_TEMP = 40;
    const NEUTRAL_TEMP = 0; // between min and max

    temperature = clamp(temperature, MIN_TEMP, MAX_TEMP);

    // (-25, -50) ~ (0,0) ~ (50, 100) ~ (100, 100)

    const isHot = temperature >= NEUTRAL_TEMP;

    let a: number;
    let b: number;

    const range = Math.abs(NEUTRAL_TEMP - (isHot ? MAX_TEMP : MIN_TEMP));
    const amount = Math.abs(temperature - NEUTRAL_TEMP) / range;

    if (isHot) {
      // middle hot color is (L, 50, 100), final is (L, 100, 100)
      a = amount * 100;
      b = Math.min(amount * 200, 100);
    } else {
      // final cold color is (L, -25, -50)
      a = amount * -25;
      b = amount * -50;
    }

    return chroma.lab(70, a, b);
  }

  const temperature = temp ?? weatherData.temperature;
  const [r, g, b] = getTemperatureColor(temperature).rgb();

  console.log(coloredString(`Temperature: ${temperature}`, r, g, b));

  return {
    r: r,
    g: g,
    b: b,
  };
};
