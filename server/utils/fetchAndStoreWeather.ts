import { $fetch } from "ofetch";

export async function fetchAndStoreWeather(
  gameId: number,
  client: ReturnType<
    typeof import("#supabase/server").serverSupabaseServiceRole
  >
) {
  const apiKey = "d85717bc84da32da0f42627effe2872c";

  if (!apiKey) {
    console.error("Missing OPENWEATHER_API_KEY");
    return;
  }

  function getStadiumWindDirectionText(deg: number): string {
    // Convert wind *from* deg to wind *to* deg
    const windTo = (deg + 180) % 360;

    if (windTo >= 67.5 && windTo < 112.5) return "Out to CF";
    if (windTo >= 112.5 && windTo < 157.5) return "Out to LF";
    if (windTo >= 22.5 && windTo < 67.5) return "Out to RF";
    if (windTo >= 247.5 && windTo < 292.5) return "In from CF";
    if (windTo >= 202.5 && windTo < 247.5) return "In from LF";
    if (windTo >= 292.5 && windTo < 337.5) return "In from RF";
    if (windTo >= 157.5 && windTo < 202.5) return "To 3B Line";
    if (windTo >= 337.5 || windTo < 22.5) return "To 1B Line";

    return "Variable"; // fallback, shouldn't happen
  }

  // Step 1: Fetch MLB game info
  let live;
  try {
    live = await $fetch(
      `https://statsapi.mlb.com/api/v1.1/game/${gameId}/feed/live`
    );
  } catch (err) {
    console.error(`Failed to fetch game data for ${gameId}`, err);
    return;
  }

  const venue = live?.gameData?.venue;
  const location = venue?.location;
  const gameDateTime = live?.gameData?.datetime?.dateTime;
  const coords = location?.defaultCoordinates;

  if (
    !venue ||
    !location ||
    !gameDateTime ||
    !coords?.latitude ||
    !coords?.longitude
  ) {
    console.warn(`Missing location or datetime info for game ${gameId}`);
    return;
  }

  const lat = coords.latitude;
  const lon = coords.longitude;
  const gameTimeUnix = Math.floor(new Date(gameDateTime).getTime() / 1000);

  // Step 2: Fetch forecast from OpenWeatherMap (3-hour intervals)
  let forecast;
  try {
    const res = await $fetch(
      `https://api.openweathermap.org/data/2.5/forecast`,
      {
        query: {
          lat,
          lon,
          appid: apiKey,
          units: "imperial",
        },
      }
    );

    forecast = res.list?.find((entry: any) => {
      const diff = Math.abs(entry.dt - gameTimeUnix);
      return diff <= 5400; // within 1.5 hours (3-hour interval max)
    });

    if (!forecast) {
      console.warn(`No matching forecast found for game ${gameId}`);
      return;
    }
  } catch (err) {
    console.error(`Failed to fetch 3-hour forecast for game ${gameId}`, err);
    return;
  }

  console.log(forecast);

  // Step 3: Store in Supabase
  const weatherData = {
    gameId,
    temperature: forecast.main?.temp ? Math.round(forecast.main.temp) : null,
    windSpeed: forecast.wind?.speed ? Math.round(forecast.wind?.speed) : null,
    windDirection: forecast.wind?.deg
      ? getStadiumWindDirectionText(forecast.wind.deg)
      : null,
    weatherCondition: forecast.weather?.[0]?.description || "",
    isIndoorStadium: venue.name.toLowerCase().includes("dome") || false,
  };

  try {
    const { error } = await client.from("environment").upsert(weatherData, {
      onConflict: "gameId",
    });
    console.log(error);
  } catch (err) {
    console.error(`Failed to upsert weather for game ${gameId}`, err);
  }
}
