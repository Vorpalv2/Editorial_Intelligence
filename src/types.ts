export interface Summary {
  id: string;
  title: string;
  source: string;
  date: string;
  readTime: string;
  content: string;
  keyTakeaway: string;
  imageUrl?: string;
  type: 'Research' | 'Article' | 'Dev Log' | 'Podcast' | 'Forum';
  comments?: Array<{
    author: string;
    handle: string;
    role?: string;
    text: string;
    verified?: boolean;
  }>;
  engagement?: string;
}

export const MOCK_SUMMARIES: Summary[] = [
  {
    id: '1',
    title: 'New AI Breakthroughs: The dawn of localized LLMs on consumer hardware',
    source: 'r/ArtificialIntelligence',
    date: 'Oct 12, 2023',
    readTime: '4 min read',
    type: 'Forum',
    content: 'Recent developments in quantization techniques have enabled massive 70B parameter models to run efficiently on standard consumer GPUs. This marks a pivotal shift from cloud-dependent AI to truly private, edge-computed intelligence.',
    keyTakeaway: 'Privacy-focused AI is becoming the standard as local hardware bottlenecks are bypassed through novel software optimization.',
    engagement: '2.4k+',
    comments: [
      {
        author: 'NeuralPath',
        handle: 'u/NeuralPath',
        text: 'Finally, we can actually own the models we use. The implications for data sovereignty are massive.'
      },
      {
        author: 'HardwareHacker',
        handle: 'u/HardwareHacker',
        text: 'The speed of these 4-bit quantized versions is genuinely shocking on a laptop.'
      },
      {
        author: 'AIEthicist',
        handle: 'u/AIEthicist',
        text: 'This is the end of the subscription model for simple creative tasks. Local is the future.'
      }
    ]
  },
  {
    id: '2',
    title: 'SpaceX Launch Discussion: Starship Flight 4',
    source: 'r/SpaceX',
    date: 'Oct 12, 2023',
    readTime: '4 min read',
    type: 'Forum',
    imageUrl: 'https://picsum.photos/seed/rocket/800/600',
    content: 'The community analyzes the successful hot-staging maneuver and the unexpected tile loss during re-entry. Key consensus points include refined heat shield engineering and rapid reuse timelines.',
    keyTakeaway: 'Starship Flight 4 demonstrates significant progress in orbital recovery, though thermal protection remains the primary engineering hurdle.'
  },
  {
    id: '3',
    title: 'Best Coffee Machines 2024: Prosumer Edition',
    source: 'Article',
    date: 'Oct 11, 2023',
    readTime: '8 min read',
    type: 'Article',
    content: 'Comprehensive review of dual-boiler machines. Summary highlights the Rancilio Silvia Pro X as the best value for enthusiasts looking for commercial-grade stability at home.',
    keyTakeaway: 'The prosumer market is shifting towards PID-controlled dual boilers as the baseline for high-end home espresso.'
  },
  {
    id: '4',
    title: 'The Future of AI in Architecture',
    source: 'ArchDaily',
    date: 'Oct 10, 2023',
    readTime: '6 min read',
    type: 'Research',
    imageUrl: 'https://picsum.photos/seed/architecture/800/600',
    content: 'The integration of artificial intelligence in structural design marks a pivotal shift toward hyper-efficiency. Generative design algorithms are now capable of simulating millions of structural permutations, identifying the precise amount of material required for safety while minimizing environmental impact.',
    keyTakeaway: 'By analyzing stress patterns in real-time, AI reduces carbon-heavy waste by up to 40% in large-scale commercial developments.',
    comments: [
      {
        author: 'j_desmond',
        handle: '@j_desmond',
        role: 'Lead Architect',
        verified: true,
        text: "The reduction in structural waste isn't just theory. We've seen a 22% drop in rebar usage on our latest project using these exact models."
      },
      {
        author: 'sk_urban',
        handle: '@sk_urban',
        role: 'Urban Planner',
        text: "I wonder how this tech will integrate with zoning laws. AI can design faster than city councils can approve."
      }
    ]
  }
];
