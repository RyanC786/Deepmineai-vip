/**
 * Price Feed Utility
 * Get real-time cryptocurrency prices
 */

/**
 * Get current ETH/USD price from CoinGecko API
 * Falls back to $3,500 if API fails
 */
export async function getEthPrice(): Promise<number> {
  try {
    const response = await fetch(
      'https://api.coingecko.com/api/v3/simple/price?ids=ethereum&vs_currencies=usd',
      {
        headers: {
          'Accept': 'application/json'
        }
      }
    )
    
    if (!response.ok) {
      throw new Error(`API returned ${response.status}`)
    }
    
    const data = await response.json()
    const price = data.ethereum?.usd
    
    if (!price || typeof price !== 'number') {
      throw new Error('Invalid price data')
    }
    
    console.log(`✅ ETH Price from CoinGecko: $${price}`)
    return price
    
  } catch (error) {
    console.error('❌ Failed to fetch ETH price from CoinGecko:', error)
    
    // Fallback: Try Binance API
    try {
      const response = await fetch('https://api.binance.com/api/v3/ticker/price?symbol=ETHUSDT')
      const data = await response.json()
      const price = parseFloat(data.price)
      
      if (price && !isNaN(price)) {
        console.log(`✅ ETH Price from Binance (fallback): $${price}`)
        return price
      }
    } catch (fallbackError) {
      console.error('❌ Binance fallback also failed:', fallbackError)
    }
    
    // Final fallback: Use approximate price
    const fallbackPrice = 3500
    console.warn(`⚠️ Using fallback ETH price: $${fallbackPrice}`)
    return fallbackPrice
  }
}

/**
 * Convert ETH amount to USD
 */
export function ethToUsd(ethAmount: number, ethPrice: number): number {
  return ethAmount * ethPrice
}

/**
 * Convert USD amount to ETH
 */
export function usdToEth(usdAmount: number, ethPrice: number): number {
  return usdAmount / ethPrice
}

/**
 * Format USD amount for display
 */
export function formatUsd(amount: number): string {
  return `$${amount.toFixed(2)}`
}

/**
 * Format ETH amount for display
 */
export function formatEth(amount: number): string {
  return `${amount.toFixed(6)} ETH`
}
