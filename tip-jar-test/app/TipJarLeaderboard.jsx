"use client";

import { useEffect, useState } from "react";
import { usePublicClient } from "wagmi";
import { formatEther } from "viem";
import { TIP_JAR_ABI, CONTRACT_ADDRESS } from './constants.js'

const TipJarLeaderboard = () => {
  const publicClient = usePublicClient();
  const [leaderboard, setLeaderboard] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchLeaderboard = async () => {
      try {
        setLoading(true);

        // Fetch all contributors and amounts
        const [addresses, amounts] = await publicClient.readContract({
          address: CONTRACT_ADDRESS,
          abi: TIP_JAR_ABI,
          functionName: "getContributors",
        });

        // 2️⃣ Map addresses and amounts into objects
        const data = addresses.map((addr, i) => ({
          address: addr,
          amount: amounts[i],
        }));

        // 3️⃣ Sort descending by amount
        data.sort((a, b) => (b.amount > a.amount ? 1 : -1));

        setLeaderboard(data);
      } catch (err) {
        console.error("Error fetching leaderboard:", err);
      } finally {
        setLoading(false);
      }
    };

    fetchLeaderboard();
  }, [publicClient]);

  return (
    <div className="p-4 rounded-lg w-full mx-auto text-black">
      <h2 className="text-xl font-semibold mb-2 text-center">Top Contributors</h2>

      {loading ? (
        <p className="text-center py-4">Loading leaderboard...</p>
      ) : leaderboard.length === 0 ? (
        <p className="text-center py-4">No tips yet!</p>
      ) : (
        <ul>
          {leaderboard.map(({ address, amount }, idx) => (
            <li
              key={address}
              className="py-2 px-3 flex justify-between border-b border-gray-300 rounded-xl"
            >
              <span>
                {idx + 1}. {address.slice(0, 6)}...{address.slice(-4)}
              </span>
              <span>{Number(formatEther(amount)).toFixed(3)} ETH</span>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}
export default TipJarLeaderboard;
