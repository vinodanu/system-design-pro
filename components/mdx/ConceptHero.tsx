/**
 * High-resolution AI-generated artwork for all 23 lessons.
 */

import { assetPath } from "@/lib/assetPath";

export const featuredConcepts = new Set([
    "api-gateway",
    "backpressure",
    "cache-aside",
    "cap-and-consistency",
    "cdn-and-ttl",
    "chat-system",
    "consistent-hashing",
    "dns-explained",
    "how-the-internet-works",
    "http-https",
    "indexing",
    "kafka-fundamentals",
    "leader-election",
    "load-balancer-algorithms",
    "microservices-tradeoffs",
    "payment-system",
    "queues-vs-events",
    "rate-limiting",
    "retries-circuit-breakers",
    "sharding-and-replication",
    "sql-vs-nosql",
    "threads-vs-webflux",
    "url-shortener",
]);

interface ConceptHeroProps {
    topic: string;
    title: string;
}

export default function ConceptHero({
                                        topic,
                                        title,
                                    }: ConceptHeroProps) {
    const isFeatured = featuredConcepts.has(topic);

    const imagePath = isFeatured
        ? `/concept-art/${topic}.png`
        : `/illustrations/${topic}.svg`;

    const src = assetPath(imagePath);

    return (
        <div
            className={`hero-scene ${
                isFeatured ? "hero-scene-photoreal" : ""
            }`}
        >
            <img
                src={src}
                alt={`3D illustration of ${title}`}
                width={1648}
                height={928}
                decoding="async"
                fetchPriority="high"
            />

            <span className="hero-scene-badge">
        ✦ Concept illustration
      </span>
        </div>
    );
}