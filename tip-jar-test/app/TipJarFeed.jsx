import { useEffect, useState } from "react";
import { usePublicClient } from "wagmi";
import { formatEther } from "viem";
import { TIP_JAR_ABI, CONTRACT_ADDRESS } from './constants.js'


const TipJarFeed = () => {
    const publicClient = usePublicClient();
    const [feed, setFeed] = useState([]);

    const fetchFeed = async () => {
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
    };

    useEffect(() => {
        fetchFeed();

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
      <ul className="space-y-4">
        {feed.map((tip, idx) => (
          <li
            key={idx}
            className="flex justify-between w-full items-start border rounded-lg p-4 hover:bg-gray-50 transition-colors"
          >
            <div className="flex flex-col items-start">
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
              <span>{parseFloat(formatEther(tip.amount)).toFixed(3)} ETH</span>
              <span>{formatTimestamp(tip.timestamp)}</span>
            </div>
          </li>
        ))}
      </ul>
    </div>
  );
}

export default TipJarFeed