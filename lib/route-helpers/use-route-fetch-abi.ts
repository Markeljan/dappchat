// fetchAbi.ts

const fetchAbi = async (address: `0x${string}`) => {
  const response = await fetch('/api/fetch-abi', {
    method: 'POST',
    body: JSON.stringify({
      address: address
    })
  })

  if (!response.ok) {
    throw new Error(`Error fetching ABI: ${response.statusText}`)
  }

  const data = await response.json()
  return data
}

export default fetchAbi
