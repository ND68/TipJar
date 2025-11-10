import { useAccount, useWriteContract } from 'wagmi';
import { parseEther, encodeFunctionData } from 'viem';
import { sepolia } from 'viem/chains';
import { useState } from 'react';
import { TIP_JAR_ABI, CONTRACT_ADDRESS } from './constants.js'

const TIP_AMOUNT = '0.002'; // Default tip amount in ETH
const MESSAGE = "Here's a tip!"; // Default message


const TipJarApp = () => {
    const { isConnected } = useAccount();
    const [status, setStatus] = useState('Ready to connect.');

    // Transaction handling hooks
    const { writeContract, data: txHash, isPending } = useWriteContract();

    const handleTip = () => {
        if (!isConnected) return setStatus('Connect wallet first.');

        writeContract({
        address: CONTRACT_ADDRESS,
        abi: TIP_JAR_ABI,
        functionName: 'tip',
        args: ["Here's a tip!"],
        value: parseEther('0.002'),
        chainId: sepolia.id,
        });
    };

    return (
        <div className="p-3">
            <button
                className="bg-blue-500 text-white px-4 py-2 rounded-lg"
                disabled={isPending}
                onClick={handleTip}
            >
                Send Tip
            </button>

            {txHash && (
                <p className="text-green-600 mt-2">
                Tx Submitted: {txHash}
                </p>
            )}
        </div>
    );
}

export default TipJarApp;