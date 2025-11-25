import type { ValidatedEventAPIGatewayProxyEvent } from '@libs/api-gateway';
import { formatJSONResponse } from '@libs/api-gateway';
import { middyfy } from '@libs/lambda';

import schema from './schema';
import fetch from 'node-fetch';

const weather: ValidatedEventAPIGatewayProxyEvent<typeof schema> = async (event) => {
  const city=event.queryStringParameters?.city;
  if(!city){
    return formatJSONResponse({
      message:`Enter the cityname first`
    })
  }

  try{
    const apiKey=process.env.OPENWEATHER_API_KEY;
    const url=`https://api.openweathermap.org/data/2.5/weather?q=${city}&appid=${apiKey}&units=metric`;

    const res=await fetch(url);
    const data=await res.json();

    if(!data){
      return formatJSONResponse({
        message:`no city called ${city} found`
      })
    }

    return formatJSONResponse({
      data:data,
    });
  }
  catch(err:any){
    return formatJSONResponse({
      message:`error of fetching weather data`,
    })
  }

}

export const main = middyfy(weather);
