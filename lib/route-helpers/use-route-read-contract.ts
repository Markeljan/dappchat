// readContract.ts
import { ReadContractRequestItem } from '@/lib/types';

const readContract = async (requests: ReadContractRequestItem[]) => {
  const response = await fetch('/api/read-contract', {
    method: 'POST',
    body: JSON.stringify({
      requests: requests
    })
  });

  if (!response.ok) {
    throw new Error(`Error reading contract: ${response.statusText}`);
  }

  const data = await response.json();
  return data;
};

export default readContract;