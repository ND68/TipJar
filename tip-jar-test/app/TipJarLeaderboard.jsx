"use client";

import { useEffect, useState } from "react";
import { usePublicClient } from "wagmi";
import { formatEther } from "viem";
import { TIP_JAR_ABI, CONTRACT_ADDRESS } from './constants.js'

const TipJarLeaderboard = () => {
  const publicClient = usePublicClient();
  const [leaderboard, setLeaderboard] = useState([]);
  const [loading, setLoading] = useState(true);

  const fetchLeaderboard = async (showLoading = false) => {
    try {
        if (showLoading) setLoading(true);

        // Fetch all contributors and amounts
        const [addresses, amounts, names] = await publicClient.readContract({
            address: CONTRACT_ADDRESS,
            abi: TIP_JAR_ABI,
            functionName: "getContributors",
        });

        // 2️⃣ Map addresses and amounts into objects
        const data = addresses.map((addr, i) => ({
            address: addr,
            amount: amounts[i],
            name: names[i]
        }));

        // 3️⃣ Sort descending by amount
        data.sort((a, b) => (b.amount > a.amount ? 1 : -1));

        setLeaderboard(data);
    } catch (err) {
        console.error("Error fetching leaderboard:", err);
    } finally {
        if (showLoading) setLoading(false);
    }
  };

  useEffect(() => {
    fetchLeaderboard(true);
    
    const interval = setInterval(() => fetchLeaderboard(false), 5000);

    return () => clearInterval(interval);
  }, [publicClient]);

  return (
    <div className="p-4 rounded-lg w-full shadow-lg mx-auto text-black bg-white">
      <h2 className="text-2xl font-semibold mb-4 border-b text-black pb-2">Top Contributors</h2>
      {loading ? (
        <p className="text-center py-4">Loading leaderboard...</p>
      ) : leaderboard.length === 0 ? (
        <p className="text-center py-4">No tips yet!</p>
      ) : (
        <ul>
          {leaderboard.slice(0, 10).map(({ address, amount, name }, idx) => (
            <li
              key={address}
              className="py-2 px-3 flex justify-between border-b border-gray-300 rounded-xl"
            >
              <span className="relative inline-block group">
                <span className="inline group-hover:hidden">
                    {idx + 1}. {name === "" ? `${address.slice(0, 6)}...${address.slice(-4)}` : name}
                </span>
                <span className="hidden group-hover:inline text-gray-600">
                    {idx + 1}. {address.slice(0, 6)}...{address.slice(-4)}
                </span>
              </span>
              <span>{Number(formatEther(amount)).toFixed(3)} ETH</span>
            </li>
          ))}
        </ul>
      )}
      <button className="font-semibold text-gray-500 mt-10 cursor-pointer" onClick={() => fetchLeaderboard(true)}>
        <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="size-6">
            <path strokeLinecap="round" strokeLinejoin="round" d="M16.023 9.348h4.992v-.001M2.985 19.644v-4.992m0 0h4.992m-4.993 0 3.181 3.183a8.25 8.25 0 0 0 13.803-3.7M4.031 9.865a8.25 8.25 0 0 1 13.803-3.7l3.181 3.182m0-4.991v4.99" />
        </svg>
      </button>
    </div>
  );
}
export default TipJarLeaderboard;
