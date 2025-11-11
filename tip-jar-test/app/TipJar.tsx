import { useAccount, useWriteContract, useReadContract, useWaitForTransactionReceipt, UseWaitForTransactionReceiptReturnType} from 'wagmi';
import { parseEther, Address, isAddress } from 'viem';
import { sepolia } from 'viem/chains';
import { useState, useEffect } from 'react';
import { TIP_JAR_ABI, TIP_JAR_FACTORY_ABI } from './constants.js'
import { ConnectKitButton } from 'connectkit';

const DEFAULT_TIP_AMOUNT = '0.0003'; // Default tip amount in ETH, approx $1 USD
const DEFAULT_MESSAGE = "Here's a tip!"; // Default message
const FACTORY_ADDRESS = "0x3dabcEd4Ba74451D5E023A83A99AbAf956f7C529" // Address of Tip Jar Factory Contract

type TipJarProps = {
  CONTRACT_ADDRESS?: string | null;
};

const TipJar = ({ CONTRACT_ADDRESS }: TipJarProps) => {
    const [isDeploying, setIsDeploying] = useState(false);
    const [deployedAddress, setDeployedAddress] = useState<string | null>(null);

    const { address, isConnected } = useAccount();
    const [status, setStatus] = useState('Ready');

    const [isModalOpen, setIsModalOpen] = useState(false);
    const [amount, setAmount] = useState(DEFAULT_TIP_AMOUNT);
    const [nickname, setNickname] = useState('');
    const [message, setMessage] = useState(DEFAULT_MESSAGE);

    const openModal = () => setIsModalOpen(true);
    const closeModal = () => setIsModalOpen(false);

    // Transaction handling hooks
    const { writeContract, data: txHash, isPending, isSuccess, error } = useWriteContract();

    const handleDeploy = async () => {
        if (!isConnected) {
            setStatus("Please connect your wallet first.");
            return;
        }

        setIsDeploying(true);
        setStatus("Deploying TipJar...");
        try {
            writeContract({
                address: FACTORY_ADDRESS,
                abi: TIP_JAR_FACTORY_ABI,
                functionName: "createMyTipJar",
                chainId: sepolia.id,
            });

            if (!txHash) return;

            // Wait for confirmation
            const receipt = useWaitForTransactionReceipt({ hash: txHash });
            const log = receipt.data;
            console.log(log)
            console.log(receipt)
            if (!log) throw new Error("No TipJarCreated event found");

            // const newAddress = log?.data as Address;
            // if (newAddress) {
            //     setStatus("TipJar deployed!");
            //     setDeployedAddress(newAddress);
            // } else {
            //     setStatus("Deployment succeeded but couldn't read address from event.");
            // }
            // setIsDeploying(false);
        } catch (err) {
            console.error(err);
            setIsDeploying(false);
            setStatus("Deployment failed. See console for details.");
        }
    };

    const handleTip = () => {
        if (!isConnected) {
            setStatus('Please connect your wallet first.');
            closeModal();
            return;
        }

        setStatus("Sending tip...");
        closeModal();

        writeContract({
            address: CONTRACT_ADDRESS as Address,
            abi: TIP_JAR_ABI,
            functionName: 'tip',
            args: [message, nickname],
            value: parseEther(amount),
            chainId: sepolia.id,
        });
    };

    useEffect(() => {
        if (!isConnected) {
            setStatus("Please connect your wallet to get started.")
        } else {
            setStatus("Ready")
            if (isPending) setStatus("Waiting for wallet confirmation…");
            if (isSuccess) setStatus("Transaction successful! Thanks for supporting.");
            if (error) setStatus("Transaction failed. Try again.");
        }
    }, [isPending, isSuccess, error, isConnected]);

    // Get the owner from chain
    const { data: owner } = useReadContract({
        address: CONTRACT_ADDRESS as Address,
        abi: TIP_JAR_ABI,
        functionName: "owner",
        chainId: sepolia.id,
    });

    const ownerAddress = owner as string | undefined;
    // Compares contract owner to connected wallet address
    const isOwner = isConnected && ownerAddress?.toLowerCase() === address?.toLowerCase();

    // Withdraw function
    const handleWithdraw = () => {
        writeContract({
            address: CONTRACT_ADDRESS as Address,
            abi: TIP_JAR_ABI,
            functionName: 'withdraw',
            chainId: sepolia.id,
        });
    };

    if (!CONTRACT_ADDRESS || !isAddress(CONTRACT_ADDRESS)) {
        return (
            <div className="flex flex-col items-center gap-4 w-full p-4 max-w-sm bg-white/70 backdrop-blur-sm border rounded-xl shadow-sm">
                <h2 className="text-xl font-bold mb-2 text-black">Create Your Tip Jar</h2>
                <p className="text-gray-600">
                Deploy a new on-chain instance of your tip jar. Only costs gas.
                </p>
                <p className=" text-gray-600">Connect your wallet to get started!</p>
                {/* Button to conect wallet */}
                <div className="flex justify-center w-full mb-4">
                    <ConnectKitButton />
                </div>

                <button
                    className="px-4 py-2 bg-blue-500 text-white rounded cursor-pointer disabled:opacity-50"
                    disabled={isDeploying}
                    onClick={handleDeploy}
                >
                    {isDeploying ? "Deploying..." : "Deploy Tip Jar"}
                </button>
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
                {deployedAddress && (
                    <span>{deployedAddress}</span>
                )}
            </div>
        );
    }

    return (
        <div className="flex flex-col items-center gap-4 w-full p-4 max-w-sm bg-white/70 backdrop-blur-sm border rounded-xl shadow-sm">
            <div>
                <h2 className="text-lg font-semibold text-black">Support the Creator!</h2>
                <p className="text-sm text-gray-600 mb-4">
                    Send some ETH as a thank you!
                </p>

                {/* Button to conect wallet */}
                <div className="flex justify-center w-full mb-4">
                    <ConnectKitButton />
                </div>

                {/* Once connected to a wallet, a user can start tipping */}
                {/* If connected wallet is owner, user can withdraw */}
                {isConnected && 
                    <>  
                        {isOwner ? (
                            <button
                                onClick={handleWithdraw}
                                className="w-full py-2 mt-4 rounded-lg bg-emerald-500 text-white hover:bg-emerald-600"
                            >
                                {isPending ? "Withdrawing…" : "Withdraw Tips"}
                            </button>
                        ) :
                            <button
                                onClick={openModal}
                                disabled={isPending}
                                className={`w-full py-2 rounded-lg font-semibold text-white transition
                                ${isPending
                                    ? "bg-gray-400 cursor-not-allowed"
                                    : "bg-blue-500 hover:bg-blue-600 active:scale-[0.98]"}
                                `}
                            >
                                {isPending ? "Sending…" : "Send Tip"}
                            </button>
                        }    
                    </>
                }

                <p className="text-sm text-gray-700 mt-3">{status}</p>       

                {/* Modal to customize tip */}
                {isModalOpen && (
                    <div className="fixed inset-0 flex justify-center items-center z-50">
                        <div className="bg-white rounded-xl shadow-lg p-6 w-full max-w-md">
                            <h3 className="text-xl font-semibold mb-4 text-black">Send a Tip</h3>

                            <label className="block mb-2 text-sm font-medium text-gray-700">
                            Amount (ETH)
                            <input
                                type="number"
                                step="0.0001"
                                min="0"
                                value={amount}
                                onChange={(e) => setAmount(e.target.value)}
                                className="mt-1 block w-full p-2 border rounded-md"
                            />
                            </label>

                            <label className="block mb-2 text-sm font-medium text-gray-700">
                            Nickname (optional)
                            <input
                                type="text"
                                value={nickname}
                                onChange={(e) => setNickname(e.target.value)}
                                className="mt-1 block w-full p-2 border rounded-md"
                            />
                            </label>

                            <label className="block mb-2 text-sm font-medium text-gray-700">
                            Message
                            <input
                                type="text"
                                value={message}
                                onChange={(e) => setMessage(e.target.value)}
                                className="mt-1 block w-full p-2 border rounded-md"
                            />
                            </label>

                            <div className="mt-4 flex justify-end gap-2">
                            <button
                                onClick={closeModal}
                                className="px-4 py-2 rounded-lg border text-gray-700 hover:bg-gray-100"
                            >
                                Cancel
                            </button>
                            <button
                                onClick={handleTip}
                                className="px-4 py-2 rounded-lg bg-blue-500 text-white hover:bg-blue-600"
                            >
                                Send
                            </button>
                            </div>
                        </div>
                    </div>
                )}

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