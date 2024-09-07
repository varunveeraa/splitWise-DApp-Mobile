import { splitFactoryABI, contractAddress } from '@/function/splitFactroryExports';
import splitABI from '@/function/splitExports';
import { useReadContract } from 'wagmi';
import { Address } from 'viem';

export const readAmount = (arr: String[]) => {
    let x = [];
    for (let i = 0; i < arr.length; i++){
        let result = useReadContract({
          abi: splitABI,
          address: arr[i] as Address,
          functionName: "amount"
        })
        x.push(result);
    }
    return x;
}