import PatternCard from "@/components/PatternCard";

export const dynamic = "force-dynamic";

const patterns = [
  {
    pattern: "Hash Map / Hash Set",
    description: "Use a hash map for O(1) lookups. Store seen values, count frequencies, group elements.",
    signals: ["Find pair with target sum", "Check for duplicates", "Count frequencies", "Group by property"],
    topicSlug: "arrays-and-hashing",
    topicName: "Arrays & Hashing",
  },
  {
    pattern: "Two Pointers",
    description: "Two pointers moving toward each other or in the same direction on a sorted array.",
    signals: ["Sorted array", "Find pair/triplet", "Remove duplicates in-place", "Palindrome check"],
    topicSlug: "two-pointers",
    topicName: "Two Pointers",
  },
  {
    pattern: "Sliding Window",
    description: "Maintain a window over contiguous elements. Expand and shrink to find optimal subarrays.",
    signals: ["Maximum/minimum subarray", "Substring with constraint", "Contiguous elements", "Window of size k"],
    topicSlug: "sliding-window",
    topicName: "Sliding Window",
  },
  {
    pattern: "Binary Search",
    description: "Divide search space in half. Works on sorted arrays or monotonic functions.",
    signals: ["Sorted array", "Find target / boundary", "O(log n) required", "Search in rotated array"],
    topicSlug: "binary-search",
    topicName: "Binary Search",
  },
  {
    pattern: "Binary Search on Answer",
    description: "Search the answer space when feasibility is monotonic. Find the min/max that satisfies a condition.",
    signals: ["Minimize the maximum", "Maximize the minimum", "Smallest X such that...", "Capacity/speed problems"],
    topicSlug: "binary-search",
    topicName: "Binary Search",
  },
  {
    pattern: "Fast & Slow Pointers",
    description: "Two pointers at different speeds detect cycles and find middle elements in linked lists.",
    signals: ["Detect cycle", "Find middle of linked list", "Find duplicate number", "Linked list cycle start"],
    topicSlug: "linked-lists",
    topicName: "Linked Lists",
  },
  {
    pattern: "Linked List Reversal",
    description: "Reverse a linked list by manipulating next pointers with prev/curr/next.",
    signals: ["Reverse linked list", "Reverse between positions", "Palindrome linked list", "Reorder list"],
    topicSlug: "linked-lists",
    topicName: "Linked Lists",
  },
  {
    pattern: "Monotonic Stack",
    description: "Stack maintaining increasing/decreasing order. Great for next greater/smaller element.",
    signals: ["Next greater element", "Daily temperatures", "Stock span", "Largest rectangle in histogram"],
    topicSlug: "stacks-and-queues",
    topicName: "Stacks & Queues",
  },
  {
    pattern: "Stack (Matching/Parsing)",
    description: "Use a stack to match opening/closing pairs or validate nested structures.",
    signals: ["Valid parentheses", "Matching brackets", "Nested structures", "Expression evaluation"],
    topicSlug: "stacks-and-queues",
    topicName: "Stacks & Queues",
  },
  {
    pattern: "DFS (Recursive)",
    description: "Depth-first traversal using recursion. Process nodes in preorder, inorder, or postorder.",
    signals: ["Tree depth/height", "Path sum", "Validate BST", "Subtree problems", "Serialize tree"],
    topicSlug: "trees",
    topicName: "Trees",
  },
  {
    pattern: "BFS (Level Order)",
    description: "Breadth-first traversal using a queue. Process tree level by level.",
    signals: ["Level order traversal", "Right side view", "Minimum depth", "Zigzag order"],
    topicSlug: "trees",
    topicName: "Trees",
  },
  {
    pattern: "Trie",
    description: "Prefix tree for efficient string operations. O(m) insert and search per word.",
    signals: ["Prefix search", "Autocomplete", "Word dictionary", "Word search in grid"],
    topicSlug: "tries",
    topicName: "Tries",
  },
  {
    pattern: "Heap / Top-K",
    description: "Priority queue for efficient min/max access. Use for top-K and merge-K problems.",
    signals: ["Kth largest/smallest", "Top K frequent", "Merge K sorted lists", "Running median"],
    topicSlug: "heap-priority-queue",
    topicName: "Heap / Priority Queue",
  },
  {
    pattern: "Graph BFS",
    description: "BFS finds shortest path in unweighted graphs. Uses a queue for level-by-level exploration.",
    signals: ["Shortest path (unweighted)", "Minimum steps", "Word ladder", "Level-by-level"],
    topicSlug: "graphs",
    topicName: "Graphs",
  },
  {
    pattern: "Graph DFS",
    description: "DFS explores as deep as possible before backtracking. Good for connectivity and paths.",
    signals: ["Number of islands", "Connected components", "All paths A to B", "Clone graph"],
    topicSlug: "graphs",
    topicName: "Graphs",
  },
  {
    pattern: "Topological Sort",
    description: "Order nodes in a DAG so every edge goes earlier to later. BFS (Kahn's) or DFS approach.",
    signals: ["Course schedule", "Task ordering", "Build dependencies", "Prerequisite chain"],
    topicSlug: "graphs",
    topicName: "Graphs",
  },
  {
    pattern: "Backtracking",
    description: "Systematically explore all possibilities by making choices and undoing them.",
    signals: ["All combinations", "All permutations", "All subsets", "N-Queens", "Generate parentheses"],
    topicSlug: "backtracking",
    topicName: "Backtracking",
  },
  {
    pattern: "1D Dynamic Programming",
    description: "Build solution from subproblems along one dimension. Each state depends on previous states.",
    signals: ["Climbing stairs", "House robber", "Coin change", "Fibonacci-like recurrence"],
    topicSlug: "dynamic-programming",
    topicName: "Dynamic Programming",
  },
  {
    pattern: "2D Dynamic Programming",
    description: "Build solution in a 2D grid. Each cell depends on neighboring cells or two sequences.",
    signals: ["Edit distance", "Longest common subsequence", "Grid paths", "Knapsack"],
    topicSlug: "dynamic-programming",
    topicName: "Dynamic Programming",
  },
  {
    pattern: "Greedy",
    description: "Make the locally optimal choice at each step. Works when local leads to global optimum.",
    signals: ["Jump game", "Gas station", "Task scheduling", "Activity selection"],
    topicSlug: "greedy",
    topicName: "Greedy Algorithms",
  },
  {
    pattern: "Merge Intervals",
    description: "Sort intervals and process in order. Merge overlapping, find gaps, count overlaps.",
    signals: ["Merge overlapping intervals", "Insert interval", "Meeting rooms", "Non-overlapping intervals"],
    topicSlug: "intervals",
    topicName: "Intervals",
  },
  {
    pattern: "Bit Manipulation",
    description: "Use XOR, AND, OR, and shift operations. XOR cancels duplicates to find unique elements.",
    signals: ["Single number", "Power of 2", "Count set bits", "XOR tricks"],
    topicSlug: "bit-manipulation",
    topicName: "Bit Manipulation",
  },
  {
    pattern: "Union Find",
    description: "Disjoint set for grouping elements. Efficiently check connectivity and merge groups.",
    signals: ["Connected components", "Redundant connection", "Accounts merge", "Dynamic grouping"],
    topicSlug: "union-find",
    topicName: "Union Find",
  },
  {
    pattern: "Prefix Sum",
    description: "Precompute cumulative sums for O(1) range queries. Combines with hash maps for subarray sums.",
    signals: ["Range sum query", "Subarray sum equals k", "Product except self", "Running total"],
    topicSlug: "prefix-sum",
    topicName: "Prefix Sum",
  },
  {
    pattern: "Kadane's Algorithm",
    description: "Find maximum subarray sum in O(n). At each position, extend current subarray or start new.",
    signals: ["Maximum subarray", "Maximum circular subarray", "Best time to buy/sell stock"],
    topicSlug: "recursion",
    topicName: "Recursion & Divide and Conquer",
  },
];

