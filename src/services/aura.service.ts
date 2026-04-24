import { fetchWeatherApi } from "openmeteo";
import chroma from "chroma-js";

export const calculateAura = async (baseHex: string = "#dea249") => {
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

  const clamp = (v: number, min: number, max: number) =>
    Math.min(Math.max(v, min), max);

  const normWeatherData = {
    temperature: clamp(weatherData.temperature, 0, 40) / 40,
    is_day: weatherData.is_day,
    precipitation: clamp(weatherData.precipitation, 0, 130) / 130,
    cloud_cover: weatherData.cloud_cover / 100,
  };

  let color;

  const TEMP_SWITCH = 15;
  if (weatherData.precipitation < 0.5) {
    if (weatherData.temperature >= TEMP_SWITCH) {
      const temperatureNormalized =
        (clamp(weatherData.temperature, TEMP_SWITCH, 40) - TEMP_SWITCH) /
        (40 - TEMP_SWITCH);
      color = chroma("orange");
      color = color.mix("red", temperatureNormalized * 0.6, "lch");
    } else {
      const temperatureNormalized =
        1 - clamp(weatherData.temperature, 0, TEMP_SWITCH) / TEMP_SWITCH; // 0-1
      color = chroma("lightblue");
      color = color.mix("blue", temperatureNormalized * 0.6, "lch");
    }
    color = color.desaturate(normWeatherData.cloud_cover * 2);
  } else {
    const colorScale = chroma.scale(["deepskyblue", "darkblue"]);
    color = colorScale(normWeatherData.precipitation);
  }

  const rgbColor = color.rgb();

  const resJson = {
    r: rgbColor[0],
    g: rgbColor[1],
    b: rgbColor[2],
  };

  const { r, g, b} = resJson;

  const bg = `\x1b[48;2;${r};${g};${b}m`;
  const reset = `\x1b[0m`;

  console.log("\n\n");
  console.log(bg);
  console.log();
  console.log(weatherData);
  console.log(reset);
  console.log();

  return resJson;
};

// const variants = [
//   chroma(baseHex),
//   color,
//   chroma("orange").mix("red", 1 * 0.6),
//   chroma("orange").mix("red", 0 * 0.6),
//   chroma("lightblue").mix("blue", 0 * 0.6),
//   chroma("lightblue").mix("blue", 1 * 0.6),
//   chroma("black"),
//   chroma("orange")
//     .mix("red", 1 * 0.6)
//     .desaturate(1),
//   chroma("orange")
//     .mix("red", 0 * 0.6)
//     .desaturate(1),
//   chroma("lightblue")
//     .mix("blue", 0 * 0.6)
//     .desaturate(1),
//   chroma("lightblue")
//     .mix("blue", 1 * 0.6)
//     .desaturate(1),
//   chroma("black"),
//   chroma("orange")
//     .mix("red", 1 * 0.6)
//     .desaturate(2),
//   chroma("orange")
//     .mix("red", 0 * 0.6)
//     .desaturate(2),
//   chroma("lightblue")
//     .mix("blue", 0 * 0.6)
//     .desaturate(2),
//   chroma("lightblue")
//     .mix("blue", 1 * 0.6)
//     .desaturate(2),
//   chroma("black"),
//   chroma("orange")
//     .mix("red", 1 * 0.6)
//     .desaturate(3),
//   chroma("orange")
//     .mix("red", 0 * 0.6)
//     .desaturate(3),
//   chroma("lightblue")
//     .mix("blue", 0 * 0.6)
//     .desaturate(3),
//   chroma("lightblue")
//     .mix("blue", 1 * 0.6)
//     .desaturate(3),
//   chroma("black"),

//   chroma("lightblue"),
//   chroma("powderblue"),
//   chroma("skyblue"),
//   chroma("deepskyblue"),
//   chroma("dodgerblue"),

//   chroma("blue"),
//   chroma("mediumblue"),
//   chroma("darkblue"),

//   chroma("black"),

//   chroma("deepskyblue"),
//   chroma("darkblue"),
// ];

// function bgRgb(r, g, b, text) {
//   return `\x1b[48;2;${r};${g};${b}m${text}\x1b[0m`;
// }

// variants.forEach((c, i) => {
//   const [r, g, b] = c.rgb();
//   console.log(bgRgb(r, g, b, `  variant ${i}  `), c.rgb());
// });
