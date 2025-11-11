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

    return (
        <div className="text-black">
            <ul>
                {feed.map((tip, idx) => (
                <li key={idx}>
                    <strong>{tip.nickname || `${tip.address.slice(0,6)}...`}</strong> tipped {parseFloat(formatEther(tip.amount)).toFixed(3)} ETH: "{tip.message}"
                </li>
                ))}
            </ul>
        </div>
    );
}

export default TipJarFeed