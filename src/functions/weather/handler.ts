import type { ValidatedEventAPIGatewayProxyEvent } from '@libs/api-gateway';
import { formatJSONResponse } from '@libs/api-gateway';
import { middyfy } from '@libs/lambda';

import schema from './schema';
import fetch from 'node-fetch';

const weather: ValidatedEventAPIGatewayProxyEvent<typeof schema> = async (event) => {
  const cityName=event.queryStringParameters?.cityname;
  if(!cityName){
    return formatJSONResponse({
      message:`Enter the cityname first`
    })
  }

  try{
    const apiKey=process.env.OPENWEATHER_API_KEY;
    const url=`https://api.openweathermap.org/data/2.5/weather?q=${cityName}&appid=${apiKey}&units=metric`;

    const res=await fetch(url);
    const data=await res.json();

    if(!data){
      return formatJSONResponse({
        message:`no city called ${cityName} found`
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

};

export const main = middyfy(weather);
