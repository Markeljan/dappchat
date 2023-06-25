import fetchAbi from '@/lib/fetchAbi'
import * as React from 'react'
import {
    usePrepareContractWrite,
    useContractWrite,
    useWaitForTransaction,
} from 'wagmi'

interface TransactionButtonProps {
    address: `0x${string}`,
    functionName: string,
    functionArgs: string[],
}

const TransactionButton: React.FC<TransactionButtonProps> = async ({ address, functionName, functionArgs }) => {
    const { config } = usePrepareContractWrite({
        address: address,
        abi: await fetchAbi(address),
        functionName: 'mint',
    })
    const { data, write } = useContractWrite(config)

    const { isLoading, isSuccess } = useWaitForTransaction({
        hash: data?.hash,
    })

    return (
        <div>
            <button disabled={!write || isLoading} onClick={() => write && write()}>
                {isLoading ? 'Pending...' : 'Send Transaction'}
            </button>
            {isSuccess && (
                <div>
                    Transaction successful!
                    <div>
                        <a href={`https://gnosisscan.io/tx/${data?.hash}`}>Gnosis Scan</a>
                    </div>
                </div>
            )}
        </div>
    )
}

export default TransactionButton