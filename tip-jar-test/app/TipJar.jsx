import { useAccount, useWriteContract } from 'wagmi';
import { parseEther, encodeFunctionData } from 'viem';
import { sepolia } from 'viem/chains';
import { useState, useEffect } from 'react';
import { TIP_JAR_ABI, CONTRACT_ADDRESS } from './constants.js'
import { ConnectKitButton } from 'connectkit';

const TIP_AMOUNT = '0.0003'; // Default tip amount in ETH, approx $1 USD
const MESSAGE = "Here's a tip!"; // Default message


const TipJar = () => {
    const { isConnected } = useAccount();
    const [status, setStatus] = useState('Ready');

    // Transaction handling hooks
    const { writeContract, data: txHash, isPending, isSuccess, error } = useWriteContract();

    const handleTip = () => {
        if (!isConnected) return setStatus('Please connect your wallet first.');

        setStatus("Sending tip...")

        writeContract({
        address: CONTRACT_ADDRESS,
        abi: TIP_JAR_ABI,
        functionName: 'tip',
        args: ["Here's a tip!", ""],
        value: parseEther('0.002'),
        chainId: sepolia.id,
        });
    };

    useEffect(() => {
        if (isPending) setStatus("Waiting for wallet confirmation…");
        if (isSuccess) setStatus("Tip sent! Thanks for supporting.");
        if (error) setStatus("Transaction failed. Try again.");
    }, [isPending, isSuccess, error]);

    return (
        <div className="flex flex-col items-center gap-4 w-full p-4 max-w-sm bg-white/70 backdrop-blur-sm border rounded-xl shadow-sm">
            <div>
                <h2 className="text-lg font-semibold text-black">Support the Creator!</h2>
                <p className="text-sm text-gray-600 mb-4">
                    Send some ETH as a thank you!
                </p>

                <div className="flex justify-center w-full mb-4">
                    <ConnectKitButton />
                </div>
                {isConnected && 
                    <>
                        <button
                            onClick={handleTip}
                            disabled={isPending}
                            className={`w-full py-2 rounded-lg font-semibold text-white transition
                            ${isPending
                                ? "bg-gray-400 cursor-not-allowed"
                                : "bg-blue-500 hover:bg-blue-600 active:scale-[0.98]"}
                            `}
                        >
                            {isPending ? "Sending…" : "Send Tip"}
                        </button>       
                        <p className="text-sm text-gray-700 mt-3">{status}</p>         
                    </>
                }

                {txHash && (
                    <a
                    className="text-green-700 underline text-sm mt-2 block"
                    href={`https://sepolia.etherscan.io/tx/${txHash}`}
                    target="_blank"
                    rel="noopener noreferrer"
                    >
                    View on Etherscan
                    </a>
                )}
            </div>
        </div>
    );
};

export default TipJar;