export default function PatternsPage() {
  return (
    <div className="max-w-5xl">
      <div className="mb-6 sm:mb-8">
        <h1 className="text-2xl sm:text-3xl font-bold text-white mb-2">Pattern Guide</h1>
        <p className="text-gray-400">
          The key to solving problems is recognizing which pattern fits. Use
          these signals to identify the right approach.
        </p>
      </div>

      {/* Decision Tree Summary */}
      <div className="card mb-8 bg-indigo-950/20 border-indigo-500/20">
        <h2 className="text-lg font-semibold text-indigo-400 mb-4">
          Quick Decision Guide
        </h2>
        <div className="text-sm text-gray-300 space-y-2">
          <p>
            <span className="text-gray-500">If the input is sorted →</span>{" "}
            <span className="text-indigo-400">Binary Search</span> or{" "}
            <span className="text-indigo-400">Two Pointers</span>
          </p>
          <p>
            <span className="text-gray-500">If asking for all permutations/combinations →</span>{" "}
            <span className="text-indigo-400">Backtracking</span>
          </p>
          <p>
            <span className="text-gray-500">If it involves a tree →</span>{" "}
            <span className="text-indigo-400">DFS</span> or{" "}
            <span className="text-indigo-400">BFS</span>
          </p>
          <p>
            <span className="text-gray-500">If shortest path (unweighted) →</span>{" "}
            <span className="text-indigo-400">Graph BFS</span>
          </p>
          <p>
            <span className="text-gray-500">If optimal substructure + overlapping subproblems →</span>{" "}
            <span className="text-indigo-400">Dynamic Programming</span>
          </p>
          <p>
            <span className="text-gray-500">If max/min subarray or substring →</span>{" "}
            <span className="text-indigo-400">Sliding Window</span> or{" "}
            <span className="text-indigo-400">Kadane&apos;s</span>
          </p>
          <p>
            <span className="text-gray-500">If O(1) lookup needed →</span>{" "}
            <span className="text-indigo-400">Hash Map</span>
          </p>
          <p>
            <span className="text-gray-500">If matching/nesting →</span>{" "}
            <span className="text-indigo-400">Stack</span>
          </p>
          <p>
            <span className="text-gray-500">If linked list cycle/middle →</span>{" "}
            <span className="text-indigo-400">Fast & Slow Pointers</span>
          </p>
          <p>
            <span className="text-gray-500">If task ordering with dependencies →</span>{" "}
            <span className="text-indigo-400">Topological Sort</span>
          </p>
          <p>
            <span className="text-gray-500">If prefix-based string search →</span>{" "}
            <span className="text-indigo-400">Trie</span>
          </p>
          <p>
            <span className="text-gray-500">If top-K elements or merge-K lists →</span>{" "}
            <span className="text-indigo-400">Heap</span>
          </p>
          <p>
            <span className="text-gray-500">If merging/overlapping time ranges →</span>{" "}
            <span className="text-indigo-400">Merge Intervals</span>
          </p>
          <p>
            <span className="text-gray-500">If grouping/connectivity in graph →</span>{" "}
            <span className="text-indigo-400">Union Find</span>
          </p>
          <p>
            <span className="text-gray-500">If range sum queries →</span>{" "}
            <span className="text-indigo-400">Prefix Sum</span>
          </p>
          <p>
            <span className="text-gray-500">If finding unique among duplicates →</span>{" "}
            <span className="text-indigo-400">Bit Manipulation (XOR)</span>
          </p>
          <p>
            <span className="text-gray-500">If minimize-max or maximize-min →</span>{" "}
            <span className="text-indigo-400">Binary Search on Answer</span>
          </p>
          <p>
            <span className="text-gray-500">If locally optimal = globally optimal →</span>{" "}
            <span className="text-indigo-400">Greedy</span>
          </p>
        </div>
      </div>

      {/* Pattern Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 sm:gap-4">
        {patterns.map((p) => (
          <PatternCard key={p.pattern} {...p} />
        ))}
      </div>
    </div>
  );
}
