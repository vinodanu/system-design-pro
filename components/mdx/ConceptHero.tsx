/** High-resolution concept artwork for all 23 lessons. */
const repo = process.env.GITHUB_REPOSITORY?.split('/')[1] ?? '';
const basePath = process.env.GITHUB_PAGES === 'true' && repo && !repo.endsWith('.github.io') ? `/${repo}` : '';
export const featuredConcepts = new Set(['api-gateway','backpressure','cache-aside','cap-and-consistency','cdn-and-ttl','chat-system','consistent-hashing','dns-explained','how-the-internet-works','http-https','indexing','kafka-fundamentals','leader-election','load-balancer-algorithms','microservices-tradeoffs','payment-system','queues-vs-events','rate-limiting','retries-circuit-breakers','sharding-and-replication','sql-vs-nosql','threads-vs-webflux','url-shortener']);
export default function ConceptHero({topic,title}:{topic:string;title:string}){
  const isFeatured = featuredConcepts.has(topic);
  const src = isFeatured ? `${basePath}/concept-art/${topic}.png` : `${basePath}/illustrations/${topic}.svg`;
  return <div className={`hero-scene ${isFeatured ? 'hero-scene-photoreal' : ''}`}><img src={src} alt={`3D illustration of ${title}`} width={1648} height={928} decoding="async" fetchPriority="high"/><span className="hero-scene-badge">✦ Concept illustration</span></div>;
}
