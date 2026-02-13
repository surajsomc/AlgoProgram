import { prisma } from "@/lib/prisma";
import { notFound } from "next/navigation";
import Link from "next/link";
import PrintButton from "./PrintButton";

export const dynamic = "force-dynamic";

export default async function CheatSheetPage({
  params,
}: {
  params: { slug: string };
}) {
  const topic = await prisma.topic.findUnique({
    where: { slug: params.slug },
    include: {
      concepts: { orderBy: { order: "asc" } },
    },
  });

  if (!topic) notFound();

  return (
    <div className="max-w-5xl">
      <div className="flex items-center gap-2 text-xs text-gray-600 mb-6 font-mono">
        <Link href={`/topics/${topic.slug}`} className="hover:text-accent transition-colors">
          {topic.name}
        </Link>
        <span className="text-gray-800">/</span>
        <span className="text-gray-500">Cheat Sheet</span>
      </div>

      <div className="flex items-center justify-between mb-8">
        <div>
          <h1 className="text-2xl sm:text-3xl font-bold text-white mb-2 tracking-tight">
            {topic.icon} {topic.name} Cheat Sheet
          </h1>
          <p className="text-gray-600 text-sm">Quick reference for all patterns</p>
        </div>
        <PrintButton />
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {topic.concepts.map((concept) => (
          <div key={concept.id} className="card">
            <h3 className="text-sm font-semibold text-accent mb-2">{concept.title}</h3>

            {concept.whenToUse && (
              <div className="mb-2">
                <p className="text-[10px] text-gray-600 uppercase tracking-wider font-mono mb-0.5">When to use</p>
                <p className="text-xs text-gray-400">{concept.whenToUse}</p>
              </div>
            )}

            {(concept.timeComplexity || concept.spaceComplexity) && (
              <div className="flex gap-3 mb-2">
                {concept.timeComplexity && (
                  <span className="text-xs font-mono">
                    <span className="text-gray-600">T: </span>
                    <span className="text-emerald-400">{concept.timeComplexity}</span>
                  </span>
                )}
                {concept.spaceComplexity && (
                  <span className="text-xs font-mono">
                    <span className="text-gray-600">S: </span>
                    <span className="text-amber-400">{concept.spaceComplexity}</span>
                  </span>
                )}
              </div>
            )}

            {concept.codeExample && (
              <pre className="text-[11px] text-gray-500 font-mono bg-white/[0.02] p-2 overflow-x-auto border border-white/[0.04] whitespace-pre">
                {concept.codeExample}
              </pre>
            )}
          </div>
        ))}
      </div>
    </div>
  );
}
