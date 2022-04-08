import { useEffect, useState } from 'react'
import { requestAPICall } from '../../utils/helpers/apiService'

export const useGetPrice = () => {
  const [price, set_price] = useState(0)

  useEffect(() => {
    const fetchData = async () => {
      try {
        console.log(process.env);
        let price = await requestAPICall("https://api.coingecko.com/api/v3/simple/price?ids=dtravel&vs_currencies=usd");
        console.log("price", price.data.dtravel.usd);
        set_price(parseFloat(price.data.dtravel.usd));
      } catch (error) {
        console.error('Unable to fetch data:', error)
      }
    }

    fetchData()
  }, [set_price])

  return price
}
