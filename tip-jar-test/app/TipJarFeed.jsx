import { useEffect, useState } from "react";
import { usePublicClient } from "wagmi";
import { formatEther } from "viem";
import { TIP_JAR_ABI, CONTRACT_ADDRESS } from './constants.js'


const TipJarFeed = () => {
    const publicClient = usePublicClient();
    const [feed, setFeed] = useState([]);
    const [loading, setLoading] = useState(true);

    const fetchFeed = async (showLoading = false) => {
        if (showLoading) setLoading(true);
        const [senders, amounts, messages, names, timestamps] = await publicClient.readContract({
            address: CONTRACT_ADDRESS,
            abi: TIP_JAR_ABI,
            functionName: "getTipHistory",
        });

        const data = senders.map((addr, i) => ({
            address: addr,
            nickname: names[i],
            amount: amounts[i],
            message: messages[i],
            timestamp: timestamps[i],
        }));

        // Sort by decsending timestamp
        data.sort((a, b) => {
            if (a.timestamp > b.timestamp) return -1;
            if (a.timestamp < b.timestamp) return 1;
            return 0;
        });
        setFeed(data);
        if (showLoading) setLoading(false);
    };

    useEffect(() => {
        fetchFeed(true);

        const interval = setInterval(() => fetchFeed(false), 5000);

        return () => clearInterval(interval);
    }, [publicClient]);

    const formatTimestamp = (ts) => {
        const now = Date.now();
        const date = new Date(Number(ts) * 1000); // seconds → ms
        const diff = now - date.getTime();

        const oneDay = 24 * 60 * 60 * 1000;

        // within last 24 hours
        if (diff < oneDay) {
            return date.toLocaleTimeString([], {
            hour: "numeric",
            minute: "2-digit"
            });
        }

        // older than 24 hours
        return date.toLocaleDateString([], {
            month: "2-digit",
            day: "2-digit",
            year: "2-digit"
        });
    };

    return (
    <div className="max-w-xl mx-auto bg-white shadow-lg rounded-lg p-6 mt-20">
      <h2 className="text-2xl font-semibold mb-4 border-b text-black pb-2">Feed</h2>
        {loading ? (
            <p className="text-center py-4 text-gray-700">Loading Feed...</p>
        ) : 
            <div>
                <ul className="space-y-4">
                {feed.map((tip, idx) => (
                <li
                    key={idx}
                    className="flex justify-between w-full items-start border rounded-lg p-4 hover:bg-gray-50 transition-colors"
                >
                    <div className="flex flex-col items-start text-left w-[70%]">
                        <span className="relative inline-block group font-semibold text-black">
                            <span className="inline group-hover:hidden">
                                {tip.nickname === "" ? `${tip.address.slice(0, 6)}...${tip.address.slice(-4)}` : tip.nickname}
                            </span>
                            <span className="hidden group-hover:inline text-gray-800">
                                {tip.address.slice(0, 6)}...{tip.address.slice(-4)}
                            </span>
                        </span>
                        <div className="text-gray-800 mb-1">{tip.message}</div>
                    </div>

                    <div className="flex flex-col h-[80] justify-between items-end text-sm text-gray-500">
                    <span>{parseFloat(formatEther(tip.amount)).toFixed(4)} ETH</span>
                    <span>{formatTimestamp(tip.timestamp)}</span>
                    </div>
                </li>
                ))}
            </ul>
            <button className="font-semibold text-gray-500 mt-10 cursor-pointer" onClick={() => fetchFeed(true)}>
                <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="size-6">
                    <path strokeLinecap="round" strokeLinejoin="round" d="M16.023 9.348h4.992v-.001M2.985 19.644v-4.992m0 0h4.992m-4.993 0 3.181 3.183a8.25 8.25 0 0 0 13.803-3.7M4.031 9.865a8.25 8.25 0 0 1 13.803-3.7l3.181 3.182m0-4.991v4.99" />
                </svg>
            </button>
            </div>
        }
    </div>
  );
}

export default TipJarFeed