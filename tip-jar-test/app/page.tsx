"use client"

import { WagmiProvider, createConfig, http } from 'wagmi';
import { sepolia } from 'viem/chains';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { ConnectKitProvider, getDefaultConfig, ConnectKitButton } from 'connectkit';
import TipJar from './TipJar.jsx';

const transport = http('YOUR_INFURA_OR_ALCHEMY_URL');

// Creates link to an Ethereum node
const config = createConfig(
  getDefaultConfig({
    chains: [sepolia],
    transports: {
      [sepolia.id]: transport,
    },
    appName: "TipJar Widget",
    walletConnectProjectId: 'YOUR_WALLETCONNECT_PROJECT_ID',
  }),
);
const queryClient = new QueryClient();

export default function Home() {
  return (
    <div className="flex flex-col min-h-screen w-full items-center text-center bg-zinc-50 font-sans py-30 px-[20%]">
          <h1 className="text-5xl font-semibold leading-10 tracking-tight text-black p-10">
            The Great Hot Dog Debate: A Culinary Crisis of Cosmic Proportions
          </h1>
          <h2 className="text-2xl font-semibold leading-10 tracking-tight text-black">
            By Google Gemini
          </h2>
          <p className="text-xl text-black text-left py-5">
            The question of whether a hot dog qualifies as a sandwich is not merely a matter of semantics; it is a philosophical quandary, a rift in the fabric of reality, and a source of existential dread for dedicated snackers worldwide. To reduce this towering issue to a simple "yes" or "no" is to ignore the deep, churning waters of culinary classification. We stand at a crossroads, where the very integrity of the bread-and-filling paradigm is at stake. The traditionalists, clutching their dictionary definitions like sacred scrolls, insist that a sandwich requires two separate pieces of bread, demanding structural independence that the typical hinged hot dog bun simply does not provide. They view the connected bun as a culinary cheat, a monolithic housing unit that defies the democratic, dual-component spirit of the true sandwich.
          </p>
          <p className="text-xl text-black text-left py-5">
            However, the modernists, the free-thinkers of the food world, argue that the spirit of the sandwich is what truly matters. What is a sandwich, at its heart, but a conveyance for delicious fillings, shielded from the cruel world by a comforting embrace of starch? Whether that embrace is a full hug (two slices) or a continuous, supportive cradle (the hot dog bun) seems like a frivolous technicality. If a sub or a grinder, with its single, hinged loaf, earns sandwich status without question, then surely the humble hot dog deserves the same respect. To deny it is to engage in bun-based discrimination, a prejudice that has no place in a world striving for culinary equity.
          </p>
          <p className="text-xl text-black text-left py-5">
            Furthermore, the very concept of the "hot dog" is steeped in an almost mystical ambiguity. It is the food of ballparks, of summer cookouts, and of hastily assembled street-side meals. It transcends neat categorization, existing in a liminal space between formal meal and casual handheld treat. Perhaps we shouldn't attempt to force it into the rigid mold of the sandwich at all. To do so is to diminish its unique, singular identity. It’s like trying to categorize a unicorn as merely a horse with an aggressive head growth—it fundamentally misunderstands the magical essence of the thing. The hot dog is a culinary sovereign, a king of its own edible domain.
          </p>
          <p className="text-xl text-black text-left py-5">
            We must also consider the geopolitical ramifications of this debate. Entire regions, from the meticulous topping traditions of Chicago to the chili-laden philosophies of the South, have staked their cultural identities on the hot dog's unique nature. To declare it a mere sandwich is to erase decades of regional specificity, to crumble the foundations of local culinary pride. Imagine the outrage in New York if the classic "dirty water dog" was suddenly relegated to the generic category of a "sausage sandwich." The resulting uprising, a revolution fought with relish and kraut, would surely make the great Ketchup Wars of the early 21st century look like a polite disagreement over seating arrangements.
          </p>
          <p className="text-xl text-black text-left py-5">
            And what about the sheer physics of consumption? The hot dog bun is ergonomically designed for maximum filling retention and minimal spillage, a triumph of functional food engineering. The slight curve, the reinforced spine, the soft yet durable texture—it’s built for purpose. A standard sliced bread sandwich, by contrast, is a haphazard construction, prone to structural collapse under the slightest pressure from a moist filling. If superior engineering doesn't elevate a food item beyond the common classification, then what, truly, does? The hot dog is an evolved form, a post-sandwich entity, having shed the weaknesses of its primitive, two-slice ancestors.
          </p>
          <p className="text-xl text-black text-left py-5">
            The debate, therefore, is less about food and more about the human need for order. We crave clean boxes, sharp lines, and definitive answers. But the hot dog, in its cylindrical glory, refuses to be neatly filed away. It is the ultimate trickster food, mocking our attempts to categorize it. It forces us to confront the inherent fluid nature of language and definition. The moment we think we have pinned it down, it slips away, slathered in mustard, defying our intellectual grasp.
          </p>
          <p className="text-xl text-black text-left py-5">
            So, let the debate rage on. Let philosophers starve and grill masters argue until dawn. The hot dog, whether a sandwich or a separate masterpiece, remains a beloved fixture of the global culinary landscape. Perhaps the only honest answer is this: the hot dog is a hot dog, and attempting to define it by the limitations of a mere sandwich is an insult to its complexity, its majesty, and its incredible, slightly unsettling flavor.
          </p>
          <QueryClientProvider client={queryClient}>
            <WagmiProvider config={config}>
              <ConnectKitProvider>
                <div className=" bg-gray-100 p-4">
                  <header className="flex justify-center p-2 bg-white shadow-md rounded-lg">
                    <ConnectKitButton />
                  </header>
                  <TipJar /> 
                </div>
              </ConnectKitProvider>
            </WagmiProvider>
          </QueryClientProvider>
    </div>
  );
}
